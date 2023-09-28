import { Response } from "express";

import Service from "../models/ServiceModel";
import Typeemployment from '../models/TypeemploymentModel';
import { UserModel, AdModel, AdServiceModel, AdTypeemploymentModel, TimeofdayModel, RoomModel} from '../models';
import { UserTypes, RequestTypes, AdTypes } from "../types";

interface DataAdService {
    service_id: string;
    ad_id: string;
}

interface DataTypeemployment {
    typeemployment_id: string;
    ad_id: string;
}

class AdServiceController{
	async create(req: RequestTypes , res: Response){
    try {
        const { serviceIds, employmentTypeIds, description, dateAvailableFrom, fixedTerm, dateAvailableTo,  workingTimeNegotiable,
            workingTime, latitude, longitude, address  } = req.body;

        const user: UserTypes | null = await UserModel.findOne({where:{email: req.userEmail}});
        if(user){
            const ad: AdTypes | any = user.createAd && await user.createAd({ description, availablefrom: dateAvailableFrom, availableto: fixedTerm ? dateAvailableTo : null, latitude, longitude, address});
            if(ad){ 
              
                const { id, description, latitude, longitude, address} = ad;
                TimeofdayModel.create({ad_id: id,negotiable: workingTimeNegotiable, timeofday: workingTime});
                
                let dataAddService: DataAdService[] = [];
                let dataTypeemployment: DataTypeemployment[] = [];
                
                serviceIds.forEach(async(serviceId: string) => {
                    dataAddService.push({service_id: serviceId, ad_id: id})
                });
                employmentTypeIds.forEach(async(employmentTypeId: string) => {
                    dataTypeemployment.push({typeemployment_id: employmentTypeId, ad_id: id})
                });

                if(dataAddService.length === serviceIds.length && dataTypeemployment.length === employmentTypeIds.length){
                        await AdServiceModel.bulkCreate(dataAddService,{returning: true});
                        await AdTypeemploymentModel.bulkCreate(dataTypeemployment,{returning: true});
                        const services = await Service.findAll({where:{id: serviceIds}, attributes:['id', 'name']});
                        const typesOfEmployment = await Typeemployment.findAll({where:{id: employmentTypeIds}, attributes:['id', 'name']});
                        const adWithTimeOfDay: any = await AdModel.findByPk(id,{include: [{ model: TimeofdayModel, as: 'Time', attributes:['timeofday', 'negotiable']}]});

                        const adService= {
                            id,
                            availableFrom: ad.availablefrom,
                            availableTo: ad.availableto,
                            description,
                            services,
                            typesOfEmployment,
                            workingTimeNegotiable: adWithTimeOfDay.Time.negotiable,
                            workingTime: adWithTimeOfDay.Time.timeofday,
                            latitude,
                            longitude,
                            address,
                        };

                        res.status(200).json({ message: 'Ad created', ad: adService });
             }
            }             
        } else {
            res.status(404).json({ message: 'User not found'});
        }

    } catch (error) {   
        console.log('SERVER_ERROR', error)
        res.status(500).json({message:'Server error'});
    }};


    async update(req: RequestTypes , res: Response){
        try {
            const { id } = req.params;
           
            const user: UserTypes | null = await UserModel.findOne({where:{email: req.userEmail}});
            if(user){

                const ad = await AdModel.findByPk(id);

                if(ad){ 
                    const adId = ad.id;
                    const {  serviceIds, employmentTypeIds, description, dateAvailableFrom, fixedTerm, dateAvailableTo,  workingTimeNegotiable,
                            workingTime, latitude, longitude, address  } = req.body;

                  const updatedAd = await ad.update({
                        description, availablefrom: dateAvailableFrom, availableto: fixedTerm ? dateAvailableTo : null, latitude, longitude, address
                    })

                    const timeOfDay = await TimeofdayModel.findOne({
                        where: {
                            ad_id: adId
                        }
                    });

                    await timeOfDay?.update({
                        negotiable: workingTimeNegotiable,
                        timeofday: workingTime
                    })

                    
                    let dataAddService: DataAdService[] = [];
                    let dataTypeemployment: DataTypeemployment[] = [];
                    
                    serviceIds.forEach(async(serviceId: string) => {
                        dataAddService.push({service_id: serviceId, ad_id: id})
                    });
                    employmentTypeIds.forEach(async(employmentTypeId: string) => {
                        dataTypeemployment.push({typeemployment_id: employmentTypeId, ad_id: id})
                    });
    
                    if(dataAddService.length === serviceIds.length && dataTypeemployment.length === employmentTypeIds.length){
                        
                        for(let i = 0; i < dataAddService.length; i++){
                            await AdServiceModel.update({service_id: dataAddService[i]?.service_id}, {
                                where: {
                                    ad_id: dataAddService[i]?.ad_id
                                }
                            }
                            )}
                       
                            for(let i = 0; i < dataTypeemployment.length; i++){
                                await AdTypeemploymentModel.update({typeemployment_id: dataTypeemployment[i].typeemployment_id}, {
                                    where: {
                                        ad_id: dataTypeemployment[i]?.ad_id
                                    }
                                }
                                )}
                           
                            const services = await Service.findAll({where:{id: serviceIds}, attributes:['id', 'name']});
                            const typesOfEmployment = await Typeemployment.findAll({where:{id: employmentTypeIds}, attributes:['id', 'name']});
                            const adWithTimeOfDay: any = await AdModel.findByPk(id,{include: [{ model: TimeofdayModel, as: 'Time', attributes:['timeofday', 'negotiable']}]});

                            const rooms = await RoomModel.findAll({where: {ad_id: adId}});
                            let roomsData = [];
                            for(let i = 0; i < rooms.length; i++){
                                const user = await UserModel.findOne({where: {id: rooms[i].user_id}});
                                roomsData.push({room: {id: rooms[i].id, ad_id: rooms[i].ad_id, author_id: rooms[i].author_id, user_id: rooms[i].user_id, created_at: rooms[i].createdAt}, user: {id: user?.id, name: user?.name, avatar_url: user?.avatarurl}})
                            }
            
                            const adService= {
                                id,
                                userId: user.id,
                                availableFrom: updatedAd.availablefrom,
                                availableTo:  updatedAd.availableto,
                                description,
                                services,
                                typesOfEmployment,
                                workingTimeNegotiable: adWithTimeOfDay.Time.negotiable,
                                workingTime: adWithTimeOfDay.Time.timeofday,
                                latitude,
                                longitude,
                                address,
                                rooms: roomsData
                            };
                            res.status(200).json({ message: 'Ad updated', ad: adService });
                 }
                }             
            } else {
                res.status(404).json({ message: 'User not found'});
            }
        } catch (error) {   
            console.log('SERVER_ERROR', error)
            res.status(500).json({message:'Server error'});
        }};

