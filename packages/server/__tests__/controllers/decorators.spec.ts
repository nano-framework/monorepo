import { BaseRequest, BaseResponse, Get } from '../../lib';

describe('lib.server.controllers.decorators', () => {
  it('should not accept an invalid controller', async () => {
    expect(() => {
      
      class TestController {
        @Get('/echo')
        public static echo(req: BaseRequest, res: BaseResponse) {
          res.json({ body: req.body })
        }
      }

      new TestController();

    }).toThrow(/ensure it extends BaseController/ig);
  });
});
