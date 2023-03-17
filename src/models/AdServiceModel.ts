import { DataTypes, Model, Optional } from 'sequelize';
import db from '../config/database.config';

export interface AdServiceModelAttributes {
	id: string;
	ad_id: string; 
	service_id: string;
}

type AdServiceModelCreationAttributes = Optional<AdServiceModelAttributes, 'id'>;

class AdServiceModel extends Model<AdServiceModelAttributes, AdServiceModelCreationAttributes> {
	declare id: string;
	declare ad_id: string;
	declare service_id: string;
}

AdServiceModel.init(
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
		service_id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
		},
			
	},
	{
		sequelize: db,
		tableName: 'ad_service',
		underscored: true
	}
);

export default AdServiceModel;