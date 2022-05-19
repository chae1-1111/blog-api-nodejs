const postController = {
    regist: (data: any, callback: Function) => {
        const post = new (global as any).PostModel({
            ...data,
            Created: new Date().toISOString(),
        });
        post.save((err: any, result: any) => {
            if (err) {
                console.log(err);
                callback(err, null);
            } else {
                callback(null, result.PostKey);
            }
        });
    },

    getAllPost: (userkey: string, callback: Function) => {
        (global as any).PostModel.find(
            {
                UserKey: userkey,
            },
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
};

module.exports = postController;
