import { Request, Response } from "express";;

import { TimeofdayModel }from "../models";

class  TimeofdayController {
	async create(req: Request , res: Response){
        const {timeOfDay, negotiable } = req.body;
        try {
            // await TimeofdayModel.create({ad_id: ,timeofday: timeOfDay, negotiable});
            res.status(200).json({message: "Time of days created"});        
        } catch (error) {
            res.status(500).json({message:'Server error'})
        }
    };

    async getAll(req: Request, res: Response){
        try {
            const timeofdays = await TimeofdayModel.findAll();
            res.status(200).json({timeofdays});
        } catch (error) {
            res.status(500).json({message:'Server error'})
        }
    }
};


export default new  TimeofdayController();