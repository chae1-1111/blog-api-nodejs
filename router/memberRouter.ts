const memberRouter = require("express").Router();

const memberCont = require("../controller/memberCont");
const tools = require("../func/tools");
const mailAuth = require("../func/mailAuth");

memberRouter.route("/general").post((req: any, res: any) => {
    if (Object.keys(req.body).toString() === "email") {
        mailAuth.sendGmail(req.body.email, (err: any, result: string) => {
            if (err) {
                res.status(500).json({
                    status: 500,
                    errorCode: "999",
                });
            } else {
                res.status(200).json({
                    status: 200,
                    authCode: result,
                    errorCode: null,
                });
            }
        });
    } else {
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
    }
});

memberRouter.route("/general").get((req: any, res: any) => {
    if (!req.query.userpw) {
        memberCont.idCheck(req.query.userid, (err: any, result: any) => {
            if (err) {
                res.status(500).json({
                    status: 500,
                    result: null,
                    errorCode: "999",
                });
            } else {
                res.status(200).json({
                    status: 200,
                    result: result,
                    errorCode: null,
                });
            }
        });
    } else {
        let user = { UserId: req.query.userid, UserPw: req.query.userpw };
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
    }
});

memberRouter.route("/general").put((req: any, res: any) => {
    let userFilter = {
        UserKey: req.body.userkey,
        UserId: req.body.userid,
        UserPw: req.body.userpw,
    };

    let user = tools.removeUndef({
        UserPw: req.body.newPw,
        Email: req.body.newEmail,
        Name: req.body.newName,
        Birth: req.body.newBirth,
        Keyword: req.body.newKeyword ? [...req.body.newKeyword] : undefined,
    });

    memberCont.modify(userFilter, user, (err: any, result: any) => {
        if (err) {
            res.status(500).json({
                status: 500,
                errorCode: "999",
            });
        } else {
            if (result.matchedCount === 0) {
                res.status(403).json({
                    status: 403,
                    errorCode: "AP002",
                });
            } else {
                res.status(200).json({
                    status: 200,
                    errorCode: null,
                });
            }
        }
    });
});

memberRouter.route("/general").delete((req: any, res: any) => {
    let user = {
        UserKey: req.body.userkey,
        UserId: req.body.userid,
        UserPw: req.body.userpw,
    };

    memberCont.delete(user, (err: any, result: any) => {
        if (err) {
            res.status(500).json({
                status: 500,
                errorCode: "999",
            });
        } else {
            if (result.deletedCount === 0) {
                res.status(403).json({
                    status: 403,
                    errorCode: "AP002",
                });
            } else {
                res.status(200).json({
                    status: 200,
                    errorCode: null,
                });
            }
        }
    });
});

memberRouter.route("/social").post((req: any, res: any) => {});

module.exports = memberRouter;
