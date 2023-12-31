import express, {Request, Response, NextFunction} from 'express';
import { GetCurrentOrders, GetOrderDetails, GetVendorProfile, ProcessOrder, UpdateVendorProfile, UpdateVendorService, VendorLogin } from '../controllers';
import { Authenticate } from '../middlewares';
import multer from 'multer';

const imageStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './src/images')
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString()+'_'+file.originalname);
    }
})

const imageService = multer({storage: imageStorage}).array('images', 10)

const router = express.Router();

router.post('/login', VendorLogin)
router.use(Authenticate)
router.get('/profile', GetVendorProfile)
router.patch('/profile',imageService, UpdateVendorProfile)
router.patch('/service', UpdateVendorService)

//orders
router.get('/orders', GetCurrentOrders);
router.put('/orders/:id/process', ProcessOrder);
router.get('/orders/:id', GetOrderDetails);



router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.json({message: "Hello From Vendor"})
})

export {router as VendorRoute}