import { Request, Response } from "express";

import{ TypeemploymentModel }from "../models";

interface Data {
    name: string;
}

class  TypeemploymentController {
	async create(req: Request , res: Response){
        const {names } = req.body;
        try {
            const data: Data[]  = [];
            names.forEach((element: { name: string}) => {
                data.push({name: element.name}) 
            });
            if(data.length === names.length) {
                await TypeemploymentModel.bulkCreate(data,{returning: true});
                res.status(200).json({message: "Types of employment created"});
            }
        } catch (error) {
            res.status(500).json({message:'Server error'})
        }
    };

    async getAll(req: Request, res: Response){
        try {
            const typeemployments = await TypeemploymentModel.findAll({attributes: ['id', 'name']});
            res.status(200).json({typeemployments});
        } catch (error) {
            res.status(500).json({message:'Server error'})
        }
    }
};


export default new  TypeemploymentController();