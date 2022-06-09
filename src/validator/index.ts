import { body, check, param, query } from 'express-validator';

import { UserModel }from '../models';

class Validator{

	checkSignUp() {
		return [
			body('email')
				.notEmpty()
				.withMessage('The email value should not be empty')
				.isEmail()
				.withMessage('Check email format')
				.custom(email => {
					return UserModel.findOne({where:{email}}).then(user => {
						if (user) {
						  return Promise.reject('Email already in use');
						}
					  });
				}),
			body('password')
				.notEmpty()
				.withMessage('The password value should not be empty')
				.isLength({ min: 6 })
				.withMessage('The password length should be at least 6'),
			body('termsAccepted')
				.notEmpty()
				.withMessage('Terms accepted value should not be empty')
				.isBoolean()
				.withMessage('Terms accepted value should be true of false'),
			body('latitude')
				.notEmpty()
				.withMessage('The user latitude should not be empty')
				.isNumeric()
				.withMessage('The user latitude should be numeric'),
			body('longitude')
				.notEmpty()
				.withMessage('The user longitude should not be empty')
				.isNumeric()
				.withMessage('The user longitude should be numeric'),
			body('userType')
				.notEmpty()
				.withMessage('The user type should not be empty')
				.isString()
				.withMessage('The user type should be string')
		];
	};

	checkVerifyRegistrationCode() {
		return [
			body('code')
				.notEmpty()
				.withMessage('The code value should not be empty')
				.isNumeric()
				.withMessage('The code must contain only digits')
				.isLength({ min: 4, max: 4 })
				.withMessage('The code is made of 4 digits'),
		];
	};


	checkSignIn() {
		return [
			body('email')
				.notEmpty()
				.withMessage('The email value should not be empty')
				.isEmail()
				.withMessage('Check email format'),
			body('password')
				.notEmpty()
				.withMessage('The password value should not be empty')
				.isLength({ min: 6 })
				.withMessage('The password length should be at least 6')
		];
	}

	checkUpdateUser() {
		return [
			body('name')
				.notEmpty()
				.withMessage('The first name value should not be empty')
				.isString()
				.withMessage('Check first name format. First name has to be string'),
			body('phoneNumber')
				.notEmpty()
				.withMessage('The phone number value should not be empty')
				.isLength({ min: 9 })
				.withMessage('The phone number length should be at least 9'),
				body('phoneNumberConsent')
				.notEmpty()
				.withMessage('The consent of phone visibilty should not be empty')
				.isBoolean()
				.withMessage('The consent of phone visibilty should be boolean'),
			body('email')
				.notEmpty()
				.withMessage('The email value should not be empty')
				.isEmail()
				.withMessage('Check email format')
		];
	}

	checkCreateService(){
		return[
			body('names')
			.isArray()
			.withMessage('The names should be an array'),
			check('names.*.name').isString().withMessage('The name value should be a string'),
		]
	}

	checkCreateTypeemployment(){
		return[
			body('names')
			.isArray()
			.withMessage('The names should be an array'),
			check('names.*.name').isString().withMessage('The name value should be a string'),
		]
	}

	checkCreatAdService(){
		return[
			body('description')
				.notEmpty()
				.withMessage('The description value should not be empty')
				.isString()
				.withMessage('The description has to be string'),
				body('serviceIds')
				.notEmpty()
				.withMessage('The serviceIds value should not be empty')
				.isArray()
				.withMessage('Check serviceId format. Name has to be string'),
				body('dateAvailableFrom')
				.notEmpty()
				.withMessage('The dateAvailableFrom value should not be empty'),
				// body('dateAvailableFrom')
				// .trim()
				// .isDate()
				// .withMessage('The dateAvailableFrom value should be in datetime format'),
				// body('dateAvailableTo')
				// .trim()
				// .isDate()
				// .withMessage('The dateAvailableTo value should be in datetime format')
		]
	}

	checkCreateRole(){
		return[
			body('names')
			.isArray()
			.withMessage('The names should be an array'),
			check('names.*.name').isString().withMessage('The name value should be a string'),
		]
	}



	// checkCreateTodo() {
	// 	return [
	// 		body('id')
	// 			.optional()
	// 			.isUUID(4)
	// 			.withMessage('The value should be UUID v4'),
	// 		body('title')
	// 			.notEmpty()
	// 			.withMessage('The title value should not be empty'),
	// 		body('completed')
	// 			.optional()
	// 			.isBoolean()
	// 			.withMessage('The value should be boolean')
	// 			.isIn([0, false])
	// 			.withMessage('The value should be 0 or false'),
	// 	];
	// }
	// checkReadTodo() {
	// 	return [
	// 		query('limit')
	// 			.optional()
	// 			.isInt({ min: 1, max: 10 })
	// 			.withMessage('The limit value should be number and between 1-10'),
	// 		query('offset')
	// 			.optional()
	// 			.isNumeric()
	// 			.withMessage('The value should be number'),
	// 	];
	// }
	// checkIdParam() {
	// 	return [
	// 		param('id')
	// 			.notEmpty()
	// 			.withMessage('The value should be not empty')
	// 			.isUUID(4)
	// 			.withMessage('The value should be uuid v4')
	// 			.custom(id => {
	// 				return User.findOne({where:{id}}).then(user => {
	// 					if (user) {
	// 					  return Promise.reject('Can not find existing record');
	// 					}
	// 				  });
	// 			})
	// 	];
	// }
}

export default new Validator();
