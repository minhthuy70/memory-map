import { IsString, IsBoolean, IsOptional, IsNumber, IsEnum } from 'class-validator';

export enum WidgetType {
  IOS = 'ios',
  ANDROID = 'android',
  DESKTOP = 'desktop',
}

export class CreateUserWidgetDto {
  @IsEnum(WidgetType)
  widgetType: WidgetType;

  @IsString()
  widgetId: string;

  @IsString()
  widgetName: string;

  @IsString()
  config: string; // JSON config

  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;

  @IsNumber()
  @IsOptional()
  position?: number;
}

export class UpdateUserWidgetDto {
  @IsString()
  @IsOptional()
  widgetName?: string;

  @IsString()
  @IsOptional()
  config?: string;

  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;

  @IsNumber()
  @IsOptional()
  position?: number;
}

export class GetWidgetsDto {
  @IsString()
  userId: string;

  @IsEnum(WidgetType)
  @IsOptional()
  widgetType?: WidgetType;
}
