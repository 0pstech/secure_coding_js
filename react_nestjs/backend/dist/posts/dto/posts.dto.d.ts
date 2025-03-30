export declare enum Permission {
    PUBLIC = "public",
    PRIVATE = "private"
}
export declare class CreatePostDto {
    title: string;
    content: string;
    permission: Permission;
}
export declare class UpdatePostDto {
    title: string;
    content: string;
    permission: Permission;
}
