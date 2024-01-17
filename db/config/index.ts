import { Dialect, Sequelize } from 'sequelize';
import { config } from './config';

export const sequelize = new Sequelize(
  config.db_server.database,
  config.db_server.username,
  config.db_server.password,
  {
    host: config.db_server.host,
    port: Number(config.db_server.port),
    dialect: (config.db_server.dialect as Dialect) || ('mysql' as Dialect),
    define: {
      timestamps: false,
    },
    timezone: '+09:00',
    pool: {
      max: config.db_server.pool_max,
      min: config.db_server.pool_min,
      acquire: config.db_server.pool_acquire,
      idle: config.db_server.pool_idle,
    },
    logging: config.db_server.logging,
  },
);
