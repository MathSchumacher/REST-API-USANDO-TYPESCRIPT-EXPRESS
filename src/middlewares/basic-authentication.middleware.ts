import { Request, Response, NextFunction } from "express";
import ForbiddenError from "../models/errors/forbidden.error.model";
import userRepository from "../repositories/user.repository";

const basicAuthMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authorizationHeader = req.headers.authorization;
    
        if (!authorizationHeader) {
            throw new ForbiddenError('Credenciais not found');
        }
    
        const [authorizationType, base64Token] = authorizationHeader.split(' ');
    
        if (authorizationType !== 'Basic') {
            throw new ForbiddenError('Invalid authorization type');
        }
    
        const [username, password] = Buffer.from(base64Token, 'base64').toString('utf-8').split(':');
    
        if (!username || !password) {
            throw new ForbiddenError('Credenciais not found');
        }
    
        const user = await userRepository.findByUsernameAndPassword(username, password);
    
        if (!user) {
            throw new ForbiddenError('Invalid credentials');
        }
    
        req.user = user;
        return next();
    } catch (error) {
        return next(error);
    }
}

export default basicAuthMiddleware;