    async getAll(req: RequestTypes , res: Response){
        try {
            const ads = await AdModel.findAll();

            let adIds: any = [];
            for(let i = 0; i < ads.length; i++){
                adIds.push(ads[i].id)
            };

            let data: any = []
          
            for(let i: any = 0; i < adIds.length; i++){
                const serviceIds = await AdServiceModel.findAll({where:{
                    ad_id: adIds[i]
                }, attributes: ['service_id']
            });

            const modifiedServiceIds = serviceIds.map(item => item.service_id);
        
                const employmentTypeIds = await AdTypeemploymentModel.findAll({where:{
                    ad_id: adIds[i]
                }, attributes: ['typeemployment_id']
            });
            
              
                const modifiedEmploymentTypeIds = employmentTypeIds.map(item => item.typeemployment_id);

                const currentAd = ads[i];

                const adWithTimeOfDay: any = await AdModel.findByPk(adIds[i],{include: [{ model: TimeofdayModel, as: 'Time', attributes:['timeofday', 'negotiable']}]});
                const services = await Service.findAll({where:{id: modifiedServiceIds}, attributes:['id', 'name']});
                const typesOfEmployment = await Typeemployment.findAll({where:{id: modifiedEmploymentTypeIds}, attributes:['id', 'name']});
                const userId = currentAd.user_id
                const user = await UserModel.findByPk(userId);
                const rooms = await RoomModel.findAll({where: {ad_id: currentAd.id}});
                let roomsData = [];
                for(let i = 0; i < rooms.length; i++){
                    const user = await UserModel.findOne({where: {id: rooms[i].user_id}});
                    roomsData.push({room: {id: rooms[i].id, ad_id: rooms[i].ad_id, author_id: rooms[i].author_id, user_id: rooms[i].user_id, created_at: rooms[i].createdAt}, user: {id: user?.id, name: user?.name, avatar_url: user?.avatarurl}})
                }

                const ad = {
                    id: currentAd.id,
                    userId,
                    description: currentAd.description,
                    availableFrom: currentAd.availablefrom,
                    availableTo: currentAd.availableto,
                    latitude: currentAd.latitude,
                    longitude: currentAd.longitude, 
                    address: currentAd.address,     
                    services,
                    typesOfEmployment,
                    availability: {
                        negotiable: adWithTimeOfDay.Time.negotiable,
                        time: adWithTimeOfDay.Time.timeofday
                    },
                    avatar: user?.avatarurl,
                    createdAt: currentAd.createdAt,
                    rooms: roomsData,
                    authorName: user?.name,
                    authorAvatar: user?.avatarurl,
                    authorPhoneNumberConsent: user?.phonenumberconsent,
                    authorPhoneNumber: user?.phonenumber,
                    authorAddress: user?.address
                }
                data.push({...ad});
            };
            res.status(200).json({ ads: data });
        } catch (error) {
            console.log('Error',error);    
            res.status(500).json({message:'Server error'});
        }
    }

    async getByUserId(req: RequestTypes , res: Response){
        try {
            const ads = await AdModel.findAll();
            console.log('ADS', ads)
        } catch (error) {
            console.log('Error',error);    
            res.status(500).json({message:'Server error'});
        }
    }

    async delete(req: RequestTypes , res: Response){
        try {
            const adId = req.params.id
            const ad = await AdModel.destroy({where:{id: adId}});
            
            await TimeofdayModel.destroy({where: {ad_id: adId}})
            await AdTypeemploymentModel.destroy({where: {ad_id: adId}});
            await AdServiceModel.destroy({where: {ad_id: adId}});
            res.status(200).json({ message: 'Ad deleted'});
        } catch (error) {
            console.log('Error',error);    
            res.status(500).json({message:'Server error'});
        }
    }
};


export default new AdServiceController();
 