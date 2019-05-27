import { Middleware } from "../base";

enum EndpointMethod {
  GET,
  OPTIONS,
  POST,
  PUT,
  DELETE
}

const EndpointDecorator = (method: EndpointMethod, url: string, middlewares: Middleware[] = []) =>
  function EndpointDecoratorWrapper(target) {

  }

export class Endpoint {
  public static Method = EndpointMethod;

  public static Get = (url: string) => EndpointDecorator(EndpointMethod.GET, url);
  public static Options = (url: string) => EndpointDecorator(EndpointMethod.OPTIONS, url);
  public static Post = (url: string) => EndpointDecorator(EndpointMethod.POST, url);
  public static Put = (url: string) => EndpointDecorator(EndpointMethod.PUT, url);
  public static Delete = (url: string) => EndpointDecorator(EndpointMethod.DELETE, url);
}