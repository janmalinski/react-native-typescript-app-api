import { DataTypes, Model, Optional } from 'sequelize';
import db from '../config/database.config';

export interface RoleModelAttributes {
	id: string;
	name: string
}

type  RoleModelCreationAttributes =	Optional<RoleModelAttributes, 'id'> 

class RoleModel extends Model<RoleModelAttributes, RoleModelCreationAttributes> {
	declare id: string;
}

RoleModel.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		sequelize: db,
		tableName: 'roles',
	}
);

export default RoleModel;