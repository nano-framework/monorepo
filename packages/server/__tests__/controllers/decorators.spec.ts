import { Logger } from '@nano/errors';
import { BaseController, BaseRequest, BaseResponse, Delete, Get, Options, Post, Put } from '../../lib';

describe('lib.server.controllers.decorators', () => {
  Logger.initialize();

  it('should not accept an invalid controller', async () => {
    expect(() => {
      class InvalidTestController {
        @Get('/echo')
        public static echo(req: BaseRequest, res: BaseResponse) {
          res.json({ body: req.body });
        }
      }

      const controller = new InvalidTestController();
      expect(controller).not.toBeTruthy();
    }).toThrow(/ensure it extends BaseController/gi);
  });

  it('should accept a simple valid controller', async () => {
    expect(() => {
      class ValidTestController extends BaseController {
        @Get('/echo')
        public static getEcho(req: BaseRequest, res: BaseResponse) {
          res.json({ method: 'get', body: req.body });
        }

        @Post('/echo')
        public static postEcho(req: BaseRequest, res: BaseResponse) {
          res.json({ method: 'post', body: req.body });
        }

        @Put('/echo')
        public static putEcho(req: BaseRequest, res: BaseResponse) {
          res.json({ method: 'put', body: req.body });
        }

        @Options('/echo')
        public static optionsEcho(req: BaseRequest, res: BaseResponse) {
          res.json({ method: 'options', body: req.body });
        }

        @Delete('/echo')
        public static deleteEcho(req: BaseRequest, res: BaseResponse) {
          res.json({ method: 'delete', body: req.body });
        }
      }

      const controller = new ValidTestController();
      expect(controller).toBeTruthy();
    }).not.toThrow();
  });
});
