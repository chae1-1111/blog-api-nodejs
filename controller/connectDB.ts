import { Schema, model, connect, connection } from "mongoose";
import { User, Post, Reply, Like, mailToken } from "../interfaces"; // 인터페이스
import { uri } from "../config/mongoDB"; // MongoDB URI 정보

// 자동 증가
const autoIncrement = require("mongoose-sequence")(require("mongoose"));

// 회원 스키마
export const UserSchema = new Schema<User>({
    UserKey: { type: Number, unique: true, require: true },
    UserType: { type: String, require: true },
    UserId: { type: String, unique: true, require: true },
    UserPw: { type: String, require: true },
    Email: { type: String, unique: true, require: true },
    Name: {
        type: String,
        unique: true,
        require: true,
        default: function (): number {
            return this.UserId;
        },
    },
    Birth: { type: String },
    Keyword: { type: [String], require: true },
    Salt: { type: String, require: true },
    Created: { type: Date, default: Date.now, require: true },
    ProfileImage: { type: String, default: "" },
    Categories: { type: [String], default: [], require: true },
});

// UserKey 자동증가
UserSchema.plugin(autoIncrement, { inc_field: "UserKey" });

// 회원 모델
export const UserModel = model<User>("user", UserSchema);

// 게시글 스키마
export const PostSchema = new Schema<Post>({
    PostKey: { type: Number, unique: true, require: true },
    Title: { type: String, require: true },
    Description: { type: String },
    Keyword: { type: [String] },
    Category: { type: String, require: true },
    UserKey: { type: Number, require: true },
    Name: { type: String, require: true },
    UserId: { type: String, require: true },
    Created: { type: Date, default: Date.now, require: true },
    Views: { type: Number, default: 0, require: true },
    Likes: { type: Number, default: 0, require: true },
    Replys: { type: Number, default: 0, require: true },
});

// PostKey 자동증가
PostSchema.plugin(autoIncrement, { inc_field: "PostKey" });

// 게시글 모델
export const PostModel = model<Post>("post", PostSchema);

// 댓글 관련 스키마
export const ReplySchema = new Schema<Reply>({
    PostKey: { type: Number, require: true },
    ReplyKey: { type: Number, unique: true, require: true },
    Group: {
        type: String,
        require: true,
    },
    Content: String,
    UserKey: Number,
    Name: String,
    UserId: String,
    Deleted: { type: Boolean, default: false, require: true },
    Created: { type: Date, default: Date.now },
});

// ReplyKey 자동증가
ReplySchema.plugin(autoIncrement, { inc_field: "ReplyKey" });

// 댓글 모델
export const ReplyModel = model<Reply>("reply", ReplySchema);

// 추천 스키마
export const LikeSchema = new Schema<Like>({
    PostKey: { type: Number, require: true },
    UserKey: { type: Number, require: true },
});

// 추천 모델
export const LikeModel = model<Like>("like", LikeSchema);

export const TokenSchema = new Schema<mailToken>({
    UserKey: { type: Number, require: true },
    CreatedDate: { type: Date, default: Date.now, require: true },
    ExpireDate: {
        type: Date,
        default: () => Date.now() + 0.5 * 60 * 60 * 1000,
        required: true,
    },
    Expired: { type: Boolean, default: false, require: true },
    Email: { type: String, require: true },
    UserId: { type: String, require: true },
    Token: { type: String, require: true },
});

export const TokenModel = model<mailToken>("token", TokenSchema);

// DB 연결
const connectDB = () => {
    connect(uri);
};

export const connDB = async () => {
    try {
        connectDB();
        connection.on("error", () => {
            console.error.bind(console, "Connect Error in MongoDB!");
        });
        connection.on("open", () => {
            console.log("Connect Database!");
        });
        connection.on("disconnected", () => {
            connectDB();
        });
    } catch (err) {
        console.log(err);
    }
};
