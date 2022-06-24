import { Like } from "../interfaces";
import { LikeModel } from "./connectDB";

// 추천하기
export const like: Function = async (data: Like): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            if (await isLiker(data)) resolve(false);
            await new LikeModel({ ...data }).save();
            resolve(true);
        } catch (err) {
            console.log(err);
            reject();
        }
    });
};

// 추천 취소
export const unlike: Function = async (data: Like): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!(await isLiker(data))) resolve(false);
            let result = await LikeModel.deleteOne({
                ...data,
            });
            resolve(result.deletedCount === 0 ? false : true);
        } catch (err) {
            console.log(err);
            reject();
        }
    });
};

// 기추천자 여부
export const isLiker: Function = async (data: Like): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await LikeModel.find({ ...data }, "_id");
            resolve(result.length === 0 ? false : true);
        } catch (err) {
            console.log(err);
            reject();
        }
    });
};

// 사용자가 추천한 게시글 리스트
export const getLikePost: Function = async (
    userkey: Number
): Promise<{ PostKey: Number }[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await LikeModel.find(
                { UserKey: userkey },
                "-_id, PostKey"
            );
            resolve(result);
        } catch (err) {
            console.log(err);
            reject();
        }
    });
};
