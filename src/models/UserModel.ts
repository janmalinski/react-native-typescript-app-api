import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import db from '../config/database.config';


export interface UserModelAttributes {
	id: string;
	email: string;
	password: string;
	avatarurl?: string;
	name?: string;
	phonenumber?: string;
	phonenumberconsent?: boolean;
	address?: string;
	latitude?: number;
	longitude?: number;
	registrationcode?: string;
	registrationcodeexpirationdate?: Date,
	registered?: Boolean;
	refreshtoken?: string[] | [];
}

type UserModelCreationAttributes = Optional<UserModelAttributes, 'id'>;

class UserModel extends Model<UserModelAttributes, UserModelCreationAttributes> {
	declare id: string;
	declare name: string;
	declare avatarurl: string;
	declare phonenumber: string;
	declare phonenumberconsent: boolean;
	declare address: string;
	declare refreshtoken: string[] | [];
};

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
		address: {
			type: DataTypes.STRING,
		},
		latitude: {
			type: DataTypes.FLOAT,
		},
		longitude: {
			type: DataTypes.FLOAT,
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
		refreshtoken: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			defaultValue: [],
		}
	},
	{
		sequelize: db,
		tableName: 'users',
	}
);

export default UserModel;