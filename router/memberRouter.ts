export const memberRouter = require("express").Router();
const multer = require("multer");

// Controller
import {
    deleteUser,
    emailCheck,
    getUserid,
    idCheck,
    joinUser,
    login,
    modifyUser,
    getUserPw,
    getToken,
    getTokenUser,
    resetPw,
    modifyPw,
    getUserInfo,
    editProfileImage,
    getProfileImage,
    getBlogInfo,
    getCategories,
    setCategories,
    isOwner,
} from "../controller/memberCont";

import { getPostCountAll } from "../controller/postCont";

// interfaces
import {
    joinUserForm,
    loginForm,
    modifyUserForm,
    userFilterForm,
} from "../interfaces";

// Tools
import { removeUndefined } from "../func/tools";
import { auth, idInquiry, pwInquiry } from "../func/mail";
import { modifyCategory, removeCategory } from "../controller/postCont";

// 메일 인증
memberRouter.route("/general/email").post(async (req: any, res: any) => {
    try {
        // 이메일 중복 체크
        let flag: boolean = await emailCheck(req.body.email);
        if (!flag) {
            // 이메일 중복
            res.status(201).json({
                status: 201,
                errorCode: "MEM001",
            });
            return;
        }

        try {
            // 이메일 발송
            let authCode: String = await auth(req.body.email);
            res.status(200).json({
                status: 200,
                // 메일로 발송한 인증코드
                authCode: authCode,
                errorCode: null,
            });
        } catch (err) {
            res.status(500).json({
                status: 500,
                errorCode: "999",
            });
        }
    } catch (err) {
        res.status(500).json({
            status: 500,
            errorCode: "999",
        });
    }
});

// 회원가입
memberRouter.route("/general").post(async (req: any, res: any) => {
    // undefined 제거
    let user: joinUserForm = removeUndefined({
        UserId: req.body.userid,
        UserPw: req.body.userpw,
        Email: req.body.email,
        Name: req.body.name ? req.body.name : req.body.userid,
        Birth: req.body.birthday,
        Keyword: [...req.body.keyword],
    });
    try {
        await joinUser(user);
        // 회원가입 성공
        res.status(200).json({
            status: 200,
            errorCode: null,
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            errorCode: "999",
        });
    }
});

// GET (아이디 중복체크, 로그인)
memberRouter.route("/general").get(async (req: any, res: any) => {
    if (!req.query.userpw) {
        // 아이디 중복체크
        try {
            let result: boolean = await idCheck(req.query.userid);
            res.status(200).json({
                status: 200,
                result: result,
                errorCode: null,
            });
        } catch (err) {
            res.status(500).json({
                status: 500,
                errorCode: "999",
            });
        }
    } else {
        // 로그인
        let user: loginForm = {
            UserId: req.query.userid,
            UserPw: req.query.userpw,
        };
        try {
            let result = await login(user);
            if (result) {
                // 로그인 성공
                res.status(200).json({
                    status: 200,
                    errorCode: null,
                    body: result,
                });
            } else {
                // 로그인 실패 (일치하는 사용자 없음)
                res.status(201).json({
                    status: 201,
                    errorCode: "MEM001",
                });
            }
        } catch (err) {
            res.status(500).json({
                status: 500,
                errorCode: "999",
            });
        }
    }
});

// 회원정보 수정
memberRouter.route("/general").put(async (req: any, res: any) => {
    // 기존 사용자 정보
    let userFilter: userFilterForm = {
        UserKey: req.body.userkey,
        UserPw: req.body.userpw,
    };

    // 변경할 내용, undefined 제거
    let user: modifyUserForm = removeUndefined({
        Email: req.body.email,
        Name: req.body.name,
        Birth: req.body.birth,
        Keyword: req.body.keyword,
    });

    try {
        let result: boolean = await modifyUser(userFilter, user);
        if (!result) {
            // 일치하는 기존 사용자 정보 없음
            res.status(201).json({
                status: 201,
                errorCode: "MEM001",
            });
        } else {
            // 수정 성공
            res.status(200).json({
                status: 200,
                errorCode: null,
            });
        }
    } catch (err) {
        res.status(500).json({
            status: 500,
            errorCode: "999",
        });
    }
});

