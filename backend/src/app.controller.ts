import { Controller, Get } from '@nestjs/common';
import { Public } from './auth/auth-policy.js';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('health')
  getHealth(): { status: string } {
    return this.appService.getHealth();
  }
}
