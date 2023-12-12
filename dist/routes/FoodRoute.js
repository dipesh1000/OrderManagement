"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoodRoute = exports.imageService = void 0;
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("../middlewares");
const controllers_1 = require("../controllers");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
exports.FoodRoute = router;
const imageStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + '_' + file.originalname);
    }
});
exports.imageService = (0, multer_1.default)({ storage: imageStorage }).array('images', 10);
router.use(middlewares_1.Authenticate);
router.post('/', exports.imageService, controllers_1.AddFood);
router.get('/', controllers_1.getAllFoods);
//# sourceMappingURL=FoodRoute.js.map