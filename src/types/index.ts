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
	email?: string;
	password?: string;
	avatarURL?: string;
   name?: string;
   phoneNumber?: string,
   phoneNumberConsent?: string; 
   registered?: boolean;
   Services?: ServiceModel[];
   AdModels?: AdModelAttributes[];
   getServices?: () => void; 
   // getAds?: () => any; 
   // getRoles?: () => any; 
   createAd?: ({description, availablefrom: dateavailablefrom, availableto: dateAvailableTo}:{ description: string, availablefrom: Date, availableto: Date}) => void;
};

export interface AdTypes extends AdModel {
   createTimeofday?: ({timeOfDay: workingTime, negotiable}:{timeOfDay: workingTime[], negotiable: boolean}) => void;
}




