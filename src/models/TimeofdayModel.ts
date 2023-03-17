import { DataTypes, Model, Optional } from 'sequelize';
import db from '../config/database.config';

export interface TimeOfDay {
	"06-09": boolean;
	"09-12": boolean;
	"12-15": boolean;
	"15-18": boolean;
	"18-21": boolean;
	"21-24": boolean;
	"night": boolean;
  }

export interface TimeofdayModelAttributes{
	id: string;
	ad_id: string;
    negotiable?: boolean;
    timeofday?: TimeOfDay[];
}

type TimeofdayCreationlModelAttributes = Optional<TimeofdayModelAttributes, 'id'>

class TimeofdayModel extends Model<TimeofdayModelAttributes, TimeofdayCreationlModelAttributes> {
	declare id: string;
}

TimeofdayModel.init(
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
        negotiable: {
            type: DataTypes.BOOLEAN,
			allowNull: false,
            defaultValue: false
        },
        timeofday:{
            type: DataTypes.JSON,
			allowNull: true,
        },
    },
	{
		sequelize: db,
		tableName: 'timeofdays',
	}
);

export default TimeofdayModel;