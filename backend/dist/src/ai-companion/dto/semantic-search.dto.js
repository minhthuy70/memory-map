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
exports.IndexEntityDto = exports.SemanticSearchDto = exports.SearchEntityType = void 0;
const class_validator_1 = require("class-validator");
var SearchEntityType;
(function (SearchEntityType) {
    SearchEntityType["MEMORY"] = "memory";
    SearchEntityType["IMAGE"] = "image";
    SearchEntityType["ALL"] = "all";
})(SearchEntityType || (exports.SearchEntityType = SearchEntityType = {}));
class SemanticSearchDto {
}
exports.SemanticSearchDto = SemanticSearchDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SemanticSearchDto.prototype, "query", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(SearchEntityType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SemanticSearchDto.prototype, "entityType", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], SemanticSearchDto.prototype, "limit", void 0);
class IndexEntityDto {
}
exports.IndexEntityDto = IndexEntityDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IndexEntityDto.prototype, "entityType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IndexEntityDto.prototype, "entityId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], IndexEntityDto.prototype, "embedding", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], IndexEntityDto.prototype, "metadata", void 0);
//# sourceMappingURL=semantic-search.dto.js.map