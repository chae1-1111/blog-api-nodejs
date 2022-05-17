const memberRouter = require("express").Router();

const memberCont = require("../controller/memberCont");
const removeUndef = require("../func/removeUndefined");

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
    if (!req.query.userpw) {
        memberCont.idCheck(req.query.userid, (err: any, result: any) => {
            if (err) {
                res.status(500).json({
                    status: 500,
                    result: null,
                    errorCode: "999",
                });
            } else {
                console.log(result);
                res.status(200).json({
                    status: 200,
                    result: result,
                    errorCode: null,
                });
            }
        });
    } else {
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
    }
});

memberRouter.route("/").update((req: any, res: any) => {
    let userFilter = {
        UserKey: req.body.userkey,
        UserId: req.body.userid,
        UserPw: req.body.userpw,
    };

    let user = removeUndef({
        UserPw: req.body.newPw,
        Email: req.body.newEmail,
        Name: req.body.newName,
        Birth: req.body.newBirth,
        Keyword: [...req.body.newKeyword,],
    });
    
    memberCont.modify(userFilter, user, (err, result) => {
        if(err) {
            res.status(500).json({
                status: 500,
                errorCode: "999",
            });
        }else{
            
        }
    })
});

module.exports = memberRouter;
