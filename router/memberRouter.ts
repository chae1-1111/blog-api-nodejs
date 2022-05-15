const memberRouter = require("express").Router();

memberRouter.route("/").get((req: any, res: any) => {
    res.writeHeader(200, { "content-type": "text/html;charset=utf-8" });
    res.write("<h2 style='text-align: center;'>Hello!</h2>");
    res.end();
});

module.exports = memberRouter;
