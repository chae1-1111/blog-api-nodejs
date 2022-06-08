const nodemailer = require("nodemailer");

// 메일 계정 정보
import { user, pass } from "../config/mailSenderInfo";

export const auth: Function = async (email: String): Promise<String> => {
    return new Promise(async (resolve, reject) => {
        let transporter = nodemailer.createTransport({
            // Gmail 이용
            service: "gmail",
            port: 587,
            host: "smtp.gmail.com",
            secure: false,
            auth: {
                user: user,
                pass: pass,
            },
        });

        // 랜덤 6자리 36진수 코드
        let authCode = Math.random().toString(36).substr(2, 8);

        // 메일 정보
        let mailOptions = {
            from: user,
            to: email,
            subject: "블로그 인증번호",
            text:
                "아래 인증번호를 복사하여 인증 페이지에 입력해주세요.\n인증번호 : " +
                authCode,
        };
        try {
            await transporter.sendMail(mailOptions);
            resolve(authCode);
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};

export const idInquery: Function = async (
    email: String,
    userid: String
): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        let transporter = nodemailer.createTransport({
            // Gmail 이용
            service: "gmail",
            port: 587,
            host: "smtp.gmail.com",
            secure: false,
            auth: {
                user: user,
                pass: pass,
            },
        });

        // 메일 정보
        let mailOptions = {
            from: user,
            to: email,
            subject: "블로그 아이디 찾기",
            html:
                "<p>아이디 : " +
                userid +
                "입니다.</p><a href='http://localhost:3000/login'><input type='button' value='로그인하러가기'/></a>",
        };
        try {
            await transporter.sendMail(mailOptions);
            resolve(true);
        } catch (err) {
            console.log(err);
            reject();
        }
    });
};
