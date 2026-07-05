import { Controller, Get } from '@nestjs/common';
import { Roles, Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';

@Controller('admin')
@Roles(['admin'])
export class AdminController {
  @Get('ping')
  ping(@Session() session: UserSession) {
    return { ok: true, userId: session.user.id, role: session.user.role };
  }
}
