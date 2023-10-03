import { Request, Response } from 'express';
import jwt, { decode } from 'jsonwebtoken';

import { UserModel } from "../models";
import { UserTypes } from '../types';

class RefreshTokenController {
    async  handleRefreshToken(req:Request, res: Response){
        const cookies = req.cookies;
        if(!cookies.jwt) return res.sendStatus(401);
        const refreshToken = cookies.jwt;
        res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true});
    
        const foundUser: UserTypes | null = await UserModel.findOne({where: {refreshtoken: refreshToken}});
    
        if(!foundUser){
            jwt.verify(refreshToken,
                process.env.REFRESH_TOKEN_SECRET as string, async(err: any, decoded: any) => {
                    if (err) return res.sendStatus(403);
                    const hackedUser: UserTypes | null = await UserModel.findOne({ where: {email: decoded.email}});
                    if(hackedUser){
                        hackedUser.refreshtoken = [];
                        await hackedUser?.save();
                    }
                 
                }
            )
            return res.sendStatus(403);
        } 
    
        const newRefreshTokenArray = foundUser.refreshtoken?.filter(item => item !== refreshToken);
    
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, async (err: any, decoded: any) => {
    
        if(err) {
            foundUser.refreshtoken = [...newRefreshTokenArray as string[]];
            await foundUser.save();
        }
    
        const { email } = foundUser;
    // @ts-ignore
        if(err | email !== decoded.email) return res.sendStatus(403);
    
        const accessToken = jwt.sign({ email}, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '10s' });    
    
        res.json({accessToken});
    
        const newRefreshToken = jwt.sign(
            {email: foundUser.email},
            process.env.REFRESH_TOKEN_SECRET as string,
            { expiresIn: '1d'}
        );
    
        foundUser.refreshtoken = [...newRefreshTokenArray as string[], newRefreshToken];
        await foundUser.save();
    
        res.cookie('jwt', newRefreshToken, {httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 });
          
        });
    
    };
};

export default new RefreshTokenController();

