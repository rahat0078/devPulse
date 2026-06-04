
export interface I_User {
    id: string,
    name: string,
    email: string,
    password: string,
    role?: "contributor" | "maintainer"
}