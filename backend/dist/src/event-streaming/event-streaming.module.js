"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventStreamingModule = void 0;
const common_1 = require("@nestjs/common");
const event_streaming_service_1 = require("./event-streaming.service");
const event_streaming_controller_1 = require("./event-streaming.controller");
const event_streaming_gateway_1 = require("./event-streaming.gateway");
const webRTC_service_1 = require("./webRTC.service");
const prisma_module_1 = require("../prisma/prisma.module");
let EventStreamingModule = class EventStreamingModule {
};
exports.EventStreamingModule = EventStreamingModule;
exports.EventStreamingModule = EventStreamingModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [event_streaming_controller_1.EventStreamingController],
        providers: [event_streaming_service_1.EventStreamingService, event_streaming_gateway_1.EventStreamingGateway, webRTC_service_1.WebRTCService],
        exports: [event_streaming_service_1.EventStreamingService],
    })
], EventStreamingModule);
//# sourceMappingURL=event-streaming.module.js.map