const memberRouter = require("express").Router();

const memberCont = require("../controller/memberCont");

memberRouter.route("/").post((req: any, res: any) => {
    let user = {
        UserId: req.body.userid,
        UserPw: req.body.userpw,
        Email: req.body.email,
        Name: req.body.name ? req.body.name : req.body.userid,
        Birth: req.body.birthday ? req.body.birthday : null,
        Keyword: [...req.body.keyword],
    };
    memberCont.join(user, (err: any, result: any) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                status: 500,
                errorCode: "999",
            });
        } else {
            res.status(200).json({
                status: 200,
                errorCode: null,
            });
        }
    });
});

memberRouter.route("/").get((req: any, res: any) => {
    let user = { UserId: req.query.userid, UserPw: req.query.userpw };
    console.log(user);
    memberCont.login(user, (err: any, result: any) => {
        if (err) {
            res.status(500).json({
                status: 500,
                errorCode: "999",
            });
        } else {
            if (result.length === 0) {
                res.status(201).json({
                    status: 201,
                    errorCode: "MEM001",
                });
            } else {
                res.status(200).json({
                    status: 200,
                    errorCode: null,
                    body: {
                        ...result,
                    },
                });
            }
        }
    });
});

module.exports = memberRouter;
