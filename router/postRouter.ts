const postRouter = require("express").Router();

// Controller
const postCont = require("../controller/postCont");
const memCont = require("../controller/memberCont");
const likeCont = require("../controller/likeCont");

// Tools
const postTools = require("../func/tools");

// 게시글 등록
postRouter.route("/").post(async (req: any, res: any) => {
    try {
        // 사용자 정보 가져오기(userid, name)
        let user = await memCont.getUser(req.body.userkey);
        if (!user) {
            // 일치하는 사용자 없음
            res.status(201).json({
                status: 201,
                errorCode: "MEM001",
            });
            return;
        }
        let post = {
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
            let postkey = await postCont.regist(post);
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
postRouter.route("/list/:userid").get(async (req: any, res: any) => {
    try {
        // 블로그 소유자 여부
        let owner = await memCont.isOwner(req.params.userid, req.query.userkey);

        // 게시글 정보
        let result = await postCont.getAllPost(req.params.userid);
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
postRouter.route("/:postkey").get(async (req: any, res: any) => {
    try {
        // 게시글 조회수 증가
        await postCont.view(req.params.postkey);

        // 게시글 정보, 게시글 작성자 여부
        let result = await postCont.getPost(
            req.params.postkey,
            req.query.userkey
        );
        // 게시글 기추천 여부
        let isLiker = await likeCont.isLiker();

        res.status(200).json({
            status: 200,
            errorCode: null,
            data: { ...result, isLiker: isLiker },
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
    let filter = {
        PostKey: req.body.postkey,
        UserKey: req.body.userkey,
    };

    // 수정할 데이터, undefined 제거
    let data = postTools.removeUndefined({
        Title: req.body.title,
        Description: req.body.description,
        Keyword: [...req.body.keyword],
        Category: req.body.category,
    });

    try {
        let result = await postCont.modify(filter, data);
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
    let data = {
        PostKey: req.body.postkey,
        UserKey: req.body.userkey,
    };
    try {
        let result = await postCont.remove(data);
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
postRouter.route("/:like").put(async (req: any, res: any) => {
    try {
        if (req.params.like === "like") {
            // "/post/like" 요청인 경우 추천수 증가

            // 게시글 정보 내 추천수 증가
            await postCont.like(req.body.postkey);

            // 추천 스키마에 추가
            await likeCont.like({
                UserKey: req.body.userkey,
                PostKey: req.body.postkey,
            });
        } else if (req.params.like === "unlike") {
            // "/post/unlike" 요청인 경우 추천수 증가

            // 게시글 정보 내 추천수 감소
            await postCont.unlike(req.body.postkey);

            // 추천 스키마에서 제거
            await likeCont.unlike({
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

module.exports = postRouter;
