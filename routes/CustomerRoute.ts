import express from 'express';
import { CustomerLogin, CustomerProfile, CustomerSignUp, CustomerVerify, EditCustomerProfile, RequestOTP } from '../controllers';
const router = express.Router();

/** -------------------- Signup / Create Customer ------------------- */
router.post('/signup', CustomerSignUp)

/** -------------------- Login ------------------- */
router.post('/login', CustomerLogin)


/** -------------------- Verify Customer Account ------------------- */
router.patch('/verify', CustomerVerify)


/** -------------------- OTP / Requesting ------------------- */
router.get('/otp', RequestOTP)


/** -------------------- PROFILE ------------------- */
router.get('/profile', CustomerProfile)
router.post('/profile', EditCustomerProfile)


//Cart
//Order
//Payment


export {router as CustomerRoute}
