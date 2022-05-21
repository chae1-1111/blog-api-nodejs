const memberController = {
    // 회원가입
    join: async (user: any) => {
        return new Promise(async (resolve, reject) => {
            const member = new (global as any).MemberModel({
                ...user,
                // 일반회원
                UserType: "mem0001",
                // 현재시간
                Created: new Date().toISOString(),
            });
            try {
                await member.save();
                resolve(true);
            } catch (err) {
                console.log(err);
                reject();
            }
        });
    },

    // 로그인
    login: async (user: any) => {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await (global as any).MemberModel.find(
                    { ...user },
                    "-_id UserKey Name"
                );
                resolve(result.length !== 0 ? result[0] : false);
            } catch (err) {
                console.log(err);
                reject();
            }
        });
    },

    // 아이디 중복 체크
    idCheck: async (userid: String) => {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await (global as any).MemberModel.find(
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
    },

    // 이메일 중복 체크
    emailCheck: async (email: string) => {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await (global as any).MemberModel.find(
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
    },

    // 회원정보 수정
    modify: async (userFilter: any, user: any) => {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await (global as any).MemberModel.updateOne(
                    { ...userFilter },
                    { $set: { ...user } }
                );
                // 일치하는 사용자 정보 없으면 false
                resolve(result.matchedCount === 0 ? false : true);
            } catch (err) {
                console.log(err);
                reject(err);
            }
        });
    },

    // 회원 탈퇴
    delete: async (user: any) => {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await (global as any).MemberModel.deleteOne({
                    ...user,
                });
                // 일치하는 사용자 정보 없으면 false
                resolve(result.deletedCount === 0 ? false : true);
            } catch (err) {
                console.log(err);
                reject();
            }
        });
    },

    // 사용자 정보 조회(userid, name)
    getUser: async (userkey: number) => {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await (global as any).MemberModel.find(
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
    },

    // 블로그 소유자 여부
    isOwner: async (userid: String, userkey: number) => {
        return new Promise((resolve, reject) => {
            try {
                let result = (global as any).MemberModel.find(
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
    },
};

module.exports = memberController;
