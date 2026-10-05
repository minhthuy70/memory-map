export declare enum WidgetType {
    IOS = "ios",
    ANDROID = "android",
    DESKTOP = "desktop"
}
export declare class CreateUserWidgetDto {
    widgetType: WidgetType;
    widgetId: string;
    widgetName: string;
    config: string;
    isEnabled?: boolean;
    position?: number;
}
export declare class UpdateUserWidgetDto {
    widgetName?: string;
    config?: string;
    isEnabled?: boolean;
    position?: number;
}
export declare class GetWidgetsDto {
    userId: string;
    widgetType?: WidgetType;
}
