import { DataTypes, Model, Optional } from 'sequelize';
import db from '../config/database.config';

export interface RoomModelAttributes {
	id: string;
	ad_id: string;
	author_id: string;
	user_id?: string;
};

type  RoomModelCreationAttributes =	Optional<RoomModelAttributes, 'id'> 

class RoomModel extends Model<RoomModelAttributes, RoomModelCreationAttributes> {
	declare id: string;
	declare ad_id: string;
	declare author_id: string;
	declare user_id: string;
	declare createdAt: Date;
}

RoomModel.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		ad_id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
		},
		author_id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
		},
		user_id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: true,
		}
	},
	{
		sequelize: db,
		tableName: 'rooms',
	}
);

export default RoomModel;