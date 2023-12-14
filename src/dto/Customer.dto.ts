import { IsEmail, IsEmpty, Length } from "class-validator";

export class CreateCustomerInputs {

    @IsEmail()
    email: string;

    @Length(7, 12)
    phone: string;

    @Length(6, 12)
    password: string;
}

export class UserLoginInput {

    @IsEmail()
    email: string;

    @Length(6, 12)
    password: string;
}

export class CustomerEditInputs {

    @Length(2, 25)
    firstName: string;

    @Length(2, 25)
    lastName: string;

    @Length(2, 100)
    address: string;
}

export interface CustomerPayload {
    _id: string;
    email: string;
    verified: boolean
}

export class OrderInputs {
    _id: string;
    unit: number;
}