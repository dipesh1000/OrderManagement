"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorRoute = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const FoodRoute_1 = require("./FoodRoute");
const router = express_1.default.Router();
exports.VendorRoute = router;
router.post('/login', controllers_1.VendorLogin);
router.use(middlewares_1.Authenticate);
router.get('/profile', controllers_1.GetVendorProfile);
router.patch('/profile', FoodRoute_1.imageService, controllers_1.UpdateVendorProfile);
router.patch('/service', controllers_1.UpdateVendorService);
router.get('/', (req, res, next) => {
    res.json({ message: "Hello From Vendor" });
});
//# sourceMappingURL=VendorRoute.js.map