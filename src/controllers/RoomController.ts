import { Request, Response } from 'express';
import admin from 'firebase-admin';

import { RoomModel, MessageModel, FCMTokenModel } from '../models';

class RoomController { 

    async checkOrCreateRoom(req: Request, res: Response){
        const { adId, authorId, userId, roomId } = req.params;
        try {   
        if(roomId !== 'undefined'){
            const room = await RoomModel.findByPk(roomId);
            res.status(200).json({roomId: room?.id, authorId: room?.author_id, userId: room?.user_id});
        } else {
            const room = await RoomModel.findOne({where: { ad_id: adId , author_id: authorId, user_id: userId }});
            if(room?.id){
                res.status(200).json({roomId: room.id, authorId: room.author_id, userId: room.user_id});
            } else {
                if(authorId !== userId){
                    const roomWithoutUser = await RoomModel.findOne({where: { ad_id: adId, author_id: authorId, user_id: null }});
                    if(roomWithoutUser?.id){
                        const roomWithOnlyAuthor = await RoomModel.findOne({where: { ad_id: adId, author_id: authorId }});
                        const roomUpdated = await roomWithOnlyAuthor?.update({user_id: userId});
                        if(roomUpdated){
                            res.status(200).json({roomId: roomUpdated.id, authorId, userId});
                        }
                    } else {
                        const newRoom = await RoomModel.create({ad_id: adId, author_id: authorId, user_id: userId});
                        if(newRoom.id){
                            res.status(200).json({roomId: newRoom.id, authorId, userId});
                        };
                    }
                } else {
                    const roomWithAuthor = await RoomModel.findOne({where: { ad_id: adId, author_id: authorId}});
                    if(roomWithAuthor?.id){
                        res.status(200).json({roomId: roomWithAuthor.id, authorId: roomWithAuthor.author_id, userId: roomWithAuthor.user_id});
                    } else {
                        const newRoom = await RoomModel.create({ad_id: adId, author_id: authorId});
                        if(newRoom.id){
                            res.status(200).json({roomId: newRoom.id});
                        }
                    }
                }
            };
        }
        } catch (error) {
            res
            .status(500)
            .json({ message:  "Something went wrong!" });
        }
    };

    async sendMessage(req: Request, res: Response){
        try {
            const { text, adId, receiverId, authorOfRoom, userOfRoom } = req.body;
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

            const tokensArr = await FCMTokenModel.findAll({where: {user_id: receiverId}})

            const tokens: string[] = [];
            
            for(let i = 0; i < tokensArr.length; i++){
                tokens.push(tokensArr[i].fcmtoken)
            };

            const messageData = {
                notification: {
                    body: 'You got new message',
                    title: 'Check yout message',
                    },
                    data: {
                    // // type: "alarmNotification",
                    authorId: authorOfRoom,
                    userId: userOfRoom,
                    senderId,
                    receiverId,
                    adId    
                    },
                android: {
                    notification: {
                        sound: 'default',
                    }
                },
                apns: {
                    payload: {
                        aps: {
                        sound: 'default'
                        }
                    }
                    },
                tokens,
            }
            
            admin.messaging().sendMulticast(messageData).then(res => console.log('SUCESSFULLY SENT NOTIFICATION', res)).catch(err => console.log('ERROR SENDING MESSAGE', err));  

            res.status(200).json({ message: data });
        } catch (error) {
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

    async registerFCMToken(req: Request , res: Response){ 
        try {
            const { receiverId, fcmToken } = req.body;
            const tokenIsAlreadyRecorded = await FCMTokenModel.findOne({where: {fcmtoken: fcmToken}})
            if(!tokenIsAlreadyRecorded){
                await FCMTokenModel.create({user_id: receiverId, fcmtoken: fcmToken})
            }
            res.status(200).json({ message: "Successfully registered FCM Token!" });
        } catch (error) {
            res
            .status(500)
            .json({ message:  "Something went wrong!" });
        }
    };

    // async sendNotification(res: Response){ 
    //     try {
    //         // admin.messaging().sendMulticast({
    //         //     tokens,
    //         //     notification: {
    //         //         title: 'You got new message',
    //         //         body: 'Check yout message',
    //         //     }
    //         // });  
    //         res.status(200).json({ message: "Successfully sent notifications!" });
    //     } catch (error) {
    //         res
    //         .status(500)
    //         .json({ message:  "Something went wrong!" });
    //     }
    // }

}


export default new RoomController();
