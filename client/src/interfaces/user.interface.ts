export interface IUser {
    id?: string;
    userName?: string;
    coverImage?: string;
    email?: string;
    followers?: string[];
    followings?: string[];
    desc?: string;
    avatar?: string;
    isFollowWithCurrentUser?: boolean;
}
