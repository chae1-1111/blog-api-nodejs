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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

// cors 허용
app.use(cors());

app.all("*", (req: any, res: any, next: any) => {
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
    // db 연결
    connDB();
});
