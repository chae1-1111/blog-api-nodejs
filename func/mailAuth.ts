const nodemailer = require("nodemailer");

// 메일 계정 정보
// { "user" : String, "pass" : String }
const senderInfo = require("../config/mailSenderInfo.json");

const mailSender = {
    sendGmail: async (email: string, callback: Function) => {
        return new Promise(async (resolve, reject) => {
            let transporter = nodemailer.createTransport({
                // Gmail 이용
                service: "gmail",
                port: 587,
                host: "smtp.gmail.com",
                secure: false,
                auth: {
                    user: senderInfo.user,
                    pass: senderInfo.pass,
                },
            });

            // 랜덤 6자리 36진수 코드
            let authCode = Math.random().toString(36).substr(2, 8);

            // 메일 정보
            let mailOptions = {
                from: senderInfo.user,
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
    },
};

module.exports = mailSender;
