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
exports.getVendorById = exports.GetVendors = exports.CreateVendor = exports.FindVendor = void 0;
const Vendor_1 = require("../models/Vendor");
const utility_1 = require("../utility");
const FindVendor = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (email) {
        return yield Vendor_1.Vendor.findOne({ email: email });
    }
    else {
        return yield Vendor_1.Vendor.findById(id);
    }
});
exports.FindVendor = FindVendor;
const CreateVendor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, address, pincode, foodType, email, password, ownerName, phone } = req.body;
    const existingData = yield (0, exports.FindVendor)('', email);
    if (existingData !== null) {
        return res.json({ "message": "A vendor is exist with this email ID" });
    }
    // generate a salt
    const salt = yield (0, utility_1.GenerateSalt)();
    const userPassword = yield (0, utility_1.GeneratePassword)(password, salt);
    // encrypt the password using the salt
    const createVendor = yield Vendor_1.Vendor.create({
        name,
        address,
        pincode,
        foodType,
        email,
        password: userPassword,
        salt: salt,
        ownerName,
        phone,
        rating: 0,
        serviceAvailable: false,
        coverImages: [],
        foods: []
    });
    return res.json(createVendor);
});
exports.CreateVendor = CreateVendor;
const GetVendors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vendors = yield Vendor_1.Vendor.find();
    if (vendors !== null) {
        return res.status(200).json(vendors);
    }
    return res.json({ 'message': 'Vendors Data is not available' });
});
exports.GetVendors = GetVendors;
const getVendorById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let vendorId = req.params.id;
    const vendor = yield (0, exports.FindVendor)(vendorId);
    if (vendor !== null) {
        return res.status(200).json(vendor);
    }
    return res.json({ 'message': 'Vendor with this id Not Found!' });
});
exports.getVendorById = getVendorById;
//# sourceMappingURL=AdminController.js.map