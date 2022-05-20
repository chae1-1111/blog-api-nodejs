const postController = {
    regist: (data: any, callback: Function) => {
        const post = new (global as any).PostModel({
            ...data,
            Created: new Date().toISOString(),
            Views: 0,
            Likes: 0,
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
                    const data: any[] = [];
                    result.forEach((post: any) => {
                        data.push({
                            title: post.Title,
                            created: post.Created,
                            postkey: post.PostKey,
                            views: post.Views ? post.Views : 0,
                            likes: post.Likes ? post.Likes : 0,
                        });
                    });
                    callback(null, data);
                }
            }
        );
    },
    view: (postkey: number) => {
        (global as any).PostModel.updateOne(
            { PostKey: postkey },
            { $inc: { Views: 1 } }
        );
    },
    getPost: (postkey: string, callback: Function) => {
        (global as any).PostModel.find(
            {
                PostKey: postkey,
            },
            (err: any, result: any) => {
                if (err) {
                    console.log(err);
                    callback(err, null);
                } else {
                    let data = {
                        title: result[0].Title,
                        description: result[0].Description,
                        created: result[0].Created,
                        views: result[0].Views,
                        likes: result[0].Likes,
                        name: result[0].Name,
                    };
                    callback(null, data);
                }
            }
        );
    },
};

module.exports = postController;
