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
exports.getAllFoods = exports.AddFood = void 0;
const AdminController_1 = require("./AdminController");
const models_1 = require("../models");
const AddFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const { name, description, category, foodType, readyTime, price } = req.body;
        const vendor = yield (0, AdminController_1.FindVendor)(user._id);
        if (vendor !== null) {
            const files = req.files;
            const images = files.map((file) => file.filename);
            const addedfood = yield models_1.Food.create({
                vendorId: vendor.id,
                name: name,
                description: description,
                category: category,
                foodType: foodType,
                readyTime: readyTime,
                price: price,
                rating: 0,
                images: images,
            });
            vendor.foods.push(addedfood);
            const result = yield vendor.save();
            return res.status(201).json({ message: "Food Added Success", result });
        }
        return res.status(401).json({ message: "User Not Found" });
    }
});
exports.AddFood = AddFood;
const getAllFoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const foods = yield models_1.Food.find();
    return res.status(200).json(foods);
});
exports.getAllFoods = getAllFoods;
//# sourceMappingURL=FoodController.js.map