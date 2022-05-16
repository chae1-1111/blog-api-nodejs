const memberController = {
    join: (user: any, callback: Function) => {
        const member = new (global as any).MemberModel({
            ...user,
            UserType: "mem0001",
            Created: new Date().toISOString(),
        });
        member.save((err: any, result: any) => {
            if (err) {
                console.log(err);
                callback(err, null);
            } else {
                callback(null, result);
            }
        });
    },

    login: (user: any, callback: Function) => {
        (global as any).MemberModel.find(
            { ...user },
            (err: any, result: any) => {
                if (err) {
                    console.log(err);
                    callback(err, null);
                } else {
                    callback(null, result);
                }
            }
        );
    },

    idCheck: (userid: String, callback: Function) => {
        (global as any).MemberModel.find(
            { UserId: userid },
            (err: any, result: any) => {
                if (err) {
                    console.log(err);
                    callback(err, null);
                    return;
                } else {
                    callback(null, result.length == 0 ? true : false);
                }
            }
        );
    },
};

module.exports = memberController;
