import dotEnvConfig from '../../config/dot-env-config';
dotEnvConfig();

export const config = {
  db_server: {
    username: process.env.DB_USERNAME || 'test',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME || 'test',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_TYPE || 'mysql',
    pool_max: Number(process.env.DB_POOL_MAX) || 10,
    pool_min: Number(process.env.DB_POOL_MIN) || 0,
    pool_acquire: Number(process.env.DB_POOL_ACQUIRE) || 30000,
    pool_idle: Number(process.env.DB_POOL_IDLE) || 10000,
    logging: (process.env.NODE_ENV || 'local') === 'local' ? true : false,
  },
};
