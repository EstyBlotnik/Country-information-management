import { Request, Response, NextFunction } from "express";
// import xss from "xss";
import validator from "validator";

// ממיר תווים מסוכנים לקוד בטוח

// const xssCleanMiddleware = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   console.log("xssCleanMiddleware");
//   console.log(req.body);
//   if (req.body && typeof req.body === "object") {
//     for (let key in req.body) {
//       if (req.body.hasOwnProperty(key)) {
//         req.body[key] = validator.escape(req.body[key]);
//         console.log("req.body[key]: ", req.body[key]);
//       }
//     }
//   }
//   next();
// };
const xssCleanMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body && typeof req.body === "object" && req.body !== null) {
    const bodyObject = { ...req.body };

    for (let key in bodyObject) {
      if (Object.prototype.hasOwnProperty.call(bodyObject, key)) {
        bodyObject[key] = validator.escape(bodyObject[key]);
      }
    }

    req.body = bodyObject;
  }

  next();
};

export default xssCleanMiddleware;
