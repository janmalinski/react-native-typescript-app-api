import { Request, Response } from "express";
import { QueryTypes } from 'sequelize';

import { RequestTypes, UserTypes  } from "../types";
import { RoomModel, ServiceModel, TimeofdayModel, TypeemploymentModel, UserModel } from "../models";
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
				const { id, email, avatarurl, name, phonenumber, phonenumberconsent, latitude, longitude, address} = user;
				// @ts-ignore
				const ads = await user.getAds({
					include: [
						{model: TimeofdayModel, as: 'Time'},
						{model: ServiceModel, as: 'Services', attributes: ['id', 'name']},
						{model: TypeemploymentModel, as: 'Typeemployments', attributes: ['id', 'name']}
					]
				});
				let roomsData: any = [];
				for(let i: any = 0; i < ads.length; i++){

				const currentAd = ads[i];

				const rooms = await RoomModel.findAll({where: {ad_id: currentAd.id}});
               
                for(let i = 0; i < rooms.length; i++){
                    const user = await UserModel.findOne({where: {id: rooms[i].user_id}});
                    roomsData.push({room: {id: rooms[i].id, ad_id: rooms[i].ad_id, author_id: rooms[i].author_id, user_id: rooms[i].user_id, created_at: rooms[i].createdAt}, user: {id: user?.id, name: user?.name, avatar_url: user?.avatarurl}})
                }
				};
				
				let modifiedAds = ads.map((ad: any, index: number)=>({id: ad.id, userId: user.id, createdAt: ad.createdAt, description: ad.description, availableFrom: ad.availablefrom, availableTo: ad.availableto, latitude: ad.latitude, longitude: ad.longitude, address: ad.address, availability:{negotiable: ad.Time.negotiable, time: ad.Time.timeofday}, services: ad.Services, typesOfEmployment: ad.Typeemployments,  
					rooms: [
						{
							room: roomsData[index].room.ad_id === ad.id ? {
							id: roomsData[index].room.id,
							ad_id: roomsData[index].room.ad_id,
							author_id: roomsData[index].author_id,
							user_id: roomsData[index].user_id,
							created_at: roomsData[index].createAd
							} : null,
							user: roomsData[index].room.ad_id === ad.id ? {
								id: roomsData[index].user.id,
								name: roomsData[index].user.name,
								avatar_url: roomsData[index].avatar_url
							} : null
						}
					]
				}));

				// @ts-ignore
				const roles = await user.getRoles(); 
				const modifiedRoles = roles.map((role: any)=>({id: role.id, name: role.name}));

				return res.status(200).json({user: {id, email, name, phoneNumber: phonenumber, phoneNumberConsent: phonenumberconsent,latitude, longitude, address, avatarUrl: avatarurl, ads:  modifiedAds, roles: modifiedRoles}});
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
			if(user?.avatarurl){
				deleteFile('./public' + user.avatarurl);
			}
			if(user){
				const avatarURL = '/img/'+req.file.filename;
				user.avatarurl = avatarURL
				await user.save();
				return res.status(200).json({message: 'Avatar image uploaded', avatarURL });
			}
		} catch (error) {
			res.status(500).json({message:'Server error'})
		}
	}

	async update(req: RequestTypes, res: Response) {
		try {
			const record:  UserTypes | null = await UserModel.findOne({ where: { email: req.userEmail } });
			if (!record) {
				return res.status(404).json({ message: "Can not find existing record" });
			}
			// @ts-ignore
			const ads = await record.getAds({
				include: [
					{model: TimeofdayModel, as: 'Time'},
					{model: ServiceModel, as: 'Services', attributes: ['id', 'name']},
					{model: TypeemploymentModel, as: 'Typeemployments', attributes: ['id', 'name']}
				]
			});

			// @ts-ignore
			const roles = await record.getRoles(); 
			
			const { body } = req;
			const userId = record?.getDataValue('id')
			const sqlUpdate = `UPDATE  users  SET name='${body.name}', phoneNumber='${body.phoneNumber}', phoneNumberConsent=${body.phoneNumberConsent}, email='${body.email}', address='${body.address}', latitude=${body.latitude}, longitude=${body.longitude}  WHERE id='${userId}'`
			await db.query(sqlUpdate);
			const sqlSelect = `SELECT email, avatarUrl, name, phonenumber, phonenumberconsent, address, latitude, longitude FROM users WHERE id='${userId}'`;
			const user = await db.query(sqlSelect, { type: QueryTypes.SELECT });
			const modifiedAds = ads.map((ad: any)=>({id: ad.id, userId: ad.user_id, description: ad.description, availableFrom: ad.availablefrom, availableTo: ad.availableto, latitude: ad.latitude, longitude: ad.longitude, address: ad.address, availability:{negotiable: ad.Time.negotiable, time: ad.Time.timeofday}, services: ad.Services, typeOfEmployments: ad.Typeemployments}));
			const modifiedRoles = roles.map((role: any)=>({id: role.id, name: role.name}));
	
			const data = {
				user: user[0], ads:  modifiedAds, roles: modifiedRoles
			}
			return res.status(200).json(data);
		} catch (e) {
			res.status(500).json({message:'Server error'});
		}
	}

	async getNearbyUsers(req: Request, res: Response){
		try {
			const users = await UserModel.findAll({attributes:['id', 'latitude', 'longitude']});
			if(users.length > 1){
				let nearbyUsers = [];
				for(let i = 0; i < users.length; i++){
					nearbyUsers.push(users[i])
				}
				console.log('NEARBY_USERS', nearbyUsers)
			}

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
