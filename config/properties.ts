import { Algorithm } from "jsonwebtoken";
import dotEnvConfig from "./dot-env-config";
dotEnvConfig();

var _default = {
    defaultUrl: (process.env.NODE_ENV || 'local') === 'local' ? '/api/v1' : '',
    aesSecretKey: process.env.AES_SECRET_KEY || 'AES_SECRET_KEY',
}

export default _default;