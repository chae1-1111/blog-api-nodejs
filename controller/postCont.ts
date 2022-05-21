const postController = {
    // 게시글 등록
    regist: async (data: any) => {
        return new Promise(async (resolve, reject) => {
            const post = new (global as any).PostModel({
                ...data,
                // 작성일시
                Created: new Date().toISOString(),
                // 조회수, 추천수 초기값 0
                Views: 0,
                Likes: 0,
            });
            try {
                let result = await post.save();
                // 게시글 postkey 제공
                resolve(result.PostKey);
            } catch (err) {
                console.log(err);
                reject();
            }
        });
    },

    // 특정 사용자 모든 게시글 조회
    getAllPost: async (userid: string) => {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await (global as any).PostModel.find(
                    {
                        UserId: userid,
                    },
                    "-_id Title Name Created PostKey Views Likes UserId"
                );
                resolve(result);
            } catch (err) {
                console.log(err);
                reject();
            }
        });
    },

    // 조회수 증가
    view: async (postkey: number) => {
        return new Promise(async (resolve, reject) => {
            try {
                await (global as any).PostModel.updateOne(
                    { PostKey: postkey },
                    { $inc: { Views: 1 } }
                );
                resolve(true);
            } catch (err) {
                console.log(err);
                reject();
            }
        });
    },

    // 게시글 상세 조회
    getPost: async (postkey: string, userkey: string) => {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await (global as any).PostModel.find(
                    {
                        PostKey: postkey,
                    },
                    "-_id Title Description Created Views Likes Name UserId UserKey"
                );

                // 작성자인지 여부
                let isOwner = result.UserKey == userkey;

                // UserKey 필드 삭제 후 리턴
                delete result["UserKey"];
                resolve({ ...result, isOwner: isOwner });
            } catch (err) {
                console.log(err);
                reject();
            }
        });
    },

    // 게시글 수정
    modify: async (filter: any, data: any) => {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await (global as any).PostModel.updateOne(
                    { ...filter },
                    { $set: { ...data } }
                );
                // 일치하는 게시글 정보 없으면 false
                resolve(result.matchedCount === 0 ? false : true);
            } catch (err) {
                console.log(err);
                reject();
            }
        });
    },

    // 게시글 삭제
    remove: async (data: { PostKey: number; UserKey: number }) => {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await (global as any).PostModel.deleteOne({
                    ...data,
                });
                // 일치하는 게시글 정보 없으면 false
                resolve(result.deletedCount === 0 ? false : true);
            } catch (err) {
                console.log(err);
                reject();
            }
        });
    },

    // 게시글 추천
    like: async (postkey: number) => {
        return new Promise(async (resolve, reject) => {
            try {
                await (global as any).PostModel.updateOne(
                    { PostKey: postkey },
                    // 추천수 증가
                    { $inc: { Likes: 1 } }
                );
                resolve(true);
            } catch (err) {
                console.log(err);
                reject();
            }
        });
    },

    // 게시글 비추천
    unlike: async (postkey: number) => {
        return new Promise(async (resolve, reject) => {
            try {
                await (global as any).PostModel.updateOne(
                    { PostKey: postkey },
                    // 추천수 감소
                    { $inc: { Likes: -1 } }
                );
                resolve(true);
            } catch (err) {
                console.log(err);
                reject();
            }
        });
    },
};

module.exports = postController;
