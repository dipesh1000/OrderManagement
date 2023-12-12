import { NextFunction, Request, Response } from "express";
import { plainToClass } from 'class-transformer'
import { CreateCustomerInputs, CustomerEditInputs, UserLoginInput } from "../dto";
import {validate} from 'class-validator';
import { GenerateOtp, GeneratePassword, GenerateSalt, GenerateSignature, onRequestOTP, validatePassword } from "../utility";
import { Customer } from "../models";

export const CustomerSignUp = async (req: Request, res: Response, next:NextFunction) => {

    const customerInputs = plainToClass(CreateCustomerInputs, req.body)

    const inputErrors = await validate(customerInputs, {validationError: {target: true}})

    if(inputErrors.length > 0){
        return res.status(400).json(inputErrors);
    }

    const {email, phone, password} = customerInputs;

    const existingCustomer = await Customer.findOne({email: email})

    if(existingCustomer !== null) {
        return res.status(409).json({message: 'User existing with this email Id'})
    }

    const salt = await GenerateSalt()

    const userPassword = await GeneratePassword(password, salt)

    // Generate OTP
    const {otp, expiry} = GenerateOtp();


    const result = await Customer.create({
        email: email,
        password: userPassword,
        salt: salt,
        phone: phone,
        otp: otp,
        otp_expiry: expiry,
        firstName: '',
        lastName: '',
        address: '',
        verified: false,
        lat: 0,
        lng: 0
    })

    if (result) {
        // send the OTP customer
        await onRequestOTP(otp, phone)

        // generate the signature
        
        const signature = await GenerateSignature({
            _id: result._id,
            email: result.email,
            verified: result.verified
        })

        // send the result to client
        return res.status(201).json({
            signature: signature,
            verified: result.verified,
            email: result.email
        })
    }

    return res.status(400).json({message: 'Error With signup'})

}

export const CustomerLogin = async (req: Request, res: Response, next: NextFunction) => {

    const loginInputs = plainToClass(UserLoginInput, req.body);

    const loginErrors = await validate(loginInputs, {validationError: {target: false}})

    if(loginErrors.length > 0) {
        return res.status(400).json(loginErrors)
    }

    const {email, password} = loginInputs;

    const customer = await Customer.findOne({email: email})

    if (customer) {
        const validation = await validatePassword(password, customer.password, customer.salt);

        if (validation) {
            const signature = await GenerateSignature({
                _id: customer._id,
                email: customer.email,
                verified: customer.verified
            })
            return res.status(201).json({
                signature: signature,
                verified: customer.verified,
                email: customer.email
            })
        }
    }
    return res.status(400).json({message: 'Error With Login'})
}

export const CustomerVerify = async (req: Request, res: Response, next:NextFunction) => {
    const {otp} = req.body;
    const customer = req.user;

    if (customer) {
        const profile = await Customer.findById(customer._id)
        if(profile) {
            if(profile.otp === parseInt(otp) && new Date(profile.otp_expiry) >= new Date()) {
                profile.verified = true;
                const updatedCustomerResponse = await profile.save();
                // generate the signature
                const signature = await GenerateSignature({
                    _id: updatedCustomerResponse._id,
                    email: updatedCustomerResponse.email,
                    verified: updatedCustomerResponse.verified
                })
                return res.status(201).json({
                    signature: signature,
                    verified: updatedCustomerResponse.verified,
                    email: updatedCustomerResponse.email
                })
            }
        }
    }
    return res.status(400).json({message: 'Error With OTP Validateion'})

}

export const RequestOTP = async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.user;

    if (customer) {
        const profile = await Customer.findById(customer._id);

        if (profile) {
            const {otp, expiry} = GenerateOtp();

            profile.otp = otp;
            profile.otp_expiry = expiry;
            await profile.save();
            await onRequestOTP(otp, profile.phone);

            res.status(200).json({message: 'OTP sent your registered phone number!'})
        }
    }
    return res.status(400).json({message: 'Error With Request OTP'})
}

export const CustomerProfile = (req: Request, res: Response, next:NextFunction) => {

}

export const EditCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.user;

    const updateInputs = await plainToClass(CustomerEditInputs, req.body);

    const updateErrors = await validate(updateInputs, {validationError: {target: false}})

    if(updateErrors.length > 0) {
        return res.status(400).json(updateErrors)
    }

    const {firstName, lastName, address} = updateInputs;

    if (customer) {
        const user = await Customer.findById(customer._id);
        if(user) {
            user.firstName = firstName;
            user.lastName = lastName;
            user.address = address;
            const saveResults = await user?.save();
            return res.status(201).json({message: "Updated Successfull", saveResults})
        }
    
    }

    return res.status(400).json({message: 'Error With Update Request'})

}