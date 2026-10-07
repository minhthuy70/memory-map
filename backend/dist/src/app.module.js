"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const memories_module_1 = require("./memories/memories.module");
const categories_module_1 = require("./categories/categories.module");
const sessions_module_1 = require("./sessions/sessions.module");
const prisma_module_1 = require("./prisma/prisma.module");
const event_streaming_module_1 = require("./event-streaming/event-streaming.module");
const hybrid_cloud_module_1 = require("./hybrid-cloud/hybrid-cloud.module");
const ai_companion_module_1 = require("./ai-companion/ai-companion.module");
const privacy_vault_module_1 = require("./privacy-vault/privacy-vault.module");
const gamification_module_1 = require("./gamification/gamification.module");
const psychology_module_1 = require("./psychology/psychology.module");
const genealogy_module_1 = require("./genealogy/genealogy.module");
const audiovisual_module_1 = require("./audiovisual/audiovisual.module");
const trip_planning_module_1 = require("./trip-planning/trip-planning.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 10,
                },
            ]),
            prisma_module_1.PrismaModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            memories_module_1.MemoriesModule,
            categories_module_1.CategoriesModule,
            sessions_module_1.SessionsModule,
            event_streaming_module_1.EventStreamingModule,
            hybrid_cloud_module_1.HybridCloudModule,
            ai_companion_module_1.AICompanionModule,
            privacy_vault_module_1.PrivacyVaultModule,
            gamification_module_1.GamificationModule,
            psychology_module_1.PsychologyModule,
            genealogy_module_1.GenealogyModule,
            audiovisual_module_1.AudiovisualModule,
            trip_planning_module_1.TripPlanningModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map