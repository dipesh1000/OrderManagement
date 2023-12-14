import express from "express";
import { Authenticate } from "../middlewares";
import { AddFood, getAllFoods } from "../controllers";
import multer from "multer";

const router = express.Router();
const imageStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images')
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString()+'_'+file.originalname);
    }
})

export const imageService = multer({storage: imageStorage}).array('images', 10)


router.get('/', getAllFoods);
router.use(Authenticate)
router.post('/', imageService, AddFood);

export {router as FoodRoute}