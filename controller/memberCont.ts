import { UserModel, TokenModel, UserSchema, TokenSchema } from "./connectDB";
import { encrypt } from "../func/encrypt";

const crypto = require("crypto");

// interfaces
import {
    joinUserForm,
    loginForm,
    modifyUserForm,
    userFilterForm,
} from "../interfaces";

// 회원가입
export const joinUser: Function = async (
    user: joinUserForm
): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        const salt = Math.round(new Date().valueOf() * Math.random()) + "";
        const User = new UserModel({
            ...user,
            UserPw: encrypt(user.UserPw, salt),
            Salt: salt,
            // 일반회원
            UserType: "mem0001",
        });
        try {
            await User.save();
            resolve(true);
        } catch (err) {
            console.log(err);
            reject();
        }
    });
};

// 로그인
export const login: Function = async (user: loginForm) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await UserModel.find(
                { UserId: user.UserId },
                "-_id Salt"
            );
            if (result.length === 0) resolve(false);
            let salt = result[0].Salt;
            result = await UserModel.find(
                { UserId: user.UserId, UserPw: encrypt(user.UserPw, salt) },
                "-_id UserKey Name Email"
            );
            resolve(result.length !== 0 ? result[0] : false);
        } catch (err) {
            console.log(err);
            reject();
        }
    });
};

// 아이디 중복 체크
export const idCheck: Function = async (userid: String): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await UserModel.find(
                {
                    UserId: userid,
                },
                "_id"
            );
            // 일치하는 아이디 없으면 true
            resolve(result.length === 0 ? true : false);
        } catch (err) {
            console.log(err);
            reject();
        }
    });
};

// 이메일 중복 체크
export const emailCheck: Function = async (email: string): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await UserModel.find(
                {
                    Email: email,
                },
                "_id"
            );
            // 일치하는 이메일 없으면 true
            resolve(result.length === 0 ? true : false);
        } catch (err) {
            console.log(err);
            reject();
        }
    });
};

// 회원정보 수정
export const modifyUser: Function = async (
    userFilter: userFilterForm,
    user: modifyUserForm
): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            let temp = await UserModel.find(
                { UserKey: userFilter.UserKey },
                "-_id Salt"
            );
            if (temp.length === 0) resolve(false);
            let salt = temp[0].Salt;

            let result = await UserModel.updateOne(
                {
                    ...userFilter,
                    UserPw: encrypt(userFilter.UserPw, salt),
                },
                {
                    $set: {
                        ...user,
                    },
                }
            );
            // 일치하는 사용자 정보 없으면 false
            resolve(result.matchedCount === 0 ? false : true);
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};

// 비밀번호 수정
export const modifyPw: Function = async (
    userFilter: userFilterForm,
    newPw: String
): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            let temp = await UserModel.find(
                { UserKey: userFilter.UserKey },
                "-_id Salt"
            );
            if (temp.length === 0) resolve(false);
            let salt = temp[0].Salt;
            let newSalt = Math.round(new Date().valueOf() * Math.random()) + "";

            let result = await UserModel.updateOne(
                {
                    ...userFilter,
                    UserPw: encrypt(userFilter.UserPw, salt),
                },
                {
                    $set: {
                        UserPw: encrypt(newPw, newSalt),
                        Salt: newSalt,
                    },
                }
            );
            // 일치하는 사용자 정보 없으면 false
            resolve(result.matchedCount === 0 ? false : true);
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};

// 회원 탈퇴
export const deleteUser: Function = async (
    user: userFilterForm
): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            let temp = await UserModel.find(
                { UserKey: user.UserKey },
                "-_id Salt"
            );
            if (temp.length === 0) resolve(false);
            let salt = temp[0].Salt;

            let result = await UserModel.deleteOne({
                ...user,
                UserPw: encrypt(user.UserPw, salt),
            });
            // 일치하는 사용자 정보 없으면 false
            resolve(result.deletedCount === 0 ? false : true);
        } catch (err) {
            console.log(err);
            reject();
        }
    });
};

// 사용자 정보 조회(userid, name)
export const getUser: Function = async (userkey: Number) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await UserModel.find(
                { UserKey: userkey },
                "-_id UserId Name"
            );
            // 일치하는 사용자 없으면 false
            resolve(result.length === 0 ? false : result[0]);
        } catch (err) {
            console.log(err);
            reject();
        }
    });
};

