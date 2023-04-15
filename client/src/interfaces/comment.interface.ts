export interface IComment {
    avatar?: string;
    comment?: string;
    userID?: string;
    _id?: string;
    createdAt?: string;
    userName?: string;
}

export interface ICommentsProps {
    commentData?: IComment[];
    postID: string;
}
