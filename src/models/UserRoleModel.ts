import { DataTypes, Model, Optional } from 'sequelize';
import db from '../config/database.config';

export interface UserRoleModelAttributes {
	id: string;
	user_id: string;
	role_id: string; 
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
			type: DataTypes.STRING,
			allowNull: false,
		},
		role_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},		
	},
	{
		sequelize: db,
		tableName: 'user_role',
		underscored: true
	}
);

export default UserRoleModel;