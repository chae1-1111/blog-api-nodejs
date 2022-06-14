import { Schema, model, connect } from "mongoose";
import { NumberLiteralType } from "typescript";

export interface User {
    UserKey: Number;
    UserType: String;
    UserId: String;
    UserPw: String;
    Email: String;
    Name: String;
    Birth?: String;
    Keyword: Array<String>;
    Salt: String;
    Created: Date;
}

export interface Post {
    PostKey: Number;
    Title: String;
    Description: String;
    Keyword: Array<String>;
    Category: String;
    UserKey: Number;
    Name: String;
    UserId: String;
    Created: Date;
    Views: Number;
    Likes: Number;
    Replys: Number;
}

export interface Reply {
    ReplyKey: Number;
    PostKey: Number;
    UserKey?: Number;
    Group: Number;
    Content?: String;
    UserId?: String;
    Name?: String;
    Created?: Date;
    Deleted: Boolean;
}

export interface Like {
    PostKey: Number;
    UserKey: Number;
}

export interface mailToken {
    ExpireDate: Date;
    Expired: Boolean;
    CreatedDate: Date;
    Token: String;
    Email: String;
    UserId: String;
    UserKey: Number;
}

export interface joinUserForm {
    UserId: String;
    UserPw: String;
    Email: String;
    UserName?: String;
    Birth?: String;
    Keyword: Array<String>;
}

export interface loginForm {
    UserId: String;
    UserPw: String;
}

export interface userFilterForm {
    UserKey: Number;
    UserPw: String;
}

export interface modifyUserForm {
    Email?: String;
    Name?: String;
    Birth?: String;
    Keyword?: Array<String>;
}

export interface postForm {
    Title: String;
    Description: String;
    Keyword: Array<String>;
    Category: String;
    UserKey: Number;
    UserId: String;
    Name: String;
}

export interface postListForm {
    Title: String;
    Description: String;
    Name: String;
    Created: Date;
    PostKey: Number;
    Views: Number;
    Likes: Number;
    UserId: String;
}

export interface postFilterForm {
    PostKey: Number;
    UserKey: Number;
}

export interface modifyPostForm {
    Title?: String;
    Description?: String;
    Keyword?: Array<String>;
    Category?: String;
}

export interface replyForm {
    UserKey: Number;
    PostKey: Number;
    Group?: Number;
    Content: String;
    UserId: String;
    Name: String;
}

export interface replyListForm {
    PostKey: Number;
    ReplyKey: Number;
    Group: Number;
    Content?: String;
    UserId?: String;
    Name?: String;
    isWriter: Boolean;
    Deleted: Boolean;
}

export interface replyFilterForm {
    PostKey: Number;
    UserKey: Number;
    ReplyKey: Number;
}

export interface modifyReplyForm {
    Content: String;
}
