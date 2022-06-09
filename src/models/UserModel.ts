import { DataTypes, Model, Optional } from 'sequelize';
import db from '../config/database.config';


export interface UserModelAttributes {
	id: string;
	email: string;
	password: string;
	avatarurl?: string;
	name?: string;
	phonenumber?: string;
	phonenumberconsent?: boolean;
	latitude?: string;
	longitude?: string;
	registrationcode?: string;
	registrationcodeexpirationdate?: Date,
	registered?: Boolean;
}

type UserModelCreationAttributes = Optional<UserModelAttributes, 'id'>;

class UserModel extends Model<UserModelAttributes, UserModelCreationAttributes> {
	declare id: string;
}

UserModel.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		avatarurl: {
			type: DataTypes.STRING,
		},
		name: {
			type: DataTypes.STRING,
		},
		phonenumber:{
			type: DataTypes.STRING,
		},
		phonenumberconsent:{
			type: DataTypes.BOOLEAN,
		}, 
		latitude: {
			type: DataTypes.STRING,
		},
		longitude: {
			type: DataTypes.STRING,
		},
		registrationcode: {
			type: DataTypes.STRING,
		},
		registrationcodeexpirationdate: {
			type: DataTypes.DATE,
		},
		registered: {
			type: DataTypes.BOOLEAN,
		},
	},
	{
		sequelize: db,
		tableName: 'users',
	}
);

export default UserModel;