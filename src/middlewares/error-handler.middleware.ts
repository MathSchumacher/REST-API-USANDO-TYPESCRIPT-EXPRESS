import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import ForbiddenError from "../models/errors/forbidden.error.model";
import HttpResponse from '../models/http-response.model';

const UNEXPECTED_ERROR = new HttpResponse<void>(
    StatusCodes.INTERNAL_SERVER_ERROR,
    { message: 'unexpected-error' }
);

const FORBIDDEN_ERROR = new HttpResponse<void>(
    StatusCodes.FORBIDDEN,
    { message: 'forbidden' }
);

const errorHanddlerMiddleware = (error: Error, req: Request, res: Response, next: NextFunction) => {
    let errorResponse = UNEXPECTED_ERROR;

    if (error instanceof ForbiddenError) {
        errorResponse = FORBIDDEN_ERROR;
    }

    console.error(error);
    return res.status(errorResponse.status).send(errorResponse.body);
}

export default errorHanddlerMiddleware;