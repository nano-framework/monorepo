import { BaseRequest, BaseResponse } from "../Server";

export function legacyParams(req: BaseRequest, res: BaseResponse, next: (error?: Error) => void) {
  /**
   * Return the value of param `name` when present or `defaultValue`.
   *
   *  - Checks route placeholders, ex: _/user/:id_
   *  - Checks body params, ex: id=12, {"id":12}
   *  - Checks query string params, ex: ?id=12
   *
   * To utilize request bodies, `req.body` should be an object. 
   * This can be done by using the `bodyParser()` middleware.
   */
  req.param = function param<Type = any>(name: string, defaultValue?: Type): Type {
    const params = { ...this.params };
    const body = { ...this.body };
    const query = { ...this.query };

    let value = defaultValue;

    // eslint-disable-next-line no-prototype-builtins
    if (params[name] != null && params.hasOwnProperty(name)) {
      value = params[name];
    }

    if (body[name] != null) {
      value = body[name];
    }

    if (query[name] != null) {
      value = query[name];
    }

    return value;
  };

  next();
}
