import { Request } from "express";
import { UserModel, ServiceModel, AdModelAttributes, AdModel }from '../models';

export interface RequestTypes extends Request {
   userEmail?: string;
   file?: any
}

interface workingTime {
   "06-09": boolean;
   "09-12": boolean;
   "12-15": boolean;
   "15-18": boolean;
   "18-21": boolean;
   "21-24": boolean;
   "night": boolean;
 }

export interface UserTypes extends UserModel {
	avatarurl: string;
   name: string;
   phonenumber: string,
   phonenumberconsent: boolean;
   address: string;
   latitude?: number;
   longitude?: number; 
   email?: string;
	password?: string;
   registered?: boolean;
   Services?: ServiceModel[];
   AdModels?: AdModelAttributes[];
   getServices?: () => void; 
   // getAds?: () => any; 
   // getRoles?: () => any; 
   createAd?: ({description, availablefrom, availableto, latitude, longitude, address}:{ description: string, availablefrom: Date, availableto: Date, latitude: number, longitude: number, address: string}) => void;
};

export interface AdTypes extends AdModel {
   createTimeofday?: ({timeOfDay, negotiable}:{timeOfDay: workingTime[], negotiable: boolean}) => void;
}




