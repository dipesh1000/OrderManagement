import mongoose from "mongoose"
import { MONGO_URI } from "../config"

export default async () => {
    mongoose.connect(MONGO_URI)
    .then((response) => console.log("Database Connected Successfull, Compelete what you Start"))
    .catch((err) => console.log(err, "from Err"))
}