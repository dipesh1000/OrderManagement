"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOrder = exports.EditCustomerProfile = exports.CustomerProfile = exports.RequestOTP = exports.CustomerVerify = exports.CustomerLogin = exports.CustomerSignUp = void 0;
const class_transformer_1 = require("class-transformer");
const dto_1 = require("../dto");
const class_validator_1 = require("class-validator");
const utility_1 = require("../utility");
const models_1 = require("../models");
const CustomerSignUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customerInputs = (0, class_transformer_1.plainToClass)(dto_1.CreateCustomerInputs, req.body);
    const inputErrors = yield (0, class_validator_1.validate)(customerInputs, { validationError: { target: true } });
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }
    const { email, phone, password } = customerInputs;
    const existingCustomer = yield models_1.Customer.findOne({ email: email });
    if (existingCustomer !== null) {
        return res.status(409).json({ message: 'User existing with this email Id' });
    }
    const salt = yield (0, utility_1.GenerateSalt)();
    const userPassword = yield (0, utility_1.GeneratePassword)(password, salt);
    // Generate OTP
    const { otp, expiry } = (0, utility_1.GenerateOtp)();
    const result = yield models_1.Customer.create({
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
    });
    if (result) {
        // send the OTP customer
        yield (0, utility_1.onRequestOTP)(otp, phone);
        // generate the signature
        const signature = yield (0, utility_1.GenerateSignature)({
            _id: result._id,
            email: result.email,
            verified: result.verified
        });
        // send the result to client
        return res.status(201).json({
            signature: signature,
            verified: result.verified,
            email: result.email
        });
    }
    return res.status(400).json({ message: 'Error With signup' });
});
exports.CustomerSignUp = CustomerSignUp;
const CustomerLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const loginInputs = (0, class_transformer_1.plainToClass)(dto_1.UserLoginInput, req.body);
    const loginErrors = yield (0, class_validator_1.validate)(loginInputs, { validationError: { target: false } });
    if (loginErrors.length > 0) {
        return res.status(400).json(loginErrors);
    }
    const { email, password } = loginInputs;
    const customer = yield models_1.Customer.findOne({ email: email });
    if (customer) {
        const validation = yield (0, utility_1.validatePassword)(password, customer.password, customer.salt);
        if (validation) {
            const signature = yield (0, utility_1.GenerateSignature)({
                _id: customer._id,
                email: customer.email,
                verified: customer.verified
            });
            return res.status(201).json({
                signature: signature,
                verified: customer.verified,
                email: customer.email
            });
        }
    }
    return res.status(400).json({ message: 'Error With Login' });
});
exports.CustomerLogin = CustomerLogin;
const CustomerVerify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = req.body;
    const customer = req.user;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id);
        if (profile) {
            if (profile.otp === parseInt(otp) && new Date(profile.otp_expiry) >= new Date()) {
                profile.verified = true;
                const updatedCustomerResponse = yield profile.save();
                // generate the signature
                const signature = yield (0, utility_1.GenerateSignature)({
                    _id: updatedCustomerResponse._id,
                    email: updatedCustomerResponse.email,
                    verified: updatedCustomerResponse.verified
                });
                return res.status(201).json({
                    signature: signature,
                    verified: updatedCustomerResponse.verified,
                    email: updatedCustomerResponse.email
                });
            }
        }
    }
    return res.status(400).json({ message: 'Error With OTP Validateion' });
});
exports.CustomerVerify = CustomerVerify;
const RequestOTP = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id);
        if (profile) {
            const { otp, expiry } = (0, utility_1.GenerateOtp)();
            profile.otp = otp;
            profile.otp_expiry = expiry;
            yield profile.save();
            yield (0, utility_1.onRequestOTP)(otp, profile.phone);
            res.status(200).json({ message: 'OTP sent your registered phone number!' });
        }
    }
    return res.status(400).json({ message: 'Error With Request OTP' });
});
exports.RequestOTP = RequestOTP;
const CustomerProfile = (req, res, next) => {
};
exports.CustomerProfile = CustomerProfile;
const EditCustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    const updateInputs = yield (0, class_transformer_1.plainToClass)(dto_1.CustomerEditInputs, req.body);
    const updateErrors = yield (0, class_validator_1.validate)(updateInputs, { validationError: { target: false } });
    if (updateErrors.length > 0) {
        return res.status(400).json(updateErrors);
    }
    const { firstName, lastName, address } = updateInputs;
    if (customer) {
        const user = yield models_1.Customer.findById(customer._id);
        if (user) {
            user.firstName = firstName;
            user.lastName = lastName;
            user.address = address;
            const saveResults = yield (user === null || user === void 0 ? void 0 : user.save());
            return res.status(201).json({ message: "Updated Successfull", saveResults });
        }
    }
    return res.status(400).json({ message: 'Error With Update Request' });
});
exports.EditCustomerProfile = EditCustomerProfile;
const CreateOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // grab current login customer
    const customer = req.user;
    console.log(customer, "from customer");
    return res.send("response Okay");
    // create an order ID
    // Grab order items from request [{id: XX, unit: XX}]
    // Calculate order amount
    // Create Order with Item descriptions
    // Finally update Orders to user account
});
exports.CreateOrder = CreateOrder;
//# sourceMappingURL=CustomerController.js.map