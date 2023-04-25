import { DataTypes, Model, Optional } from 'sequelize';
import db from '../config/database.config';

export interface FCMTokenModelAttributes {
	id: string;
	user_id: string;
	fcmtoken: string; 
}

type FCMTokenModeCreationlAttributes =  Optional<FCMTokenModelAttributes, 'id'>;

class FCMTokenModel extends Model<FCMTokenModelAttributes, FCMTokenModeCreationlAttributes> {
	declare id: string;
    declare fcmtoken: string
}

FCMTokenModel.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		user_id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
		},
		fcmtoken: {
			type: DataTypes.STRING,
			defaultValue: DataTypes.STRING,
			allowNull: false,
		},		
	},
	{
		sequelize: db,
		tableName: 'fcmtoken'
	}
);

export default FCMTokenModel;