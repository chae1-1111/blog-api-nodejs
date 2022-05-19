const postRouter = require("express").Router();

const postCont = require("../controller/postCont");

postRouter.route("/").post((req: any, res: any) => {
    let post = {
        Title: req.body.title,
        Description: req.body.descrition,
        Keyword: [...req.body.keyword],
        Category: req.body.category,
        UserKey: req.body.userkey,
        Name: req.body.name,
    };
    postCont.regist(post, (err: any, result: any) => {
        if (err) {
            res.status(500).json({
                status: 500,
                errorCode: "999",
            });
        } else {
            res.status(200).json({
                status: 200,
                postkey: result,
                errorCode: null,
            });
        }
    });
});

postRouter.route("/:userkey").get((req: any, res: any) => {
    postCont.getAllPost(req.params.userkey, (err: any, result: any) => {
        if (err) {
            res.status(500).json({
                status: 500,
                errorCode: "999",
            });
        } else {
            res.status(200).json({
                status: 200,
                errorCode: null,
                data: result,
            });
        }
    });
});

module.exports = postRouter;
