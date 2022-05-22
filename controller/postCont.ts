import { PostModel, ReplyModel } from "./connectDB";

import {
    modifyPostForm,
    modifyReplyForm,
    postFilterForm,
    postForm,
    postListForm,
    replyFilterForm,
    replyForm,
    replyListForm,
} from "../interfaces";

// 게시글 등록
export const registPost: Function = async (data: postForm): Promise<Number> => {
    return new Promise(async (resolve, reject) => {
        const post = new PostModel({
            ...data,
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
};

// 특정 사용자 모든 게시글 조회
export const getAllPost: Function = async (
    userid: string
): Promise<postListForm[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            let result: postListForm[] = await PostModel.find(
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
};

// 조회수 증가
export const incViews: Function = async (postkey: Number): Promise<Boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            await PostModel.updateOne(
                { PostKey: postkey },
                { $inc: { Views: 1 } }
            );
            resolve(true);
        } catch (err) {
            console.log(err);
            reject();
        }
    });
};

// 게시글 상세 조회
export const getOnePost: Function = async (
    postkey: String,
    userkey: Number
) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await PostModel.find(
                {
                    PostKey: postkey,
                },
                "-_id Title Description Created Views Likes Name UserId UserKey"
            );

            if (result.length === 0) resolve(false);

            let isOwner = result[0].UserKey == userkey; // 작성자인지 여부

            resolve({
                Title: result[0].Title,
                Description: result[0].Description,
                Created: result[0].Created,
                Views: result[0].Views,
                Likes: result[0].Likes,
                Name: result[0].Name,
                UserId: result[0].UserId,
                isOwner: isOwner,
            });
        } catch (err) {
            console.log(err);
            reject();
        }
    });
};

// 게시글 수정
export const modifyPost: Function = async (
    filter: postFilterForm,
    data: modifyPostForm
): Promise<Boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await PostModel.updateOne(
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
};

// 게시글 삭제
export const removePost: Function = async (
    data: postFilterForm
): Promise<Boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await PostModel.deleteOne({
                ...data,
            });
            // 일치하는 게시글 정보 없으면 false
            resolve(result.deletedCount === 0 ? false : true);
        } catch (err) {
            console.log(err);
            reject();
        }
    });
};

// 게시글 추천
export const incLikes: Function = async (postkey: Number): Promise<Boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            await PostModel.updateOne(
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
};

// 게시글 비추천
export const decLikes: Function = async (postkey: Number): Promise<Boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            await PostModel.updateOne(
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
};

// 댓글 작성
export const registReply: Function = async (
    data: replyForm
): Promise<Boolean> => {
    return new Promise(async (resolve, reject) => {
        let reply = new ReplyModel({
            ...data,
        });
        try {
            // 댓글 정보 저장
            await reply.save();
            // 게시글 댓글 수 증가
            await PostModel.updateOne(
                { PostKey: data.PostKey },
                { $inc: { Replys: 1 } }
            );
            resolve(true);
        } catch (err) {
            console.log(err);
            reject();
        }
    });
};

export const getReplyList: Function = async (
    postkey: Number,
    userkey: Number
): Promise<replyListForm[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await ReplyModel.find(
                { PostKey: postkey },
                "-_id ReplyKey Group Content UserId Name Deleted UserKey"
            );
            let result: replyListForm[] = [];
            data.forEach((reply) => {
                let temp = {
                    PostKey: reply.PostKey,
                    ReplyKey: reply.ReplyKey,
                    Group: reply.Group,
                    Content: reply.Content,
                    UserId: reply.UserId,
                    Name: reply.Name,
                    Deleted: reply.Deleted,
                    isWriter: reply.UserKey == userkey ? true : false,
                };
                result.push(temp);
            });
            resolve(result);
        } catch (err) {
            console.log(err);
            reject();
        }
    });
};

export const modifyReply: Function = async (
    replyFilter: replyFilterForm,
    data: modifyReplyForm
): Promise<Boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await ReplyModel.updateOne(
                { ...replyFilter },
                { $set: { ...data } }
            );
            resolve(result.matchedCount === 0 ? false : true);
        } catch (err) {
            console.log(err);
            reject();
        }
    });
};

export const removeReply: Function = async (
    replyFilter: replyFilterForm
): Promise<Boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await ReplyModel.updateOne(replyFilter, {
                $unset: {
                    Content: 1,
                    UserKey: 1,
                    Name: 1,
                    UserId: 1,
                    Created: 1,
                },
                $set: {
                    Deleted: true,
                },
            });
            resolve(result.matchedCount === 0 ? false : true);
        } catch (err) {
            console.log(err);
            reject();
        }
    });
};
