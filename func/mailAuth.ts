const nodemailer = require("nodemailer");
const senderInfo = require("../config/mailSenderInfo.json");

const mailSender = {
    sendGmail: (email: string, callback: Function) => {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            host: "smtp.gmail.com",
            secure: false,
            auth: {
                user: senderInfo.user,
                pass: senderInfo.pass,
            },
        });

        let authCode = Math.random().toString(36).substr(2, 8);

        let mailOptions = {
            from: senderInfo.user,
            to: email,
            subject: "블로그 인증번호",
            text:
                "아래 인증번호를 복사하여 인증 페이지에 입력해주세요.\n인증번호 : " +
                authCode,
        };

        transporter.sendMail(mailOptions, (err: any, result: any) => {
            if (err) {
                console.log(err);
                callback(err, null);
            } else {
                callback(null, authCode);
            }
        });
    },
};

module.exports = mailSender;
