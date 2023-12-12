import express from 'express';
import { GetFoodAvailability, GetFoodSearchIn30Min, GetTopRestaurants, RestaurantById, SearchFoods } from '../controllers';
const router = express.Router();

/** -------------------- Food Availability ------------------- */
router.get('/:pincode', GetFoodAvailability)

/** -------------------- Top Restaurants ------------------- */
router.get('/top-restaurants/:pincode', GetTopRestaurants)

/** -------------------- Foods Available in 30 Minutes ------------------- */
router.get('/foods-in-30-min/:pincode', GetFoodSearchIn30Min)

/** -------------------- Search Foods ------------------- */
router.get('/search/:pincode', SearchFoods)

/** -------------------- Find Restaurant By Id ------------------- */
router.get('/restaurant/:id', RestaurantById)

export {router as ShoppingRoute}
