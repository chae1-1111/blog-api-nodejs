import { Schema, model, connect, connection } from "mongoose";
import { User, Post, Reply, Like } from "../interfaces"; // 인터페이스
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
    Created: { type: Date, default: Date.now, require: true },
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
    Views: { type: Number, defualt: 0, require: true },
    Likes: { type: Number, defualt: 0, require: true },
});

// PostKey 자동증가
PostSchema.plugin(autoIncrement, { inc_field: "PostKey" });

// 게시글 모델
export const PostModel = model<Post>("post", PostSchema);

export const ReplySchema = new Schema<Reply>({
    PostKey: { type: Number, require: true },
    ReplyKey: { type: Number, unique: true, require: true },
    // Group : 대댓글인 경우 상위 댓글의 key, 일반 댓글인 경우 자기 자신의 key
    Group: {
        type: Number,
        require: true,
        default: function (): number {
            return this.ReplyKey;
        },
    },
    Content: String,
    UserKey: Number,
    Name: String,
    UserId: String,
    Created: { type: Date, default: Date.now },
});

// ReplyKey 자동증가
ReplySchema.plugin(autoIncrement, { inc_field: "ReplyKey" });

export const ReplyModel = model<Reply>("reply", ReplySchema);

export const LikeSchema = new Schema<Like>({
    PostKey: { type: Number, require: true },
    UserKey: { type: Number, require: true },
});

// 추천 모델
export const LikeModel = model<Like>("like", LikeSchema);

const connectDB = () => {
    connect(uri);
};

// DB 연결
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
