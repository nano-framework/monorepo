import { Get, Controller, Query } from '../lib';

@Controller('/hello')
export class HelloWorldController {
  @Get('/')
  public async hello(@Query('name') name = 'world') {
    return { message: `Hello ${name}!` };
  }
}
