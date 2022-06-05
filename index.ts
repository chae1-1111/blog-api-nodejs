const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const cors = require("cors");

import { memberRouter } from "./router/memberRouter";
import { postRouter } from "./router/postRouter";

import { connDB } from "./controller/connectDB";
import { auth } from "./auth/auth";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger("dev"));

// cors 허용
app.use(cors());

const router = express.Router();
router.route("/").get((req: any, res: any) => {
    res.write("test");
    res.end();
});

app.use("/test", router);

app.all("*", (req: any, res: any, next: any) => {
    res.header("Access-Control-Allow-Origin", "*");

    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );

    // 모든 요청에 대해 apikey 인증 확인
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

// 라우터 정보
app.use("/member", memberRouter);
app.use("/post", postRouter);

app.listen(port, () => {
    console.log(`Running server with port ${port}`);
    connDB(); // db 연결
});
