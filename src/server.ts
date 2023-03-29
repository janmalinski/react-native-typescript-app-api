// import fs from 'fs';
// import path from 'path';
// import https from 'https';

import { Server } from "socket.io";;

import db from "./config/database.config";
import app from './app';
import { ServiceModel, UserModel, AdServiceModel, AdModel, TypeemploymentModel, AdTypeemploymentModel, TimeofdayModel, RoleModel, UserRoleModel, RoomModel, MessageModel } from './models';


// const key = fs.readFileSync(path.resolve('ssl/key.pem'));
// const cert = fs.readFileSync(path.resolve('ssl/cert.pem'));

RoomModel.hasMany(MessageModel, {foreignKey: 'room_id'});
MessageModel.belongsTo(RoomModel, { constraints: true,  onDelete: 'CASCADE', as: 'Room'});

RoomModel.belongsTo(AdModel, { constraints: true, onDelete: 'CASCADE', as: 'Ad'});
AdModel.hasMany(RoomModel, {foreignKey: 'ad_id'});

ServiceModel.belongsToMany(AdModel, {through: {model: AdServiceModel, unique: false}, foreignKey: 'service_id', constraints: false});
AdModel.belongsToMany(ServiceModel, {through: {model: AdServiceModel, unique: false}, foreignKey: 'ad_id', as: 'Services', constraints: false});

AdModel.belongsTo(UserModel, { constraints: true,  onDelete: 'CASCADE', as: 'User'});
UserModel.hasMany(AdModel, {foreignKey: 'user_id', as: 'Ads'});

RoleModel.belongsToMany(UserModel, {through: {model: UserRoleModel, unique: false}, foreignKey: 'role_id', as: 'Users', constraints: false});
UserModel.belongsToMany(RoleModel, {through: {model: UserRoleModel, unique: false}, foreignKey: 'user_id', as: 'Roles', constraints: false});

TypeemploymentModel.belongsToMany(AdModel, {through: {model: AdTypeemploymentModel, unique: false}, foreignKey: 'typeemployment_id', as: 'Ads', constraints: false});
AdModel.belongsToMany(TypeemploymentModel, {through: {model: AdTypeemploymentModel, unique: false}, foreignKey: 'ad_id', as: 'Typeemployments', constraints: false});

TimeofdayModel.belongsTo(AdModel);
AdModel.hasOne(TimeofdayModel,  { foreignKey: 'ad_id', as: 'Time'});

const port = 9000;

// db.sync({force: true}).then(() => {
db.sync()
	.then(() => {
	console.log("connect to db");
	// const server = https.createServer({key, cert }, app);
	const server = app.listen(port, () => {
		console.log("server is running on port " + port);
	});

	const io = new Server(server);

	io.on('connection', socket => {
	  console.log(socket.id + ' ==== connected');
	
	  // creating a room name that's unique using both user's unique username
	
	  socket.on('join', roomName => {
	
	  let split = roomName.split('--with--'); // ['username2', 'username1']
	
	  let unique = [...new Set(split)].sort((a: any, b: any) => (a < b ? -1 : 1)); // ['username1', 'username2']
	
	  let updatedRoomName = `${unique[0]}--with--${unique[1]}`; // 'username1--with--username2'
	
	   Array.from(socket.rooms)
			.filter(it => it !== socket.id)
			.forEach(id => {
			  socket.leave(id);
			  socket.removeAllListeners(`emitMessage`);
			});
	
	   socket.join(updatedRoomName);
	
	   socket.on(`emitMessage`, message => {
		  Array.from(socket.rooms)
			   .filter(it => it !== socket.id)
			   .forEach(id => {
				  socket.to(id).emit('onMessage', message);
			   });
			});
		  });
	
		socket.on('disconnect', () => {
		  console.log(socket.id + ' ==== diconnected');
		  socket.removeAllListeners();
		 });
	   });


})
.catch((err)=> console.log('ERROR_DB', err));







