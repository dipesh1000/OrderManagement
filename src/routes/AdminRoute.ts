import express, {Request, Response, NextFunction} from 'express'
import { CreateVendor, GetVendors, getVendorById } from '../controllers';

const router = express.Router();

router.post('/vendor', CreateVendor);
router.get('/vendors', GetVendors);
router.get('/vendor/:id', getVendorById)

router.get('/', (req: Request, res: Response, next:NextFunction) => {
    res.json({message: "Hello From Admin"})
})

export {router as AdminRoute}