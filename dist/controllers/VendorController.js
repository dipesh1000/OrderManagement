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
exports.UpdateVendorService = exports.UpdateVendorProfile = exports.GetVendorProfile = exports.VendorLogin = void 0;
const AdminController_1 = require("./AdminController");
const utility_1 = require("../utility");
const VendorLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const availableVendor = yield (0, AdminController_1.FindVendor)('', email);
    if (availableVendor !== null) {
        // validation and give access
        const validation = yield (0, utility_1.validatePassword)(password, availableVendor.password, availableVendor.salt);
        if (validation) {
            const signature = yield (0, utility_1.GenerateSignature)({ _id: availableVendor.id, email: availableVendor.email, name: availableVendor.name });
            console.log(signature);
            return res.json({ token: signature, user: availableVendor });
        }
        else {
            res.json({ 'message': 'Password Not Valid' });
        }
    }
    return res.json({ 'message': 'Login Credential Not Valid' });
});
exports.VendorLogin = VendorLogin;
const GetVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingUser = yield (0, AdminController_1.FindVendor)(user._id);
        return res.json(existingUser);
    }
    return res.json({ "message": "Vendor Information not found" });
});
exports.GetVendorProfile = GetVendorProfile;
const UpdateVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingUser = yield (0, AdminController_1.FindVendor)(user._id);
        if (existingUser) {
            const files = req.files;
            const images = files.map((file) => file.filename);
            existingUser.coverImages.push(...images);
            const saveResults = yield existingUser.save();
            return res.json(saveResults);
        }
        return res.json(existingUser);
    }
    return res.json({ "message": "Vendor Information not found" });
});
exports.UpdateVendorProfile = UpdateVendorProfile;
const UpdateVendorService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingUser = yield (0, AdminController_1.FindVendor)(user._id);
        if (existingUser !== null) {
            existingUser.serviceAvailable = !existingUser.serviceAvailable;
            const saveResults = yield existingUser.save();
            return res.json(saveResults);
        }
        return res.json(existingUser);
    }
    return res.json({ "message": "Vendor Information not found" });
});
exports.UpdateVendorService = UpdateVendorService;
//# sourceMappingURL=VendorController.js.map