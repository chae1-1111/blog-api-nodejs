const mongoose = require("mongoose");
const mongoConf = require("../config/mongoDB.json");

const autoIncrement = require("mongoose-sequence")(mongoose);

const connectDB = () => {
    mongoose.Promise = global.Promise;

    mongoose.connect(mongoConf.uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    (global as any).database = mongoose.connection;
    (global as any).database.on("error", () =>
        console.error.bind(console, "Connect Error in MongoDB!")
    );
    (global as any).database.on("open", () => {
        console.log("Connect Database!");

        // 회원 관련 스키마
        (global as any).MemberSchema = mongoose.Schema(
            {
                UserKey: Number,
                UserType: String,
                UserId: String,
                UserPw: String,
                Email: String,
                Name: String,
                Birth: String,
                Keyword: [],
                Created: Date,
            },
            { versionKey: false }
        );

        // 게시글 관련 스키마
        (global as any).PostSchema = mongoose.Schema(
            {
                PostKey: Number,
                Title: String,
                Description: String,
                Keyword: [],
                Category: String,
                UserKey: Number,
                Name: String,
                UserId: String,
                Created: Date,
                Views: Number,
                Likes: Number,
            },
            { versionKey: false }
        );

        // 추천 스키마
        (global as any).LikeSchema = mongoose.Schema(
            {
                PostKey: Number,
                UserKey: Number,
            },
            { versionKey: false }
        );

        // 유저키 자동 증가
        (global as any).MemberSchema.plugin(autoIncrement, {
            inc_field: "UserKey",
        });

        (global as any).MemberModel = mongoose.model(
            "member",
            (global as any).MemberSchema
        );

        // 게시글키 자동 증가
        (global as any).PostSchema.plugin(autoIncrement, {
            inc_field: "PostKey",
        });

        (global as any).PostModel = mongoose.model(
            "post",
            (global as any).PostSchema
        );

        (global as any).LikeModel = mongoose.model(
            "like",
            (global as any).LikeSchema
        );
    });
};

module.exports = connectDB;
