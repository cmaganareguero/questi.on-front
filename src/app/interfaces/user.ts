export interface User {
    id? : string;
    name: string;
    email: string;
    gender?: string;
    birthDate?: string;
    playerType?: string;
    password : string;
    games? : string[];
}

export interface GameUser {
    name: string;
    email: string;
}
