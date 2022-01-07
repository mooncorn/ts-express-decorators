import { NextFunction, RequestHandler, Request, Response } from "express";
import { AppRouter } from "../../AppRouter";
import { MetadataKeys } from "./MetadataKeys";
import { Methods } from "./Methods";

function bodyValidators(keys: string[]): RequestHandler {
  return function (req: Request, res: Response, next: NextFunction) {
    if (!req.body) {
      res.status(422).send("req.body property is missing");
      return;
    }

    keys.forEach((key: string) => {
      if (!req.body[key]) {
        res.status(422).send(`req.body.${key} property is missing`);
        return;
      }
    });

    next();
  };
}

export function controller(routePrefix: string) {
  return function (constructor: Function) {
    const router = AppRouter.getInstance();

    for (let key in constructor.prototype) {
      const routeHandler = constructor.prototype[key];

      const path = Reflect.getMetadata(
        MetadataKeys.path,
        constructor.prototype,
        key
      );

      const method: Methods = Reflect.getMetadata(
        MetadataKeys.method,
        constructor.prototype,
        key
      );

      const middlewares =
        Reflect.getMetadata(
          MetadataKeys.middleware,
          constructor.prototype,
          key
        ) || [];

      const requiredBodyProps =
        Reflect.getMetadata(
          MetadataKeys.bodyValidator,
          constructor.prototype,
          key
        ) || [];

      const validator = bodyValidators(requiredBodyProps);

      if (path) {
        router[method](
          `${routePrefix}${path}`,
          ...middlewares,
          validator,
          routeHandler
        );
      }
    }
  };
}
