import dotenv from 'dotenv';
import path from 'path';

const matchEnv = (NODE_ENV: string) => {
  switch (NODE_ENV) {
    case 'production': // 운영환경
      return '.env.prod';
    case 'development': // 테스트환경
      return '.env.dev';
    default: // 개발환경
      return '.env';
  }
};

const matchSrv = (NODE_SRV: string) => {
  switch (NODE_SRV) {
    case 'A': // 운영환경
      return 'admin';
    default: // 개발환경
      return 'service';
  }
};

// dotenv로 환경설정 변경
const dotEnvConfig = () =>
  dotenv.config({
    path: path.resolve(
      process.cwd(),
      'env',
      matchSrv(process.env.NODE_SRV || 'S'),
      matchEnv(process.env.NODE_ENV || 'local'),
    ),
  });

export default dotEnvConfig;
