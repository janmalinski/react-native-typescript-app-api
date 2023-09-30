import { DataTypes, Model, Optional } from 'sequelize';
import db from '../config/database.config';

export interface UserRoleModelAttributes {
	id: string;
	user_id: string;
	role_id: string; 
	refresh_token: string;
}

type UserRoleModeCreationlAttributes =  Optional<UserRoleModelAttributes, 'id'>;

class UserRoleModel extends Model<UserRoleModelAttributes, UserRoleModeCreationlAttributes> {
	declare id: string;
}

UserRoleModel.init(
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
		role_id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
		},		
		refresh_token: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
		}
	},
	{
		sequelize: db,
		tableName: 'user_role',
		underscored: true
	}
);

export default UserRoleModel;