// 비밀번호 변경
memberRouter.route("/general/modifyPw").put(async (req: any, res: any) => {
    // 기존 사용자 정보
    let userFilter: userFilterForm = {
        UserKey: req.body.userkey,
        UserPw: req.body.userpw,
    };

    try {
        let result: boolean = await modifyPw(userFilter, req.body.newPw);
        if (!result) {
            // 일치하는 기존 사용자 정보 없음
            res.status(201).json({
                status: 201,
                errorCode: "MEM001",
            });
        } else {
            // 수정 성공
            res.status(200).json({
                status: 200,
                errorCode: null,
            });
        }
    } catch (err) {
        res.status(500).json({
            status: 500,
            errorCode: "999",
        });
    }
});

// 회원 탈퇴
memberRouter.route("/general").delete(async (req: any, res: any) => {
    // 사용자 정보
    let user: userFilterForm = {
        UserKey: req.body.userkey,
        UserPw: req.body.userpw,
    };

    try {
        let result: boolean = await deleteUser(user);
        if (!result) {
            // 일치하는 사용자 없음
            res.status(201).json({
                status: 201,
                errorCode: "MEM001",
            });
        } else {
            // 탈퇴 성공
            res.status(200).json({
                status: 200,
                errorCode: null,
            });
        }
    } catch (err) {
        res.status(500).json({
            status: 500,
            errorCode: "999",
        });
    }
});

memberRouter.route("/idInquiry").get(async (req: any, res: any) => {
    try {
        let result: String = await getUserid(req.query.email);
        if (result === "") {
            // 일치하는 사용자 없음
            res.status(201).json({
                status: 201,
                errorCode: "MEM001",
            });
        } else {
            // 일치하는 사용자 있음
            try {
                await idInquiry(req.query.email, result);
                res.status(200).json({
                    status: 200,
                    errorCode: null,
                });
            } catch (err) {
                res.status(500).json({
                    status: 500,
                    errorCode: "999",
                });
            }
        }
    } catch (err) {
        res.status(500).json({
            status: 500,
            errorCode: "999",
        });
    }
});

memberRouter.route("/pwInquiry").get(async (req: any, res: any) => {
    try {
        let result: number = await getUserPw(req.query.userid, req.query.email);
        if (result === 0) {
            // 일치하는 사용자 없음
            res.status(201).json({
                status: 201,
                errorCode: "MEM001",
            });
        } else {
            // 일치하는 사용자 있음
            let token: String = await getToken(
                result,
                req.query.userid,
                req.query.email
            );

            await pwInquiry(req.query.email, token);
            res.status(200).json({
                status: 200,
                errorCode: null,
            });
        }
    } catch (err) {
        res.status(500).json({
            status: 500,
            errorCode: "999",
        });
    }
});

memberRouter.route("/tokenCheck").get(async (req: any, res: any) => {
    try {
        let result = await getTokenUser(req.query.token);
        if (result.isMember) {
            if (result.isExpired) {
                // 토큰 만료
                res.status(201).json({
                    status: 201,
                    errorCode: "TKN001",
                });
            } else {
                res.status(200).json({
                    status: 200,
                    errorCode: null,
                    body: { UserKey: result.UserKey, UserId: result.UserId },
                });
            }
        } else {
            res.status(201).json({
                status: 201,
                errorCode: "MEM001",
            });
        }
    } catch (err) {
        res.status(500).json({
            status: 500,
            errorCode: "999",
        });
    }
});

memberRouter.route("/resetPw").put(async (req: any, res: any) => {
    try {
        let result: boolean = await resetPw(
            req.body.userpw,
            req.body.token,
            req.body.userkey
        );
        if (!result) {
            // 일치하는 사용자 없음
            res.status(201).json({
                status: 201,
                errorCode: "MEM001",
            });
        } else {
            // 수정 성공
            res.status(200).json({
                status: 200,
                errorCode: null,
            });
        }
    } catch (err) {
        res.status(500).json({
            status: 500,
            errorCode: "999",
        });
    }
});

