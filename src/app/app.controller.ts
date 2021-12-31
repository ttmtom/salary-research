import { Controller, Get, HttpCode } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { PingDto } from './responseType/pingDto';

@ApiTags('Root')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/ping')
  @HttpCode(200)
  pingServer(): PingDto {
    return this.appService.sayHello();
  }
}
