import { Get, Controller, Query } from '../lib';

@Controller('/')
export class HelloWorldController {
  @Get('/')
  public async hello(@Query('name') name = 'world') {
    return { message: `Hello ${name}!` };
  }
}