memberRouter.route("/general/getUserInfo").get(async (req: any, res: any) => {
    try {
        let user = await getUserInfo(req.query.userkey);
        if (!user.isUser) {
            res.status(201).json({
                status: 201,
                errorCode: "MEM001",
            });
        } else {
            res.status(200).json({
                status: 200,
                errorCode: null,
                body: {
                    Name: user.Name,
                    Birth: user.Birth,
                    Keyword: user.Keyword,
                },
            });
        }
    } catch (err) {
        res.status(500).json({
            status: 500,
            errorCode: "999",
        });
    }
});

const upload = multer({
    dest: "images/profile/",
    limits: { fileSize: 5 * 1024 * 1024 * 1024 },
});

memberRouter.put(
    "/profileImage",
    upload.single("img"),
    async (req: any, res: any) => {
        try {
            let result = await editProfileImage(
                req.body.userkey,
                req.file.path
            );
            if (!result) {
                res.status(201).json({
                    status: 201,
                    errorCode: "MEM001",
                });
            } else {
                res.status(200).json({
                    status: 200,
                    errorCode: null,
                });
            }
        } catch (err) {
            res.status(500).json({
                status: 500,
                errorCode: "999",
            });
        }
    }
);

memberRouter.route("/getProfileImage").get(async (req: any, res: any) => {
    try {
        let profileImage = await getProfileImage(req.query.userid);
        if (!profileImage) {
            res.status(201).json({
                status: 201,
                errorCode: "MEM001",
            });
        } else {
            res.status(200).json({
                status: 200,
                errorCode: null,
                image: profileImage,
            });
        }
    } catch (err) {
        res.status(500).json({
            status: 500,
            errorCode: "999",
        });
    }
});

memberRouter.route("/getBlogInfo").get(async (req: any, res: any) => {
    try {
        let blogInfo = await getBlogInfo(req.query.userid);
        if (!blogInfo.isUser) {
            res.status(201).json({
                status: 201,
                errorCode: "MEM001",
            });
        } else {
            let categoryCount = await getPostCountAll(
                req.query.userid,
                blogInfo.Categories
            );
            // 블로그 소유자 여부
            let owner: Boolean = await isOwner(
                req.query.userid,
                req.query.userkey ? req.query.userkey : -1
            );

            res.status(200).json({
                status: 200,
                errorCode: null,
                body: {
                    Email: blogInfo.Email,
                    Name: blogInfo.Name,
                    ProfileImage: blogInfo.ProfileImage,
                    CategoryInfo: categoryCount,
                    isOwner: owner,
                },
            });
        }
    } catch (err) {
        res.status(500).json({
            status: 500,
            errorCode: "999",
        });
    }
});

memberRouter.route("/getCategories").get(async (req: any, res: any) => {
    try {
        let categories = (await getCategories(req.query.userkey)) as String[];

        res.status(200).json({
            status: 200,
            errorCode: null,
            body: { Categories: categories },
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            errorCode: "999",
        });
    }
});

interface modifiedCategory {
    exists: string;
    new: string;
}

memberRouter.route("/setCategories").put(async (req: any, res: any) => {
    try {
        let category = [] as string[];
        let modifiedCategory = [] as modifiedCategory[];
        req.body.Categories.forEach((c: any) => {
            category.push(c.Category);
            if (!c.isNew && c.Category !== c.existingCategory) {
                modifiedCategory.push({
                    exists: c.existingCategory,
                    new: c.Category,
                } as modifiedCategory);
            }
        });
        let result = await setCategories(req.body.userkey, category);
        !result &&
            res.status(201).json({
                status: 201,
                errorCode: "MEM001",
            });
        req.body.deletedCategory.length > 0 &&
            (await removeCategory(req.body.userkey, req.body.deletedCategory));
        modifiedCategory.length > 0 &&
            (await modifyCategory(req.body.userkey, modifiedCategory));
        res.status(200).json({
            status: 200,
            errorCode: null,
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            errorCode: "999",
        });
    }
});
