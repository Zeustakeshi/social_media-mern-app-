import { IComment } from "./comment.interface";
import { IUser } from "./user.interface";

export interface IPost {
    _id: string;
    img?: string;
    desc?: string;
    likes?: string[];
    userID?: string;
    createdAt: string;
    comments?: IComment[];
}
