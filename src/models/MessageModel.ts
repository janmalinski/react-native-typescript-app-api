import { DataTypes, Model, Optional } from 'sequelize';
import db from '../config/database.config';

export interface MessageModelAttributes {
	id: string;
	room_id: string;
	user_id: string;
	text: string;
}

type  MessageModelCreationAttributes =	Optional<MessageModelAttributes, 'id'> 

class MessageModel extends Model<MessageModelAttributes, MessageModelCreationAttributes> {
	declare id: string;
	declare user_id: string;
	declare text: string;
	declare createdAt: string;
}

MessageModel.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		room_id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
		},
		user_id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
		},
		text: {
			type: DataTypes.STRING,
			allowNull: false,
		}
	},
	{
		sequelize: db,
		tableName: 'messages',
	}
);

export default MessageModel;