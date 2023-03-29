import multer from 'multer';

import Validator from '../validator';
import Middleware from '../middleware';
import { AdServiceController, AuthController, RoleController, UserController, ServiceController, TypeemploymentController, TimeofdayController, RoomController } from '../controllers';
import express from 'express';

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
	  cb(null, './public/img')
	},
	filename: function(req, file, cb) {
	  cb(null, new Date().toISOString() + file.originalname)
	}
  })
  
  const fileFilter = (req: any, file: any, cb: any) => {
	if(file.mimetype = 'image/jpg' || file.mimetype === 'image/png'){
	  cb( null, true);
	} else {
	  cb(new Error('Only jepg, jpeg and png file extensions are accepted'), false);
	}
  }
  
  const upload = multer({
	storage,
	limits: {
	fileSize: 1024 * 1024 * 5
  },
  fileFilter
  });

const router = express.Router();

// auth routes
router.post(
	'/auth/signUp',
	Validator.checkSignUp(),
	Middleware.handleValidationError,
	AuthController.signUp
);

router.post(
	'/auth/verify',
	Validator.checkVerifyRegistrationCode(),
	Middleware.handleValidationError,
	AuthController.verifyRegistrationCode
);


router.post(
	'/auth/signIn',
	Validator.checkSignIn(),
	Middleware.handleValidationError,
	AuthController.signIn
);

// user routes
router.get(
	'/user',
	Middleware.verifyAccessToken,
	UserController.getUser
	);

router.patch(
	'/user/update',
	Middleware.verifyAccessToken,
	Validator.checkUpdateUser(),
	Middleware.handleValidationError,
	UserController.update
);

router.post(
	'/user/upload-avatar',
	Middleware.verifyAccessToken,
	upload.single('avatar'), 
	UserController.uploadPhoto
	);

router.post('/user/get-nearby-users',
	UserController.getNearbyUsers
	);
// service routes
router.post(
	'/service/create',
	Validator.checkCreateService(),
	Middleware.handleValidationError,
	ServiceController.create
);

router.get(
	'/service',
	Middleware.verifyAccessToken,
	ServiceController.getAll
	);
// ad routes
router.post(
	'/ad/create',
	Middleware.verifyAccessToken,
	Validator.checkCreatAdService(),
	Middleware.handleValidationError,
	AdServiceController.create
);

router.patch(
	'/ad/:id',
	Middleware.verifyAccessToken,
	AdServiceController.update
	);

router.get(
	'/ad',
	Middleware.verifyAccessToken,
	AdServiceController.getAll
	);

router.delete(
	'/ad/:id',
	Middleware.verifyAccessToken,
	AdServiceController.delete
	);
// typeemployment routes
router.post(
	'/typeemployment/create',
	// Middleware.verifyAccessToken,
	Validator.checkCreateTypeemployment(),
	Middleware.handleValidationError,
	TypeemploymentController.create
);

router.get(
	'/typeemployment',
	TypeemploymentController.getAll
	);
// timeofday route
router.post(
	'/timeofday/create',
	Middleware.verifyAccessToken,
	Validator.checkCreateTypeemployment(),
	Middleware.handleValidationError,
	TimeofdayController.create
);
// role routes
router.post(
	'/role/create',
	Validator.checkCreateRole(),
	Middleware.handleValidationError,
	RoleController.create
);

router.get(
	'/role',
	RoleController.getAll
	);
// notification routes
router.post('/room/register-fcm-token',Validator.checkRegisterFCMToken(),Middleware.handleValidationError, RoomController.registerFCMToken);

router.post('/room/send-notification',Middleware.verifyAccessToken,Validator.checksendNotification(),Middleware.handleValidationError, RoomController.sendNotification)

// room routes
router.post('/room/:adId/:authorId/:userId/:roomId?', Middleware.verifyAccessToken, RoomController.checkOrCreateRoom);

router.post('/room/:roomId/:senderId',Middleware.verifyAccessToken,Validator.checkSendMessage(),Middleware.handleValidationError, RoomController.sendMessage);

router.get('/room/:roomId/messages', Middleware.verifyAccessToken, RoomController.getMessages);

router.get('/public', (req, res, next) => {
	res.status(200).json({ message: "here is your public resource" });
	});
	  
// will match any other path - 404 ERROR
router.use('/', (req, res, next) => {
res.status(404).json({error : "Route not found"});
});


// router.get(
// 	'/user/read',
// 	Validator.checkReadTodo(),
// 	Middleware.handleValidationError,
// 	UserController.readPagination
// );

// router.get(
// 	'/user/read/:id',
// 	Validator.checkIdParam(),
// 	Middleware.handleValidationError,
// 	UserController.readByID
// );

// router.delete(
// 	'/user/delete/:id',
// 	Validator.checkIdParam(),
// 	Middleware.handleValidationError,
// 	UserController.delete
// );


export default router;
