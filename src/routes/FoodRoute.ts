import express from "express";
import { Authenticate } from "../middlewares";
import { AddFood, getAllFoods } from "../controllers";
import multer from "multer";

const router = express.Router();
const imageStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './src/images')
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString()+'_'+file.originalname);
    }
})

const imageService = multer({storage: imageStorage}).array('images', 10)


router.get('/', getAllFoods);
router.use(Authenticate)
router.post('/', imageService, AddFood);


// GetCurrentOrders
router.get('/currentorders')

// GetOrderDetails
router.get('/orderDetails')

export {router as FoodRoute}