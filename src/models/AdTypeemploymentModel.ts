import { DataTypes, Model, Optional } from 'sequelize';
import db from '../config/database.config';

export interface AdTypeemploymentModelAttributes {
	id: string
	typeemployment_id: string;
	ad_id: string; 
}

type AdTypeemploymentModelCreationAttributes =  Optional<AdTypeemploymentModelAttributes, 'id'>

class AdTypeemploymentModel extends Model<AdTypeemploymentModelAttributes, AdTypeemploymentModelCreationAttributes> {
	declare id: string;
	declare typeemployment_id: string;
}

AdTypeemploymentModel.init(
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
		typeemployment_id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
		},	
	},
	{
		sequelize: db,
		tableName: 'ad_typeemployments',
		underscored: true
	}
);

export default AdTypeemploymentModel;