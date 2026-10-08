export declare enum Platform {
    WINDOWS = "windows",
    MACOS = "macos",
    LINUX = "linux"
}
export declare class CreateDesktopAppDto {
    platform: Platform;
    version: string;
    installPath?: string;
    systemTray?: boolean;
    shortcuts?: string;
    autoStart?: boolean;
}
export declare class UpdateDesktopAppDto {
    version?: string;
    installPath?: string;
    systemTray?: boolean;
    shortcuts?: string;
    autoStart?: boolean;
}
