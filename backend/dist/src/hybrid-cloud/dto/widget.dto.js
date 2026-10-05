"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetWidgetsDto = exports.UpdateUserWidgetDto = exports.CreateUserWidgetDto = exports.WidgetType = void 0;
const class_validator_1 = require("class-validator");
var WidgetType;
(function (WidgetType) {
    WidgetType["IOS"] = "ios";
    WidgetType["ANDROID"] = "android";
    WidgetType["DESKTOP"] = "desktop";
})(WidgetType || (exports.WidgetType = WidgetType = {}));
class CreateUserWidgetDto {
}
exports.CreateUserWidgetDto = CreateUserWidgetDto;
__decorate([
    (0, class_validator_1.IsEnum)(WidgetType),
    __metadata("design:type", String)
], CreateUserWidgetDto.prototype, "widgetType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserWidgetDto.prototype, "widgetId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserWidgetDto.prototype, "widgetName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserWidgetDto.prototype, "config", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateUserWidgetDto.prototype, "isEnabled", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateUserWidgetDto.prototype, "position", void 0);
class UpdateUserWidgetDto {
}
exports.UpdateUserWidgetDto = UpdateUserWidgetDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserWidgetDto.prototype, "widgetName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserWidgetDto.prototype, "config", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateUserWidgetDto.prototype, "isEnabled", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateUserWidgetDto.prototype, "position", void 0);
class GetWidgetsDto {
}
exports.GetWidgetsDto = GetWidgetsDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetWidgetsDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(WidgetType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetWidgetsDto.prototype, "widgetType", void 0);
//# sourceMappingURL=widget.dto.js.map