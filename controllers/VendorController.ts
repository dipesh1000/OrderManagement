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
    const user = req.user;
    if (user) {
        const existingUser = await FindVendor(user._id);
        if (existingUser) {
            const files = req.files as [Express.Multer.File];
            const images = files.map((file: Express.Multer.File) => file.filename);
            existingUser.coverImages.push(...images);
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
