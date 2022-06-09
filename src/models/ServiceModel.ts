import { DataTypes, Model, Optional } from 'sequelize';
import db from '../config/database.config';

export interface ServiceModelAttributes {
	id: string;
	name: string;
}

type ServiceModelCreationAttributes =	Optional<ServiceModelAttributes, 'id'> 

class ServiceModel extends Model<ServiceModelAttributes, ServiceModelCreationAttributes> {
	declare id: string;
}

ServiceModel.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		}
	},
	{
		sequelize: db,
		tableName: 'services',
	}
);

export default ServiceModel;