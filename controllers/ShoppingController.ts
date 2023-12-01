import { NextFunction, Request, Response } from "express";
import { FoodDoc, Vendor } from "../models";

export const GetFoodAvailability = async (req: Request, res: Response, next: NextFunction) => {
    const pincode = req.params.pincode;
    if (!pincode) {
        return res.status(401).json({
            error: true,
            pincode
        })
    }
    const vendor = await Vendor.find({pincode: pincode, serviceAvailable: false})
    .sort([['rating', 'descending']])
    .populate("foods");

    if (vendor.length > 0) {
        return res.status(200).json({
            error: false,
            data: vendor
        })
    }
    res.status(404).json({
        error: false,
        message: 'Data No Available'
    })

}

export const GetTopRestaurants = async (req: Request, res: Response, next: NextFunction) => {
    const pincode = req.params.pincode;
    if (!pincode) {
        return res.status(401).json({
            error: true,
            pincode
        })
    }
    const vendor = await Vendor.find({pincode: pincode, serviceAvailable: false})
    .sort([['rating', 'descending']])
    .limit(5);
    if (vendor.length > 0) {
        return res.status(200).json({
            error: false,
            data: vendor
        })
    }
    res.status(404).json({
        error: false,
        message: 'Data No Available'
    })
}

export const GetFoodSearchIn30Min = async (req: Request, res: Response, next: NextFunction) => {
    const pincode = req.params.pincode;
    if (!pincode) {
        return res.status(401).json({
            error: true,
            pincode
        })
    }
    const results = await Vendor.find({pincode: pincode, serviceAvailable: false}).populate("foods")
   
    if(results.length > 0) {
        let foodResults: any = [];
        results.map((vendor) => {
            const foods = vendor.foods as [FoodDoc]
            foodResults.push(...foods.filter(food => food.readyTime <= 30));
        })
        return res.status(200).json(foodResults);
    } 
}

export const SearchFoods = async (req: Request, res: Response, next: NextFunction) => {
    const pincode = req.params.pincode;
    if (!pincode) {
        return res.status(401).json({
            error: true,
            pincode
        })
    }
    const results = await Vendor.find({pincode: pincode, serviceAvailable: false}).populate("foods")
   
    if(results.length > 0) {
        let foodResults: any = [];
        results.map((item) => {
            foodResults.push(...item.foods);
        })
        return res.status(200).json(foodResults);
    } 
}

export const RestaurantById = (req: Request, res: Response, next: NextFunction) => {
    
}