"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMemoryDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_memory_dto_1 = require("./create-memory.dto");
class UpdateMemoryDto extends (0, mapped_types_1.PartialType)(create_memory_dto_1.CreateMemoryDto) {
}
exports.UpdateMemoryDto = UpdateMemoryDto;
//# sourceMappingURL=update-memory.dto.js.map