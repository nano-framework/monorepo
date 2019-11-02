import { ROUTE_HANDLER_PARAMTYPES_KEY } from '../constants';

export type RequestParam = 'params' | 'query' | 'body' | 'request' | 'response' | 'headers';

export interface RouteHandlerParamTypesMetadata {
  type: RequestParam;
  data?: string;
  index: number;
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
      const previousMetadata: RouteHandlerParamTypesMetadata[] = Reflect.getMetadata(
        ROUTE_HANDLER_PARAMTYPES_KEY,
        target.constructor,
        propertyKey,
      );

      Reflect.defineMetadata(
        ROUTE_HANDLER_PARAMTYPES_KEY,
        [
          ...(previousMetadata || []),
          {
            type,
            data,
            index: parameterIndex,
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
