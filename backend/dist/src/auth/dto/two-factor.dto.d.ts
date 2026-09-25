export declare class EnableTwoFactorDto {
    code: string;
}
export declare class DisableTwoFactorDto {
    code?: string;
    password?: string;
}
export declare class VerifyTwoFactorLoginDto {
    tempToken: string;
    code: string;
    rememberMe?: boolean;
}
