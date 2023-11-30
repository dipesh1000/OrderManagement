import { Request, Response, NextFunction } from "express";
import { EditVendorInputs, VendorInputs } from "../dto";
import { FindVendor } from "./AdminController";
import { GenerateSignature, validatePassword } from "../utility";

export const VendorLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = <VendorInputs>req.body;

    const availableVendor = await FindVendor('', email);

    if (availableVendor !== null) {
        // validation and give access
        const validation = await validatePassword(password, availableVendor.password, availableVendor.salt);
        if (validation) {
            const signature = await GenerateSignature({_id: availableVendor.id, email: availableVendor.email, name: availableVendor.name})
            console.log(signature);
            return res.json({token: signature, user: availableVendor})
        } else {
            res.json({'message': 'Password Not Valid'})
        }
    }

    return res.json({'message': 'Login Credential Not Valid'})
}

export const GetVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user) {
        const existingUser = await FindVendor(user._id);
        return res.json(existingUser);
    }
    return res.json({"message": "Vendor Information not found"})
}

export const UpdateVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
    const {name, address, phone, foodType} = <EditVendorInputs>req.body;
    const user = req.user;
    if (user) {
        const existingUser = await FindVendor(user._id);
        if (existingUser !== null) {
            existingUser.name = name;
            existingUser.address = address;
            existingUser.phone = phone;
            existingUser.foodType = foodType;
            const saveResults = await existingUser.save();
            return res.json(saveResults);
        }
        return res.json(existingUser);
    }
    return res.json({"message": "Vendor Information not found"})
}

export const UpdateVendorService = async (req: Request, res: Response, next: NextFunction) => {

    const user = req.user;
    if (user) {
        const existingUser = await FindVendor(user._id);
        if (existingUser !== null) {
            existingUser.serviceAvailable = !existingUser.serviceAvailable;
            const saveResults = await existingUser.save();
            return res.json(saveResults);
        }
        return res.json(existingUser);
    }
    return res.json({"message": "Vendor Information not found"})
}
