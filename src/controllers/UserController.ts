import { Request, Response } from "express";
import { QueryTypes } from 'sequelize';

import { RequestTypes, UserTypes  } from "../types";
import { UserModel } from "../models";
import { deleteFile } from '../utils/file';
import db from "../config/database.config";

class UserController {

	async getUser(req: RequestTypes, res: Response){
		try {
			const user: UserTypes | null = await UserModel.findOne({ where : {
				email: req.userEmail
			},
		})    
			if(user){
				const { id, email, avatarURL, name, phoneNumber, phoneNumberConsent} = user;
				// @ts-ignore
				const ads = await user.getAds();
				// @ts-ignore
				const roles = await user.getRoles(); 
				const modifiedAds = ads.map((ad: any)=>({id: ad.id, name: ad.description}));
				const modifiedRoles =roles.map((role: any)=>({id: role.id, name: role.name}));
				return res.status(200).json({user: {id, email, name, phoneNumber, phoneNumberConsent, avatarURL, ads:  modifiedAds, roles: modifiedRoles}});
			} else {
				return res.status(404).json({message: 'User not found'});
			}
		} catch (error) {
			console.log('ERROR', error)
			res.status(500).json({message:'Server error'})
		}
	}

	async uploadPhoto(req:RequestTypes, res: Response){
		try {
			const user: UserTypes | null = await UserModel.findOne({where:{email: req.userEmail}});
			if(user?.avatarURL){
				deleteFile('./public' + user.avatarURL);
			}
			if(user){
				const avatarURL = '/img/'+req.file.filename;
				user.avatarURL = avatarURL
				await user.save();
				return res.status(200).json({message: 'Avatar image uploaded', avatarURL });
			}
		} catch (error) {
			res.status(500).json({message:'Server error'})
		}
	}

	async update(req: RequestTypes, res: Response) {
		try {
			const record = await UserModel.findOne({ where: { email: req.userEmail } });
			if (!record) {
				return res.status(404).json({ message: "Can not find existing record" });
			}
			const { body: {name, phoneNumber, phoneNumberConsent, email, latitude, longitude}} = req;
			const id = record?.getDataValue('id')
			const sqlUpdate = `UPDATE  users  SET name='${name}', phoneNumber='${phoneNumber}', phoneNumberConsent=${phoneNumberConsent}, email='${email}', latitude=${latitude}, longitude=${longitude}  WHERE id='${id}'`
			await db.query(sqlUpdate);
			const sqlSelect = `SELECT email, avatarUrl, name, phonenumber, phonenumberconsent, latitude, longitude FROM users WHERE id='${id}'`;
			const user= await db.query(sqlSelect, { type: QueryTypes.SELECT });
			return res.status(200).json({user});
		} catch (e) {
			console.log('USER_ERROR', e)
			res.status(500).json({message:'Server error'});
		}
	}

	async getNearbyUsers(req: Request, res: Response){
		try {
			const users = await UserModel.findAll({attributes:['id', 'latitude', 'longitude']});
			const userCoordinates = users.map(user=>(user.get()));
			const toFixedUserCoordinates = userCoordinates.map(user=> ({ ...user, latitude: parseFloat(user.latitude as string).toFixed(1), longitude:  parseFloat(user.longitude as string).toFixed(1)}))
			const filteredUserCoordinates = toFixedUserCoordinates.find(el=> el.latitude === el.latitude + 0.1)
		    console.log('USER_COORDINATES', filteredUserCoordinates )
		} catch (error) {
			console.log('ERROR', error)
			res.status(500).json({message:'Server error'});
		}
	}











	// async create(req: Request, res: Response) {
	// 	try {
	// 		const record = await User.create({ ...req.body });
	// 		return res.json({ record, message: "Successfully create todo" });
	// 	} catch (e) {
	// 		return res.json({ message: "fail to create", status: 500, route: "/create" });
	// 	}
	// }

	// async readPagination(req: Request, res: Response) {
	// 	try {
	// 		const limit = (req.query.limit as number | undefined) || 10;
	// 		const offset = req.query.offset as number | undefined;

	// 		const records = await User.findAll({ where: {}, limit, offset });
	// 		return res.json(records);
	// 	} catch (e) {
	// 		return res.json({ message: "fail to read", status: 500, route: "/read" });
	// 	}
	// }
	// async readByID(req: Request, res: Response) {
	// 	try {
	// 		const { id } = req.params;
	// 		const record = await User.findOne({ where: { id } });
	// 		return res.json(record);
	// 	} catch (e) {
	// 		return res.json({ message: "fail to read", status: 500, route: "/read/:id" });
	// 	}
	// }
	// async update(req: Request, res: Response) {
	// 	try {
	// 		const { id } = req.params;
	// 		const record = await User.findOne({ where: { id } });

	// 		if (!record) {
	// 			return res.json({ message: "Can not find existing record" });
	// 		}

	// 		const updatedRecord = await record.update({
	// 			completed: !record.getDataValue("completed"),
	// 		});
	// 		return res.json({ record: updatedRecord });
	// 	} catch (e) {
	// 		return res.json({
	// 			message: "fail to read",
	// 			status: 500,
	// 			route: "/update/:id",
	// 		});
	// 	}
	// }
	// async delete(req: Request, res: Response) {
	// 	try {
	// 		const { id } = req.params;
	// 		const record = await User.findOne({ where: { id } });

	// 		if (!record) {
	// 			return res.json({ message: "Can not find existing record" });
	// 		}

	// 		const deletedRecord = await record.destroy();
	// 		return res.json({ record: deletedRecord });
	// 	} catch (e) {
	// 		return res.json({
	// 			message: "fail to read",
	// 			status: 500,
	// 			route: "/delete/:id",
	// 		});
	// 	}
	// }
}

export default new UserController();
