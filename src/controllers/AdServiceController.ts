import { Response } from "express";

import Service from "../models/ServiceModel";
import Typeemployment from '../models/TypeemploymentModel';
import { UserModel, AdModel, AdServiceModel, AdTypeemploymentModel, TimeofdayModel} from '../models';
import { UserTypes, RequestTypes, AdTypes } from "../types";;

interface DataAddService {
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
                const adId = ad.id;
                const { id, description, latitude, longitude, address} = ad;
                TimeofdayModel.create({ad_id: adId,negotiable: workingTimeNegotiable, timeofday: workingTime});
                
                let dataAddService: DataAddService[] = [];
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
                        const typeOfEmployments = await Typeemployment.findAll({where:{id: employmentTypeIds}, attributes:['id', 'name']});
                        const adWithTimeOfDay: any = await AdModel.findByPk(id,{include: [{ model: TimeofdayModel, attributes:['timeofday', 'negotiable']}]});
                       
                        const addService= {
                            id,
                            description,
                            services,
                            typeOfEmployments,
                            workingTimeNegotiable: adWithTimeOfDay.TimeofdayModel.negotiable,
                            workingTime: adWithTimeOfDay.TimeofdayModel.timeofday,
                            latitude,
                            longitude,
                            address
                        };
                        res.status(200).json({ message: 'Add created', add: addService });
             }
            }             
        } else {
            res.status(404).json({ message: 'User not found'});
        }
    } catch (error) {   
        res.status(500).json({message:'Server error'});
    }};

    async getAll(req: RequestTypes , res: Response){
        try {
            const ads = await AdModel.findAll();
            console.log('ADS', ads)
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
};


export default new AdServiceController();
 