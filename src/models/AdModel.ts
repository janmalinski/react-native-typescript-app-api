import { DataTypes, Model, Optional } from 'sequelize';
import db from '../config/database.config';

export interface AdModelAttributes {
	id: string;
	description: string;
	availablefrom: Date;
	availableto: Date;
	latitude: number;
	longitude: number;
	address: string;
}

type AdModelCreationAttributes = Optional<AdModelAttributes, 'id'>;

class AdModel extends Model<AdModelAttributes, AdModelCreationAttributes> {
	declare id: string;
	declare availableto: string;
	declare availablefrom: string;
	declare description: string;
	declare latitude: number;
	declare longitude: number;
	declare address: string;
	declare user_id: string;
	declare createdAt: string;
}

AdModel.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		description: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		availablefrom: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		availableto: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		latitude: {
			type:  DataTypes.FLOAT,
		},
		longitude: {
			type: DataTypes.FLOAT
		}, 
		address: {
			type: DataTypes.STRING,
		}
	},
	{
		sequelize: db,
		tableName: 'ads',
	}
);

export default AdModel;