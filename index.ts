import express from 'express';
import bodyParser from 'body-parser';
import {AdminRoute, VendorRoute, FoodRoute} from './routes'
import mongoose from 'mongoose';
import path from 'path';
import { MONGO_URI } from './config';
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use('/images', express.static(path.join(__dirname, 'images')))

app.use('/admin', AdminRoute);
app.use('/vendor', VendorRoute);
app.use('/foods', FoodRoute);

mongoose.connect(MONGO_URI)
    .then((response) => console.log("Database Connected Successfull, Compelete what you Start"))
    .catch((err) => console.log(err, "from Err"))

app.listen(8000, () => {
    console.log("App is listening to the port 8000");
})