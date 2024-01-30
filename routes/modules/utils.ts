import { matchedData } from 'express-validator';
import momentTimezone from 'moment-timezone';

// 공통 메시지 데이터
const messageData = [
  { code: '200', data: { msg: '정상', httpStatus: 200 } },
  { code: '201', data: { msg: '데이터 있음', httpStatus: 200 } },
  {
    code: '4006',
    data: {
      msg: '개인정보는 비밀번호 사용이 불가능합니다.',
      httpStatus: 400,
    },
  },
  {
    code: '9999',
    data: {
      msg: '알 수 없는 에러가 발생했습니다. 관리자에게 문의하시기 바랍니다.',
      httpStatus: 400,
    },
  },
];

type ResultMap = {
  status?: string;
  message?: string | null;
  path?: string | null;
  size?: number;
  data?: object;
};

const debugMode = (process.env.NODE_ENV || 'development') !== 'production';
const utils = {
  TOKEN_EXPIRED: -3,
  TOKEN_INVALID: -2,
  demecalPoint: 1000000, // 소수점 처리를 위한 공통 변수
  isNull: (str: string | RegExpMatchArray | null) => {
    return str === null || typeof str === 'undefined' || str === '';
  },
  nvl: (str: string, chstr: string) => {
    if (utils.isNull(str)) {
      return chstr;
    }
    return str;
  },
  printDebug: (code: string, msg: any = null) => {
    if (debugMode) {
      if (msg) console.log(code, msg);
      else console.log(code);
    }
  },
  // 공통 메시지 코드에서 HttpStatus 메시지내용 가져오기
  getMsgByCode: (code: string) => {
    return messageData.find((el) => el.code === code)?.data?.msg;
  },
  // 공통 메시지 코드에서 HttpStatus 코드 가져오기
  getHttpStatusByCode: (code: string | undefined) => {
    let status: number;
    try {
      status = messageData.find((el) => el.code === code)?.data?.httpStatus ?? 500;
    } catch (e) {
      status = 500;
    }
    return status;
  },
  // Retrun 해줄 공통 JSON 형태 데이터를 만들어준다.
  getResultData: (
    code: string,
    msg: string | undefined | null = null,
    path: string | undefined | null = null,
    data: any | undefined | null = null,
  ) => {
    const dataMap: ResultMap = {
      status: code,
      message: msg != null ? msg : utils.getMsgByCode(code),
      path,
      // timestamp: Date.now(),
    };
    if (data != undefined && data != null) {
      dataMap.data = data;
    }

    return dataMap;
  },
  jsonStringify: (obj: any) => {
    let retData;
    try {
      retData = JSON.stringify(obj);
    } catch (e) {
      retData = '';
    }
    return retData;
  }
}

export default utils;
