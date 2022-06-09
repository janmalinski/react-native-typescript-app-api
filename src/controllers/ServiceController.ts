import { Request, Response } from "express";

import { ServiceModel }from "../models";

interface Data {
    name: string;
}

class ServiceController {
	async create(req: Request , res: Response){
        const {names } = req.body;
        try {
            const data: Data[]  = [];
            names.forEach((element: { name: string}) => {
                data.push({name: element.name}) 
            });
            if(data.length === names.length) {
                await ServiceModel.bulkCreate(data,{returning: true});
                res.status(200).json({message: "Services created"});
            }
        } catch (error) {
            res.status(500).json({message:'Server error'})
        }
    };

    async getAll(req: Request, res: Response){
        try {
            const services = await ServiceModel.findAll({attributes: ['id', 'name']});
            res.status(200).json({services});
        } catch (error) {
            res.status(500).json({message:'Server error'})
        }
    }
};


export default new ServiceController();