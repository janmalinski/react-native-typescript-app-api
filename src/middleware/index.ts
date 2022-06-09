import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

class Middleware {
	handleValidationError(req: Request, res: Response, next: NextFunction) {
		const error = validationResult(req);
		if (!error.isEmpty()) {
			return res.status(422).json({message:error.array()[0].msg});
		}
		next();
	}

	async verifyAccessToken(req: any, res: Response, next: NextFunction){
		const authHeader = req.get('Authorization');
		if (!authHeader) {
			return res.status(401).json({error: 'Not authenticated, no authorization header'})
		}
		const token = authHeader.split(' ')[1];
		let decodedToken: any;
		try {
		  const TOKEN_SECRET: string | undefined = process.env.TOKEN_SECRET;
		  decodedToken = TOKEN_SECRET && jwt.verify(token, TOKEN_SECRET);
		} catch (error: any) {
		  return res.status(500).json({error: `Not authenticated, can't verify access token attached in authorization header`})
		}
		if (!decodedToken) {
			return res.status(401).json({error: 'Not authenticated, no access token in authorization header'})
		}
		req.userEmail = decodedToken.email;
		next();
	}

}
export default new Middleware();
