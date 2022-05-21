const likeController = {
    // 추천하기
    like: async (data: any) => {
        return new Promise(async (resolve, reject) => {
            try {
                new (global as any).LikeModel({ ...data }).save();
                resolve(true);
            } catch (err) {
                console.log(err);
                reject();
            }
        });
    },

    // 추천 취소
    unlike: async (data: any) => {
        return new Promise(async (resolve, reject) => {
            try {
                let result = new (global as any).LikeModel.deleteOne({
                    ...data,
                });
                resolve(result.deletedCount === 0 ? false : true);
            } catch (err) {
                console.log(err);
                reject();
            }
        });
    },

    // 기추천자 여부
    isLiker: async (data: any) => {
        return new Promise(async (resolve, reject) => {
            try {
                let result = (global as any).LikeModel.find({ ...data }, "_id");
                resolve(result.length === 0 ? false : true);
            } catch (err) {
                console.log(err);
                reject();
            }
        });
    },

    // 사용자가 추천한 게시글 리스트
    getLikePost: async (userkey: number) => {
        return new Promise(async (resolve, reject) => {
            try {
                let result = new (global as any).LikeModel.find(
                    { UserKey: userkey },
                    "-_id, PostKey"
                );
                resolve(result);
            } catch (err) {
                console.log(err);
                reject();
            }
        });
    },
};

module.exports = likeController;
