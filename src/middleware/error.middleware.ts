import { NextFunction, Request, Response } from "express";
import HttpException from "../exceptions/HttpException";
import fs from "node:fs";

const errorMiddleware = (error: HttpException, request: Request, response: Response, next: NextFunction) => {
  const status = error.status || 500;
  const message = error.message || "An error has occured";
  const time = new Date();
  const logTime = time.toLocaleString();
  let logMessage = `${logTime} - ${ status } - ${ message }\n`;
  fs.appendFile("error.log", logMessage, (err) => {
    if (err) {
        console.error("Error writing to error.log:", err);
    }
  });
  console.log(logMessage);
 
};

export default errorMiddleware;
