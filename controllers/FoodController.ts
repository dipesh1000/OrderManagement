import { NextFunction, Request, Response } from "express";
import { CreateFoodInputs } from "../dto";
import { FindVendor } from "./AdminController";
import { Food } from "../models";


export const AddFood = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if(user) {
        const {name, description, category, foodType, readyTime, price} = <CreateFoodInputs>req.body;
        const vendor = await FindVendor(user._id);
        if (vendor !== null) {
            const files = req.files as [Express.Multer.File];
            const images = files.map((file: Express.Multer.File) => file.filename)
            const addedfood = await Food.create({
                vendorId: vendor.id,
                name: name,
                description: description, 
                category: category, 
                foodType: foodType, 
                readyTime: readyTime,
                price: price,
                rating: 0,
                images: images,
            })
            vendor.foods.push(addedfood);
            const result = await vendor.save();
            return res.status(201).json({ message: "Food Added Success", result})
        }
        return res.status(401).json({ message: "User Not Found"})
    }
}

export const getAllFoods = (req: Request, res: Response, next: NextFunction) => {
    
}