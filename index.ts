const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const cors = require("cors");

const connDB = require("./controller/connectDB");

const app = express();
const port = 3000;

const auth = require("./auth/auth.ts");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

app.all("/member", (req: any, res: any, next: any) => {
    const apikey: string = req.headers.authorization;
    if (!auth(apikey)) {
        res.status(403).json({
            status: 403,
            errorCode: "AP001",
        });
    } else {
        next();
    }
});

app.use("/member", require("./router/memberRouter"));

app.listen(port, () => {
    console.log(`Running server with port ${port}`);
    connDB();
});
