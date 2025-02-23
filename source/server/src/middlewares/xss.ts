import { Request, Response, NextFunction } from "express";
import xss from "xss";

const xssCleanMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.body && typeof req.body === 'object') {
    for (let key in req.body) {
      if (req.body.hasOwnProperty(key)) {
        req.body[key] = xss(req.body[key]); 
      }
    }
  }
  next();
};

export default xssCleanMiddleware;
