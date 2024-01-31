import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import jwtDecode from 'jwt-decode';
import randToken from 'rand-token'; 
import aws from 'aws-sdk';
import { Op } from 'sequelize';  

import { UserModel, UserRoleModel } from "../models";
import { randomString } from '../utils/randomString';
import { RequestTypes, UserTypes } from "../types";

const ses = new aws.SES(
	{region: 'us-east-1',
	accessKeyId: 'AKIA5GOP66DIND4XMUFJ',
    secretAccessKey: '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',

});

const sendRegistrationEmail = async(email: string, text: string) => {
    const emailFrom = 'contact@janmalinski.com';
   
    const params = {
        Destination: {
            ToAddresses: [email]
        },  
        Message: {
            Body: {
                Text: {
                    Data: text
                }
            },
            Subject: {
                Data: "Home services registration email"
            }
        },
        Source: emailFrom
    };

    return ses.sendEmail(params).promise().then((val)=>console.log('REGISTRATION_EMAIL_SENT', val)).catch(e=>console.log('REGISTRATION_EMAIL_ERROR', e))
};

class AuthController {
	async signUp(req: Request , res: Response){
        const {email, password, latitude, longitude, userRoleId, language } = req.body;
        try { 
                bcrypt.hash(password, 12, async(err, passwordHash) => {
                    if (err) {
                        return res.status(500).json({message: "Couldn't hash the password"}); 
                    } else if (passwordHash) {
                            const code = randomString(4);
                            const codeExpirationDate = Date.now() + 3600000;
                             const user = await UserModel.create({
                                email,
                                latitude, 
                                longitude,
                                password: passwordHash,
                                registrationcode: code,
                                registrationcodeexpirationdate: codeExpirationDate as unknown as Date
                            })
                             await UserRoleModel.create({ user_id: user?.id, role_id: userRoleId  })
                            .then(async() => {
                                let text = '';
                                text += language == 'en' ? "Hello," + "\n" + "your registration code is: " + code + "\n" + "To finish registration, please copy and paste this code into code registartion form in app." + "\n" + 
                                "Best regards," + "\n" + "Jan Maliński" : language === 'pl' && "Witamy," + "\n" + "twój kod rejestracyjny to: " + code + "\n" + "Musiz dokończyć rejestrację, proszę skopiować kod i wkleić do formularza weryfikacji kodu w aplikacji." + "\n" + 
                                "Pozdrawiam," + "\n" + "Jan Maliński";
                                await sendRegistrationEmail(email, text)
                                
                            })
                            .catch((err: Error) => {
                                console.log('Error',err);
                                res.status(502).json({message: "Error while creating the user"});
                            })
                            .finally(()=> res.json({message: 'Registration email sent. Check your email inbox. The code expires within 1 hour'}));
                      
						
                    };
                });
        } catch (error) {
            res.status(500).json({message:'Server error'})
        }
    };

    async verifyRegistrationCode(req:Request, res: Response) {
        try {
            const { code } = req.body;
            const user:  UserTypes | null = await UserModel.findOne({ where: {registrationcode: code, registrationcodeexpirationdate: {[Op.gt] : Date.now()}}});
            if(user){
                user.update({registered: true});
                return res.status(200).json({message: 'User successfully registered, now you can log in.'});
            } else {
                return res.status(404).json({message: 'Please, provide correct registraion code.'});
            }
            
        } catch (error) {
            console.log('Error', error)
            res.status(500).json({message:'Server error'})
        }
    }

	async signIn(req:Request, res: Response) {
        const {email, password }= req.body;
       
        try {
            const dbUser: any = await UserModel.findOne({ where : {
                email, registered: true
            },
        });      
            if(dbUser){
            bcrypt.compare(password, dbUser.password, async (err, compareRes) => {
                if (err) { // error while comparing
                    res.status(502).json({message: "Error while checking user password"});
                } else if (compareRes) { // password match

                    const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '1h' });
                    const decodedAccessToken: any = jwtDecode(accessToken);
                    const accessTokenExpiresAt = decodedAccessToken.exp
                    const refreshToken = randToken.uid(256);
                    console
                    dbUser.refreshtoken = dbUser.refreshtoken.length ? [...dbUser.refreshtoken, refreshToken] : [refreshToken];
                    await dbUser.save();

                    res.status(200).json({message: "User logged in", accessToken, accessTokenExpiresAt,
                    refreshToken});
                } else { // password doesnt match
                    res.status(401).json({message: "Invalid credentials"});
                };});
            } else {
                return res.status(404).json({message: "User not found"});
            }
        } catch (error) {
            console.log('ERROR', error)
            res.status(500).json({message:'Server error'})
        }
    };

    async checkRefreshToken(req: Request, res: Response){
        const {refreshToken } = req.body
        try {
            const user = await UserModel.findOne({ where: {refreshtoken: refreshToken}});

            if(!user) {
                return res.status(401).json({
                    message: 'Invalid token'
                })
            };

            const accessToken = jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '1h' });
            return res.json({accessToken})
        } catch (err) {
            return res.status(500).json({message: 'Could not refresh token'})
        }
    };

    async signOut(req: RequestTypes, res: Response){
        try {
            const user: UserTypes | null = await UserModel.findOne({ where : {email: req.userEmail}});
            const modifiedRefreshTokens = user?.refreshtoken.filter(item => item !== req.body.refreshToken);
            if(user && modifiedRefreshTokens) {
                user.refreshtoken = modifiedRefreshTokens;
                const modifiedUSER = await user.save()
            }
            return res.status(204).json({message: 'User logged out'})
  
        } catch (error) {
            console.log('ERROR', error)
            res.status(500).json({message:'Server error'})
        }
    };
};


export default new AuthController();