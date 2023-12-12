import { Request, Response, NextFunction } from "express";
import { CreateVendorInput } from "../dto";
import { Vendor } from "../models/Vendor";
import { GeneratePassword, GenerateSalt } from "../utility";

export const FindVendor = async (id: string | undefined, email?: string) => {
    if(email) {
        return await Vendor.findOne({email: email})
    } else {
        return await Vendor.findById(id);
    }
}

export const CreateVendor = async (req: Request, res: Response, next:NextFunction) => {
    const { name, address, pincode, foodType, email, password, ownerName, phone } = <CreateVendorInput>req.body;

    const existingData = await FindVendor('', email)
    if(existingData !== null) {
        return res.json({"message": "A vendor is exist with this email ID"})
    }

    // generate a salt
    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt)
    // encrypt the password using the salt

    const createVendor = await Vendor.create({
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
    })
    return res.json(createVendor)
}

export const GetVendors = async (req: Request, res: Response, next: NextFunction) => {
    const vendors = await Vendor.find();

    if(vendors !== null) {
        return res.status(200).json(vendors);
    }

    return res.json({'message': 'Vendors Data is not available'})
}

export const getVendorById = async (req: Request, res: Response, next: NextFunction) => {
    let vendorId = req.params.id;
    const vendor = await FindVendor(vendorId);

    if (vendor !== null) {
        return res.status(200).json(vendor);
    }
    return res.json({'message': 'Vendor with this id Not Found!'})
}