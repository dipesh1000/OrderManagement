import express from 'express';
import { CreateOrder, CustomerLogin, CustomerProfile, CustomerSignUp, CustomerVerify, EditCustomerProfile, GetOrderById, GetOrders, RequestOTP } from '../controllers';
import { Authenticate } from '../middlewares';
const router = express.Router();

/** -------------------- Signup / Create Customer ------------------- */
router.post('/signup', CustomerSignUp)


/** -------------------- Login ------------------- */
router.post('/login', CustomerLogin)

// authentication
router.use(Authenticate)
/** -------------------- Verify Customer Account ------------------- */
router.patch('/verify', CustomerVerify)


/** -------------------- OTP / Requesting ------------------- */
router.get('/otp', RequestOTP)


/** -------------------- PROFILE ------------------- */
router.get('/profile', CustomerProfile)
router.patch('/profile', EditCustomerProfile)


//Cart
//Order
router.post('/create-order', CreateOrder);
router.get('/orders', GetOrders);
router.get('/order/:id', GetOrderById)


//Payment


export {router as CustomerRoute}
