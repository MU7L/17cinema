import { UserModel } from "../db";

export const createUser = async (nickname: string) => {
    return await UserModel.create({ nickname });
}

export const findUser =async (id:string) => {
    return await UserModel.findById(id);
}