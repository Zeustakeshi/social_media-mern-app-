export interface IChats {
    members?: string[];
    _id?: string[];
    updatedAt?: string;
    createdAt?: string;
}

export interface IMessage {
    chatID?: string;
    createdAt?: string;
    message?: string;
    senderID?: string;
    updatedAt?: string;
}
