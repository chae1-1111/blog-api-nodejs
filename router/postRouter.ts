export const postRouter = require("express").Router();

// controllers
import {
    decLikes,
    getAllPost,
    getOnePost,
    getReplyList,
    incLikes,
    incViews,
    modifyPost,
    modifyReply,
    registPost,
    registReply,
    removePost,
    removeReply,
    getPostList,
} from "../controller/postCont";
import { getUser, isOwner } from "../controller/memberCont";
import { isLiker, like, unlike } from "../controller/likeCont";

import { removeUndefined } from "../func/tools";

// interfaces
import {
    Like,
    modifyPostForm,
    postFilterForm,
    postForm,
    postListForm,
    replyFilterForm,
    replyForm,
} from "../interfaces";

// 게시글 등록
postRouter.route("/").post(async (req: any, res: any) => {
    try {
        // 사용자 정보 가져오기(userid, name)
        let user = await getUser(req.body.userkey);
        if (!user) {
            // 일치하는 사용자 없음
            res.status(201).json({
                status: 201,
                errorCode: "MEM001",
            });
            return;
        }
        let post: postForm = {
            Title: req.body.title,
            Description: req.body.descrition,
            Keyword: [...req.body.keyword],
            Category: req.body.category,
            UserKey: req.body.userkey,
            UserId: user.UserId,
            Name: user.Name,
        };
        try {
            // 게시글 등록
            let postkey: Number = await registPost(post);
            res.status(200).json({
                status: 200,
                postkey: postkey,
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

// 특정 사용자 게시글 리스트
postRouter.route("/listAll/:userid").get(async (req: any, res: any) => {
    try {
        // 블로그 소유자 여부
        let owner: Boolean = await isOwner(
            req.params.userid,
            req.query.userkey
        );

        // 게시글 정보
        let result: postListForm[] = await getAllPost(req.params.userid);
        res.status(200).json({
            status: 200,
            errorCode: null,
            owner: owner,
            data: result,
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            errorCode: "999",
        });
    }
});

// 게시글 리스트
postRouter.route("/list/:userid").get(async (req: any, res: any) => {
    try {
        // 블로그 소유자 여부
        let owner: Boolean = await isOwner(
            req.params.userid,
            req.query.userkey ? req.query.userkey : -1
        );

        // 게시글 정보
        let result: postListForm[] = await getPostList(
            req.params.userid,
            req.query.category ? req.query.category : "",
            req.query.page ? req.query.page : 1
        );
        res.status(200).json({
            status: 200,
            errorCode: null,
            owner: owner,
            data: result,
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            errorCode: "999",
        });
    }
});

// 게시글 상세
postRouter.route("/detail/:postkey").get(async (req: any, res: any) => {
    try {
        // 게시글 조회수 증가
        await incViews(req.params.postkey);

        let data: Like = {
            UserKey: req.query.userkey,
            PostKey: req.params.postkey,
        };

        // 게시글 정보, 게시글 작성자 여부
        let result = await getOnePost(
            parseInt(req.params.postkey),
            parseInt(req.query.userkey),
            req.query.userid
        );
        // 게시글 기추천 여부
        let like = await isLiker(data);

        res.status(200).json({
            status: 200,
            errorCode: null,
            data: { ...result, isLiker: like },
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            errorCode: "999",
        });
    }
});

// 게시글 수정
postRouter.route("/").put(async (req: any, res: any) => {
    // 게시글 기본 정보
    let filter: postFilterForm = {
        PostKey: req.body.postkey,
        UserKey: req.body.userkey,
    };

    // 수정할 데이터, undefined 제거
    let data: modifyPostForm = removeUndefined({
        Title: req.body.title,
        Description: req.body.description,
        Keyword: [...req.body.keyword],
        Category: req.body.category,
    });

    try {
        let result: Boolean = await modifyPost(filter, data);
        if (!result) {
            // 일치하는 게시글 정보 없음
            res.status(201).json({
                status: 201,
                errorCode: "PT001",
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

// 게시글 삭제
postRouter.route("/").delete(async (req: any, res: any) => {
    let data: postFilterForm = {
        PostKey: req.body.postkey,
        UserKey: req.body.userkey,
    };
    try {
        let result: Boolean = await removePost(data);
        if (!result) {
            // 일치하는 게시글 없음
            res.status(201).json({
                status: 201,
                errorCode: "PT001",
            });
        } else {
            // 삭제 성공
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

// 게시글 추천
postRouter.route("/like").put(async (req: any, res: any) => {
    try {
        if (req.body.like === "like") {
            // 게시글 정보 내 추천수 증가
            await incLikes(req.body.postkey);

            // 추천 스키마에 추가
            await like({
                UserKey: req.body.userkey,
                PostKey: req.body.postkey,
            });
        } else if (req.body.like === "unlike") {
            // "/post/unlike" 요청인 경우 추천수 증가

            // 게시글 정보 내 추천수 감소
            await decLikes(req.body.postkey);

            // 추천 스키마에서 제거
            await unlike({
                UserKey: req.body.userkey,
                PostKey: req.body.postkey,
            });
        } else {
            // 그 외 요청인 경우 404
            res.status(404).json({
                status: 404,
            });
        }

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

// 댓글 작성
postRouter.route("/reply").post(async (req: any, res: any) => {
    try {
        let user = await getUser(req.body.userkey);
        if (!user) {
            res.status(201).json({
                status: 201,
                errorCode: "MEM001",
            });
            return;
        }
        let data: replyForm = removeUndefined({
            UserKey: req.body.userkey,
            PostKey: req.body.postkey,
            Group: req.body.postkey,
            Content: req.body.content,
            UserId: user.UserId,
            Name: user.Name,
        });
        await registReply(data);
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

// 댓글 리스트 조회
postRouter.route("/reply").get(async (req: any, res: any) => {
    try {
        let result = await getReplyList(req.query.postkey, req.query.userkey);
        res.status(200).json({
            status: 200,
            errorCode: null,
            data: result,
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            errorCode: "999",
        });
    }
});

// 댓글 수정
postRouter.route("/reply").put(async (req: any, res: any) => {
    try {
        let filter: replyFilterForm = {
            PostKey: req.body.postkey,
            UserKey: req.body.userkey,
            ReplyKey: req.body.replykey,
        };
        let result = await modifyReply(filter, { Content: req.body.content });
        if (result) {
            res.status(200).json({
                status: 200,
                errorCode: null,
            });
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

// 댓글 삭제
postRouter.route("/reply").delete(async (req: any, res: any) => {
    try {
        let filter: replyFilterForm = {
            PostKey: req.body.postkey,
            UserKey: req.body.userkey,
            ReplyKey: req.body.replykey,
        };
        let result = await removeReply(filter);
        if (result) {
            res.status(200).json({
                status: 200,
                errorCode: null,
            });
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
