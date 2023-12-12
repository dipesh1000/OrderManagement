import express from 'express';
import { CustomerLogin, CustomerProfile, CustomerSignUp, CustomerVerify, EditCustomerProfile, RequestOTP } from '../controllers';
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
//Payment


export {router as CustomerRoute}
