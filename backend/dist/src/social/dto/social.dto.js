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
exports.UpdateMemoryPenpalDto = exports.CreateMemoryPenpalDto = exports.CreateDigitalPostcardDto = exports.UpdateMemoryContestDto = exports.CreateMemoryContestDto = exports.UpdateExplorationChallengeDto = exports.CreateExplorationChallengeDto = exports.CreateCoPresenceSuggestionDto = exports.UpdateNearbyFriendsPingDto = exports.CreateNearbyFriendsPingDto = exports.UpdateCommunityMapFeedDto = exports.CreateCommunityMapFeedDto = exports.UpdateMemoryStoryDto = exports.CreateMemoryStoryDto = void 0;
const class_validator_1 = require("class-validator");
class CreateMemoryStoryDto {
}
exports.CreateMemoryStoryDto = CreateMemoryStoryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemoryStoryDto.prototype, "memoryId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemoryStoryDto.prototype, "mediaUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemoryStoryDto.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemoryStoryDto.prototype, "privacy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemoryStoryDto.prototype, "stickers", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemoryStoryDto.prototype, "musicUrl", void 0);
class UpdateMemoryStoryDto {
}
exports.UpdateMemoryStoryDto = UpdateMemoryStoryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMemoryStoryDto.prototype, "privacy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMemoryStoryDto.prototype, "stickers", void 0);
class CreateCommunityMapFeedDto {
}
exports.CreateCommunityMapFeedDto = CreateCommunityMapFeedDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCommunityMapFeedDto.prototype, "memoryId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCommunityMapFeedDto.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCommunityMapFeedDto.prototype, "latitude", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCommunityMapFeedDto.prototype, "longitude", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCommunityMapFeedDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCommunityMapFeedDto.prototype, "mood", void 0);
class UpdateCommunityMapFeedDto {
}
exports.UpdateCommunityMapFeedDto = UpdateCommunityMapFeedDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCommunityMapFeedDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCommunityMapFeedDto.prototype, "mood", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateCommunityMapFeedDto.prototype, "isSafe", void 0);
class CreateNearbyFriendsPingDto {
}
exports.CreateNearbyFriendsPingDto = CreateNearbyFriendsPingDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNearbyFriendsPingDto.prototype, "friendId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNearbyFriendsPingDto.prototype, "memoryId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateNearbyFriendsPingDto.prototype, "distance", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateNearbyFriendsPingDto.prototype, "enabled", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateNearbyFriendsPingDto.prototype, "threshold", void 0);
class UpdateNearbyFriendsPingDto {
}
exports.UpdateNearbyFriendsPingDto = UpdateNearbyFriendsPingDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateNearbyFriendsPingDto.prototype, "enabled", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateNearbyFriendsPingDto.prototype, "threshold", void 0);
class CreateCoPresenceSuggestionDto {
}
exports.CreateCoPresenceSuggestionDto = CreateCoPresenceSuggestionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCoPresenceSuggestionDto.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCoPresenceSuggestionDto.prototype, "latitude", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCoPresenceSuggestionDto.prototype, "longitude", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCoPresenceSuggestionDto.prototype, "detectedUsers", void 0);
class CreateExplorationChallengeDto {
}
exports.CreateExplorationChallengeDto = CreateExplorationChallengeDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateExplorationChallengeDto.prototype, "challengeType", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateExplorationChallengeDto.prototype, "targetCount", void 0);
class UpdateExplorationChallengeDto {
}
exports.UpdateExplorationChallengeDto = UpdateExplorationChallengeDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateExplorationChallengeDto.prototype, "progress", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateExplorationChallengeDto.prototype, "badgeUrl", void 0);
class CreateMemoryContestDto {
}
exports.CreateMemoryContestDto = CreateMemoryContestDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemoryContestDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemoryContestDto.prototype, "theme", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemoryContestDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemoryContestDto.prototype, "submissionIds", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemoryContestDto.prototype, "deadline", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemoryContestDto.prototype, "votingEndsAt", void 0);
class UpdateMemoryContestDto {
}
exports.UpdateMemoryContestDto = UpdateMemoryContestDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMemoryContestDto.prototype, "winnerId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMemoryContestDto.prototype, "badgeUrl", void 0);
class CreateDigitalPostcardDto {
}
exports.CreateDigitalPostcardDto = CreateDigitalPostcardDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDigitalPostcardDto.prototype, "memoryId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDigitalPostcardDto.prototype, "recipientEmail", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDigitalPostcardDto.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDigitalPostcardDto.prototype, "stampUrl", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDigitalPostcardDto.prototype, "postcardUrl", void 0);
class CreateMemoryPenpalDto {
}
exports.CreateMemoryPenpalDto = CreateMemoryPenpalDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemoryPenpalDto.prototype, "penpalId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemoryPenpalDto.prototype, "language", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemoryPenpalDto.prototype, "interests", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateMemoryPenpalDto.prototype, "isAnonymous", void 0);
class UpdateMemoryPenpalDto {
}
exports.UpdateMemoryPenpalDto = UpdateMemoryPenpalDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMemoryPenpalDto.prototype, "status", void 0);
//# sourceMappingURL=social.dto.js.map