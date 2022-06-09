import { Request, Response } from "express";

import{ RoleModel }from "../models";

interface Data {
    name: string;
}

class RoleController {
	async create(req: Request , res: Response){
        const { names } = req.body;
        try {
            const data: Data[]  = [];
            names.forEach((element: { name: string}) => {
                data.push({name: element.name}) 
            });
            if(data.length === names.length) {
                await RoleModel.bulkCreate(data,{returning: true});
                res.status(200).json({message: "Roles created"});
            }
        } catch (error) {
            res.status(500).json({message:'Server error'})
        }
    };

    async getAll(req: Request, res: Response){
        try {
            const roles = await RoleModel.findAll({attributes: ['id', 'name']});
            res.status(200).json({roles});
        } catch (error) {
            res.status(500).json({message:'Server error'})
        }
    }
};


export default new RoleController();