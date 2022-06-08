export const memberRouter = require("express").Router();

// Controller
import {
    deleteUser,
    emailCheck,
    getUserid,
    idCheck,
    joinUser,
    login,
    modifyUser,
} from "../controller/memberCont";

// interfaces
import {
    joinUserForm,
    loginForm,
    modifyUserForm,
    userFilterForm,
} from "../interfaces";

// Tools
import { removeUndefined } from "../func/tools";
import { auth, idInquery } from "../func/mail";

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
        UserId: req.body.userid,
        UserPw: req.body.userpw,
    };

    // 변경할 내용, undefined 제거
    let user: modifyUserForm = removeUndefined({
        UserPw: req.body.newPw,
        Email: req.body.newEmail,
        Name: req.body.newName,
        Birth: req.body.newBirth,
        Keyword: req.body.newKeyword ? [...req.body.newKeyword] : undefined,
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

// 회원 탈퇴
memberRouter.route("/general").delete(async (req: any, res: any) => {
    // 사용자 정보
    let user: userFilterForm = {
        UserKey: req.body.userkey,
        UserId: req.body.userid,
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

memberRouter.route("/idInquery").get(async (req: any, res: any) => {
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
                let result: String = await idInquery(
                    req.body.email,
                    req.body.userid
                );

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
