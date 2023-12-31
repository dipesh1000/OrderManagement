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
exports.RestaurantById = exports.SearchFoods = exports.GetFoodSearchIn30Min = exports.GetTopRestaurants = exports.GetFoodAvailability = void 0;
const models_1 = require("../models");
const GetFoodAvailability = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    if (!pincode) {
        return res.status(401).json({
            error: true,
            pincode
        });
    }
    const vendor = yield models_1.Vendor.find({ pincode: pincode, serviceAvailable: false })
        .sort([['rating', 'descending']])
        .populate("foods");
    if (vendor.length > 0) {
        return res.status(200).json({
            error: false,
            data: vendor
        });
    }
    res.status(404).json({
        error: false,
        message: 'Data No Available'
    });
});
exports.GetFoodAvailability = GetFoodAvailability;
const GetTopRestaurants = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    if (!pincode) {
        return res.status(401).json({
            error: true,
            pincode
        });
    }
    const vendor = yield models_1.Vendor.find({ pincode: pincode, serviceAvailable: false })
        .sort([['rating', 'descending']])
        .limit(5);
    if (vendor.length > 0) {
        return res.status(200).json({
            error: false,
            data: vendor
        });
    }
    res.status(404).json({
        error: false,
        message: 'Data No Available'
    });
});
exports.GetTopRestaurants = GetTopRestaurants;
const GetFoodSearchIn30Min = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    if (!pincode) {
        return res.status(401).json({
            error: true,
            pincode
        });
    }
    const results = yield models_1.Vendor.find({ pincode: pincode, serviceAvailable: false }).populate("foods");
    if (results.length > 0) {
        let foodResults = [];
        results.map((vendor) => {
            const foods = vendor.foods;
            foodResults.push(...foods.filter(food => food.readyTime <= 30));
        });
        return res.status(200).json(foodResults);
    }
});
exports.GetFoodSearchIn30Min = GetFoodSearchIn30Min;
const SearchFoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    if (!pincode) {
        return res.status(401).json({
            error: true,
            pincode
        });
    }
    const results = yield models_1.Vendor.find({ pincode: pincode, serviceAvailable: false }).populate("foods");
    if (results.length > 0) {
        let foodResults = [];
        results.map((item) => {
            foodResults.push(...item.foods);
        });
        return res.status(200).json(foodResults);
    }
});
exports.SearchFoods = SearchFoods;
const RestaurantById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield models_1.Vendor.findById(id).populate('foods');
    if (result) {
        return res.status(200).json(result);
    }
    return res.status(400).json({ message: 'Data Not Found' });
});
exports.RestaurantById = RestaurantById;
//# sourceMappingURL=ShoppingController.js.map