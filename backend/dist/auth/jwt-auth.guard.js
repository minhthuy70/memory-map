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
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const sessions_service_1 = require("../sessions/sessions.service");
let JwtAuthGuard = class JwtAuthGuard {
    constructor(jwtService, usersService, sessionsService) {
        this.jwtService = jwtService;
        this.usersService = usersService;
        this.sessionsService = sessionsService;
    }
    async canActivate(context) {
        const request = context
            .switchToHttp()
            .getRequest();
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new common_1.UnauthorizedException('Missing authorization token');
        }
        const token = authHeader.substring(7);
        try {
            const payload = await this.jwtService.verifyAsync(token);
            const user = await this.usersService.findById(payload.sub);
            if (!user) {
                throw new common_1.UnauthorizedException('User not found');
            }
            const session = await this.sessionsService.findByToken(token);
            if (!session) {
                throw new common_1.UnauthorizedException('Phiên đăng nhập không tồn tại hoặc đã bị thu hồi.');
            }
            if (new Date() > session.expiresAt) {
                throw new common_1.UnauthorizedException('Phiên đăng nhập đã hết hạn.');
            }
            await this.sessionsService.updateLastActivity(token);
            request['user'] = user;
            request['session'] = session;
            return true;
        }
        catch (err) {
            if (err instanceof common_1.UnauthorizedException) {
                throw err;
            }
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        users_service_1.UsersService,
        sessions_service_1.SessionsService])
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map