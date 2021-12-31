import { Injectable } from '@nestjs/common';
import { PingDto } from './responseType/pingDto';

@Injectable()
export class AppService {
  sayHello(): PingDto {
    return {
      message: 'Hello World!',
    };
  }
}
