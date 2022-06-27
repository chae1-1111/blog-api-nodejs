import { PostModel, ReplyModel, UserModel } from "./connectDB";

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
import { getProfileImage } from "./memberCont";

export const isOwner: Function = async (
    postkey: number,
    userkey: number
): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await PostModel.find(
                {
                    PostKey: postkey,
                    UserKey: userkey,
                },
                "_id"
            );
            resolve(result.length === 0 ? false : true);
        } catch (err) {
            console.log(err);
            reject();
        }
    });
};

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
                "-_id Title Description Name Created PostKey Views Likes UserId"
            ).sort({ Created: -1 });
            resolve(result);
        } catch (err) {
            console.log(err);
            reject();
        }
    });
};

// 특정 사용자 모든 게시글 조회
export const getPostList: Function = async (
    userid: string,
    category: string,
    page: number
): Promise<postListForm[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            let result: postListForm[] = await PostModel.find(
                {
                    UserId: userid,
                    Category: category === "" ? { $exists: true } : category,
                },
                "-_id Title Description Name Created PostKey Likes Replys" +
                    category ===
                    ""
                    ? " Category"
                    : ""
            )
                .sort({ Created: -1 })
                .skip(--page * 10)
                .limit(10);
            result.map((post) => {
                post.Description =
                    post.Description.length > 150
                        ? post.Description.substring(0, 200) + "..."
                        : post.Description;
            });
            resolve(result);
        } catch (err) {
            console.log(err);
            reject();
        }
    });
};

interface PostCountAll {
    Total: number;
    eachCategory: [{ Category: string; Count: number }?];
}

export const getPostCountAll = async (
    userid: string,
    categories: string[]
): Promise<PostCountAll> => {
    return new Promise(async (resolve, reject) => {
        try {
            let arr = await PostModel.find(
                { UserId: userid, Category: { $in: categories } },
                "_id Category"
            );
            let result: PostCountAll = {
                Total: arr.length,
                eachCategory: [],
            };
            await categories.forEach((category) => {
                result.eachCategory.push({
                    Category: category,
                    Count: arr.filter((c) => c.Category === category).length,
                });
            });
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
    postkey: number,
    userkey: number,
    userid: string
) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await PostModel.find(
                {
                    PostKey: postkey,
                    UserId: userid,
                },
                "-_id Title Description Created Views Likes Name UserId UserKey Category Keyword Replys"
            );

            if (result.length === 0) resolve(false);

            let profileImage = await getProfileImage(
                result[0].UserId as string
            );

            resolve({
                Title: result[0].Title,
                Description: result[0].Description,
                Created: result[0].Created,
                Views: result[0].Views,
                Likes: result[0].Likes,
                Name: result[0].Name,
                UserId: result[0].UserId,
                Category: result[0].Category,
                Keyword: result[0].Keyword,
                Replys: result[0].Replys,
                isOwner: result[0].UserKey === userkey,
                profileImage: profileImage,
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
                "-_id ReplyKey Group Content UserId Name Deleted UserKey Created"
            );

            let result: replyListForm[] = [];

            await data.forEach(async (reply) => {
                let profileImage = await getProfileImage(
                    reply.UserId as string
                );
                let temp = {
                    ReplyKey: reply.ReplyKey,
                    Group: reply.Group,
                    Content: reply.Content,
                    UserId: reply.UserId,
                    Name: reply.Name,
                    Deleted: reply.Deleted,
                    isWriter: reply.UserKey == userkey ? true : false,
                    Created: reply.Created!,
                    profileImage: profileImage,
                };
                result.push(temp);
                console.log(result);
            });
            console.log(result);
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
            if (result.matchedCount !== 0) {
                await PostModel.updateOne(
                    { PostKey: replyFilter.PostKey },
                    { $inc: { Replys: -1 } }
                );
            }
            resolve(result.matchedCount === 0 ? false : true);
        } catch (err) {
            console.log(err);
            reject();
        }
    });
};

export const removeCategory: Function = async (
    userkey: number,
    categories: string[]
): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await PostModel.deleteMany({
                UserKey: userkey,
                Category: { $in: categories },
            });
            resolve(true);
        } catch (err) {
            console.log(err);
            reject();
        }
    });
};

interface categoryProps {
    exists: string;
    new: string;
}

export const modifyCategory: Function = async (
    userkey: number,
    objs: categoryProps[]
) => {
    return new Promise(async (resolve, reject) => {
        try {
            objs.forEach(async (obj) => {
                let result = await PostModel.updateMany(
                    { UserKey: userkey, Category: obj.exists },
                    { $set: { Category: obj.new } }
                );
            });
            resolve(true);
        } catch (err) {
            console.log(err);
            reject();
        }
    });
};
