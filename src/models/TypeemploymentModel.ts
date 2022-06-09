import { DataTypes, Model, Optional } from 'sequelize';
import db from '../config/database.config';

export interface TypeemploymentModelAttributes {
	id: string;
	name: string;
}

type TypeemploymentModelCreationAttributes = Optional<TypeemploymentModelAttributes, 'id'>;

class TypeemploymentModel extends Model<TypeemploymentModelAttributes, TypeemploymentModelCreationAttributes> {
	declare id: string;
}

TypeemploymentModel.init(
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
		tableName: 'typeEmployments',
	}
);

export default TypeemploymentModel;