export interface RequestEmail {
    email: string;
};

export interface RequestBodyObject extends RequestEmail {
    password: string;
};

export interface RequestToken {
    token: string;
};

export interface ResponseObject {
    status: boolean;
    message: string;
};

export interface ResponseWithEmail extends ResponseObject {
    email: string;
}