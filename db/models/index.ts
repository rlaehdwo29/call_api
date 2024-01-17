import { sequelize } from "../config";
import UserModel from './t_user';


const DB = {
    randomKey: Math.floor(Math.random() * (10000 - 1)) + 1,
    sequelize,
    User: UserModel(sequelize)
};

export default DB;