import { Request, NextFunction, Response } from 'express'
import { AuthPayload } from '../dto/Auth.dto';
import { ValidateSingnature } from '../utility';


declare global {
    namespace Express{
        interface Request{
            user?: AuthPayload
        }
    }
}

export const Authenticate = async (req: Request, res: Response, next: NextFunction) => {

    const signature = await ValidateSingnature(req);
    if(signature){
        return next()
    }else{
        return res.json({message: "User Not authorised"});
    }
}