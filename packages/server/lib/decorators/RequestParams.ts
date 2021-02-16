import { ROUTE_HANDLER_PARAMTYPES_KEY } from '../constants';

export type RequestParam = 'params' | 'query' | 'body' | 'request' | 'response' | 'headers';

export interface RouteHandlerParamTypesMetadata {
  type: RequestParam;
  data?: string;
  index: number;
  constructorClass?: new (...params: any[]) => any;
}

function isConstructor(f: any) {
  try {
    Reflect.construct(String, [], f);
  } catch (e) {
    return false;
  }
  return f.name !== 'Object';
}

function requestParamDecoratorFactory(type: 'params'): (data?: string) => ParameterDecorator;
function requestParamDecoratorFactory(type: 'query'): (data?: string) => ParameterDecorator;
function requestParamDecoratorFactory(type: 'body'): (data?: string | object) => ParameterDecorator;
function requestParamDecoratorFactory(type: 'request'): () => ParameterDecorator;
function requestParamDecoratorFactory(type: 'response'): () => ParameterDecorator;
function requestParamDecoratorFactory(type: 'headers'): (data?: string) => ParameterDecorator;
function requestParamDecoratorFactory(type: RequestParam) {
  return (data: string | object | undefined): ParameterDecorator => {
    return (target: Record<string, any>, propertyKey: string, parameterIndex: number) => {
      const previousMetadata: RouteHandlerParamTypesMetadata[] =
        Reflect.getMetadata(ROUTE_HANDLER_PARAMTYPES_KEY, target.constructor, propertyKey) || [];

      const ParamType = Reflect.getMetadata('design:paramtypes', target, propertyKey);
      const isPrimitive = !isConstructor(ParamType[parameterIndex]);

      Reflect.defineMetadata(
        ROUTE_HANDLER_PARAMTYPES_KEY,
        [
          ...previousMetadata,
          {
            type,
            data,
            index: parameterIndex,
            constructorClass: !isPrimitive ? ParamType[parameterIndex] : undefined,
          },
        ],
        target.constructor,
        propertyKey,
      );
    };
  };
}

export const Req = requestParamDecoratorFactory('request');
export const Res = requestParamDecoratorFactory('response');
export const Body = requestParamDecoratorFactory('body');
export const Query = requestParamDecoratorFactory('query');
export const Params = requestParamDecoratorFactory('params');
export const Headers = requestParamDecoratorFactory('headers');
