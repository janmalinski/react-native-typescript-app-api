import { Request, Response } from 'express';
import { RoomModel, MessageModel } from '../models';
const io = require('../socket');

const tokens: string[] = [];

class RoomController { 

    async checkOrCreateRoom(req: Request, res: Response){
        const { adId, authorId, userId } = req.params;
        try {   
            const room = await RoomModel.findOne({where: { ad_id: adId , author_id: authorId, user_id: userId }})
            if(room?.id){
                res.status(200).json({roomId: room.id});
            } else {
                if(authorId !== userId){
                    const roomWithoutUser = await RoomModel.findOne({where: { ad_id: adId, author_id: authorId, user_id: null }});
                    if(roomWithoutUser?.id){
                        const roomWithOnlyAuthor = await RoomModel.findOne({where: { ad_id: adId, author_id: authorId }});
                        const roomUpdated = await roomWithOnlyAuthor?.update({user_id: userId});
                        if(roomUpdated){
                            res.status(200).json({roomId: roomUpdated.id});
                        }
                    } else {
                        const newRoom = await RoomModel.create({ad_id: adId, author_id: authorId, user_id: userId});
                        if(newRoom.id){
                            res.status(200).json({roomId: newRoom.id});
                        }
                    }
                }  else {
                    const roomWithAuthor = await RoomModel.findOne({where: { ad_id: adId, author_id: authorId}});
                    if(roomWithAuthor?.id){
                        res.status(200).json({roomId: roomWithAuthor.id});
                    } else {
                        const newRoom = await RoomModel.create({ad_id: adId, author_id: authorId});
                        if(newRoom.id){
                            res.status(200).json({roomId: newRoom.id});
                        }
                    }
                }
            };
           
        } catch (error) {
            res
            .status(500)
            .json({ message:  "Something went wrong!" });
        }
    };

    async sendMessage(req: Request, res: Response){
        try {
            const { text  } = req.body;
            const { roomId, senderId } = req.params;

            const message = await MessageModel.create({
                room_id: roomId,
                user_id: senderId,
                text
            });

            const data = {
                id: message.id,
                text,
                user_id: senderId,
                createdAt: message.createdAt
            };

            io.getIO().to(roomId).emit('message', data)
            res.status(200).json({ message: "Successfully sent message!" });
        } catch (error) {
            console.log('ERROR', error)
            res
            .status(500)
            .json({ message:  "Something went wrong!" });
        }
    };

    async getMessages(req: Request, res: Response){
        try {    
            const { roomId } = req.params;

            const messages = await MessageModel.findAll({where: {room_id: roomId}});

            const dataMessages: { id: string; user_id: string; text: string; createdAt: string; }[] = [];

            messages.map(message => dataMessages.push({id: message.id, user_id: message.user_id, text: message.text, createdAt: message.createdAt}));

            res.status(200).json({ messages });

        } catch (error) {
            res
            .status(500)
            .json({ message:  "Something went wrong!" });
        }
    };

    // async registerFCMToken(req: Request , res: Response){ 
    //     try {
    //         tokens.push(req.body.token);
    //         console.log('DONE')
    //         res.status(200).json({ message: "Successfully registered FCM Token!" });
    //     } catch (error) {
    //         console.log('ERROR_registerFCMToken', error)
    //         res
    //         .status(500)
    //         .json({ message:  "Something went wrong!" });
    //     }
    // }

    // async sendNotification(req: Request , res: Response){ 
    //     try {
    //         const { title, body, imageUrl } = req.body.message;
    //         admin.messaging().sendMulticast({
    //             tokens,
    //             notification: {
    //                 title,
    //                 body,
    //                 imageUrl
    //             }
    //         });  
    //         res.status(200).json({ message: "Successfully sent notifications!" });
    //     } catch (error) {4
    //         console.log('ERROR', error)
    //         res
    //         .status(500)
    //         .json({ message:  "Something went wrong!" });
    //     }
    // }

}


export default new RoomController();
