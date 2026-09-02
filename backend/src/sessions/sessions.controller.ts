import {
  Controller,
  Get,
  Delete,
  Param,
  UseGuards,
  Request,
  Headers,
} from '@nestjs/common';

import { SessionsService } from './sessions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('sessions')
@UseGuards(JwtAuthGuard)
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get()
  async getSessions(@Request() req: any) {
    return this.sessionsService.getUserSessions(req.user.id);
  }

  @Delete('all')
  async deleteAllSessions(
    @Request() req: any,
    @Headers('authorization') authHeader: string,
  ) {
    const token = authHeader?.replace('Bearer ', '');
    return this.sessionsService.deleteAllUserSessions(req.user.id, token);
  }

  @Delete(':id')
  async deleteSession(@Param('id') sessionId: string) {
    return this.sessionsService.deleteSession(sessionId);
  }
}
