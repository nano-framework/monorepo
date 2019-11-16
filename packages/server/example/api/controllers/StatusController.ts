import * as Package from '../../package.json';
import { Controller, Get, Res, BaseResponse } from '../lib';

@Controller('/')
export class StatusController {
  @Get('/')
  public async redirect(@Res() res: BaseResponse) {
    res.redirect('/status');
  }

  @Get('/status')
  public async status() {
    return { name: Package.name, version: Package.version };
  }
}