// 블로그 소유자 여부
export const isOwner: Function = async (
    userid: String,
    userkey: Number
): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await UserModel.find(
                { UserId: userid, UserKey: userkey },
                "_id"
            );
            // 일치하는 사용자 정보 없으면 false
            resolve(result.length === 0 ? false : true);
        } catch (err) {
            console.log(err);
            reject();
        }
    });
};

// 아이디 찾기
export const getUserid: Function = async (email: String): Promise<String> => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await UserModel.find({ Email: email }, "-_id UserId");
            // 일치하는 사용자 없으면 false
            resolve(result.length === 0 ? "" : result[0].UserId);
        } catch (err) {
            console.log(err);
            reject();
        }
    });
};

// 비밀번호 찾기
export const getUserPw: Function = async (
    userid: String,
    email: String
): Promise<Number> => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await UserModel.find(
                { UserId: userid, Email: email },
                "-_id UserKey"
            );
            // 일치하는 사용자 없으면 false
            resolve(result.length === 0 ? 0 : result[0].UserKey);
        } catch (err) {
            console.log(err);
            reject();
        }
    });
};

export const getToken: Function = (
    userkey: Number,
    userid: String,
    email: String
): Promise<String> => {
    return new Promise(async (resolve, reject) => {
        let token = crypto
            .createHash("sha512")
            .update(userkey.toString() + userid + email + Date.now())
            .digest("hex");

        let tokenObj = new TokenModel({
            UserKey: userkey,
            UserId: userid,
            Email: email,
            Token: token,
        });

        try {
            await tokenObj.save();
            resolve(token);
        } catch (err) {
            console.log(err);
            reject();
        }
    });
};

interface user {
    isMember: Boolean;
    UserId: String;
    UserKey: Number;
    isExpired: Boolean;
}

export const getTokenUser: Function = (token: String): Promise<user> => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await TokenModel.find(
                { Token: token },
                "-_id UserKey UserId CreatedDate ExpireDate Expired"
            );

            if (result.length === 0) {
                resolve({
                    isMember: false,
                    UserId: "",
                    UserKey: 0,
                    isExpired: false,
                });
            } else if (result[0].ExpireDate < new Date() || result[0].Expired) {
                resolve({
                    UserId: "",
                    UserKey: 0,
                    isMember: true,
                    isExpired: true,
                });
            } else {
                resolve({
                    UserId: result[0].UserId,
                    UserKey: result[0].UserKey,
                    isMember: true,
                    isExpired: false,
                });
            }
        } catch (err) {
            console.log(err);
            reject();
        }
    });
};

export const resetPw: Function = async (
    userpw: String,
    token: String,
    userkey: Number
): Promise<Boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            const salt = Math.round(new Date().valueOf() * Math.random()) + "";
            encrypt(userpw, salt);
            let search = await TokenModel.find(
                { Token: token, UserKey: userkey },
                "_id"
            );
            if (search.length === 0) {
                resolve(false);
            } else {
                let result = await UserModel.updateOne(
                    { UserKey: userkey },
                    { $set: { UserPw: encrypt(userpw, salt), Salt: salt } }
                );
                if (result.modifiedCount === 0) {
                    resolve(false);
                } else {
                    await TokenModel.updateOne(
                        { Token: token },
                        { $set: { Expired: true } }
                    );
                    resolve(true);
                }
            }
        } catch (err) {
            console.log(err);
            reject();
        }
    });
};

interface UserInfo {
    Name?: String;
    Birth?: String;
    Keyword?: String[];
    isUser: boolean;
}

export const getUserInfo: Function = async (
    userkey: string
): Promise<UserInfo> => {
    return new Promise<UserInfo>(async (resolve, reject) => {
        try {
            let result = await UserModel.find(
                { UserKey: userkey },
                "-_id Name Birth Keyword"
            );
            if (result.length === 0) {
                resolve({
                    isUser: false,
                });
            } else {
                resolve({
                    isUser: true,
                    Name: result[0].Name,
                    Birth: result[0].Birth,
                    Keyword: result[0].Keyword,
                });
            }
        } catch (err) {
            console.log(err);
            reject();
        }
    });
};
