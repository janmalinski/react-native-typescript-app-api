import fs from 'fs';
import path from 'path';
// import https from 'https';

import db from "./config/database.config";
import app from "./app";

import { ServiceModel, UserModel, AdServiceModel, AdModel, TypeemploymentModel, AdTypeemploymentModel, TimeofdayModel, RoleModel, UserRoleModel } from './models';

// const key = fs.readFileSync(path.resolve('ssl/key.pem'));
// const cert = fs.readFileSync(path.resolve('ssl/cert.pem'));

ServiceModel.belongsToMany(AdModel, {through: AdServiceModel, foreignKey: 'service_id'});
AdModel.belongsToMany(ServiceModel, {through: AdServiceModel, foreignKey: 'ad_id'});

AdModel.belongsTo(UserModel, { constraints: true, onDelete: 'CASCADE', as: 'User'});
UserModel.hasMany(AdModel, {foreignKey: 'user_id', as: 'Ads'});

RoleModel.belongsToMany(UserModel, {through: UserRoleModel, foreignKey: 'role_id', as: 'Users'});
UserModel.belongsToMany(RoleModel, {through: UserRoleModel, foreignKey: 'user_id', as: 'Roles'});

TypeemploymentModel.belongsToMany(AdModel, {through: AdTypeemploymentModel, foreignKey: 'typeemployment_id', as: 'Ads'});
AdModel.belongsToMany(TypeemploymentModel, {through: AdTypeemploymentModel, foreignKey: 'ad_id', as: 'Typeemployments'});

TimeofdayModel.belongsTo(AdModel);
AdModel.hasOne(TimeofdayModel,  { foreignKey: 'ad_id'});

// db.sync({force: true}).then(() => {
db.sync().then(() => {
	console.log("connect to db");
});

const port = 9000;

// const server = https.createServer({key, cert }, app);

app.listen(port, () => {
	console.log("server is running on port " + port);
});

