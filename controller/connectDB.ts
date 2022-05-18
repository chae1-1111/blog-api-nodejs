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

        (global as any).PostSchema = mongoose.Schema(
            {
                PostKey: Number,
                Title: String,
                Description: String,
                Keyword: [],
                UserKey: Number,
                UserId: String,
                Name: String,
                Created: Date,
                Views: Number,
                Likes: Number,
            },
            { versionKey: false }
        );

        (global as any).MemberSchema.plugin(autoIncrement, {
            inc_field: "UserKey",
        });

        (global as any).MemberModel = mongoose.model(
            "member",
            (global as any).MemberSchema
        );
    });
};

module.exports = connectDB;
