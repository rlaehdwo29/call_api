import { matchedData } from 'express-validator';
import momentTimezone from 'moment-timezone';

// 공통 메시지 데이터
const messageData = [
  { code: '200', data: { msg: '정상', httpStatus: 200 } },
  { code: '201', data: { msg: '데이터 있음', httpStatus: 200 } },
  {
    code: '2000',
    data: {
      msg: '계정이 존재하지 않거나 비밀번호를 잘못 입력하셨습니다.',
      httpStatus: 400,
    },
  },
  { code: '2001', data: { msg: '계정이 비활성화 되었습니다.', httpStatus: 400 } },
  { code: '2002', data: { msg: '계정이 만료되었습니다.', httpStatus: 400 } },
  { code: '2003', data: { msg: '요청 권한이 없습니다.', httpStatus: 403 } },
  { code: '2004', data: { msg: '계정이 잠겼습니다.', httpStatus: 400 } },
  { code: '2005', data: { msg: '계정의 패스워드 기간이 만료 되었습니다.', httpStatus: 400 } },
  { code: '2006', data: { msg: '이미 로그인한 계정이 있습니다.', httpStatus: 400 } },
  { code: '2007', data: { msg: '접근이 거부되었습니다.', httpStatus: 401 } },
  { code: '2008', data: { msg: '로그인 계정이 유효하지 않습니다.', httpStatus: 400 } },
  { code: '2009', data: { msg: '인증에 실패한 토큰입니다.', httpStatus: 402 } },
  { code: '2010', data: { msg: 'sms 발송에 실패했습니다', httpStatus: 400 } },
  { code: '3000', data: { msg: '요청하신 데이터가 없습니다.', httpStatus: 400 } },
  { code: '3001', data: { msg: '데이터 유효성 오류가 발생하였습니다.', httpStatus: 400 } },
  { code: '3002', data: { msg: '데이터 저장에 실패하였습니다.', httpStatus: 400 } },
  { code: '3003', data: { msg: '데이터 수정에 실패하였습니다.', httpStatus: 400 } },
  { code: '3004', data: { msg: '데이터 삭제에 실패하였습니다.', httpStatus: 400 } },
  { code: '3005', data: { msg: '중복된 데이터가 있습니다.', httpStatus: 400 } },
  { code: '3006', data: { msg: '출금계좌가 본인계좌입니다.', httpStatus: 400 } },
  { code: '3007', data: { msg: '출금가능잔액이 부족합니다.', httpStatus: 400 } },
  { code: '4000', data: { msg: '본인인증정보가 맞지 않습니다.', httpStatus: 403 } },
  { code: '4004', data: { msg: '현재비밀번호는 사용이 불가능합니다.', httpStatus: 400 } },
  { code: '4005', data: { msg: '이전 비밀번호는 사용이 불가능합니다.', httpStatus: 400 } },
  {
    code: '4006',
    data: {
      msg: '개인정보는 비밀번호 사용이 불가능합니다.',
      httpStatus: 400,
    },
  },
  { code: '5001', data: { msg: '기업회원 신청중입니다.', httpStatus: 400 } },
  { code: '5002', data: { msg: '기업회원 거절되었습니다.', httpStatus: 400 } },
  { code: '5003', data: { msg: 'SNS 계정입니다.', httpStatus: 400 } },
  { code: '9000', data: { msg: '서비스 점검중', httpStatus: 503 } },
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
  // 이메일 마스킹 처리
  setEmailMasking: (strEmail: string) => {
    const emailMath = strEmail.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
    let strLength: number;
    if (utils.isNull(strEmail) || utils.isNull(emailMath)) {
      return strEmail;
    } else if (emailMath === null) {
      return strEmail;
    } else {
      strLength = emailMath.toString().split('@')[0].length - 3;
      return strEmail.toString().replace(new RegExp('.(?=.{0,' + strLength + '}@)', 'g'), '*');
    }
  },
  // 이름 마스킹 처리
  setNameMasking: (strName: string) => {
    if (strName.length > 2) {
      const originName = strName.split('');
      for (let i = 0; i < originName.length; i++) {
        if (i === 0 || i === originName.length - 1) continue;
        originName[i] = '*';
      }
      const joinName = originName.join();
      return joinName.replace(/,/g, '');
    } else {
      const pattern = /.$/; // 정규식
      return strName.replace(pattern, '*');
    }
  },
  // 폰번호 마스킹 처리
  setPhoneMasking: (telNo: string) => {
    telNo = telNo.replace(/[^0-9]/g, '');
    if (telNo.length === 9) {
      telNo = telNo.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3');
    } else if (telNo.length === 10) {
      telNo = telNo.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    } else if (telNo.length === 11) {
      telNo = telNo.replace(/-/g, '').replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    }
    if (telNo.length === 13) {
      telNo = telNo.substring(0, telNo.indexOf('-') + 1) + '**' + telNo.substring(telNo.lastIndexOf('-') - 2);
    } else {
      telNo = telNo.substring(0, telNo.indexOf('-') + 1) + '**' + telNo.substring(telNo.lastIndexOf('-') - 1);
    }
    return telNo;
  },
  // Object 형태에서 컬럼별로 마스킹처리가 필요한 필요한 컬럼을 검색하여 마스킹 처리
  setMaskingField: (data: any) => {
    const phoneMaskingField = ['phone', 'admr_phone']; // 폰번호 마스킹 리스트
    const nameMaskingField = ['mbr_nm', 'admr_nm']; // 이름 마스킹 리스트
    const emailMaskingField = ['mbr_id', 'admr_id']; // 이메일 마스킹 리스트
    for (const nm in data) {
      if (phoneMaskingField.indexOf(nm) > -1) {
        data[nm] = utils.setPhoneMasking(data[nm]);
      } else if (nameMaskingField.indexOf(nm) > -1) {
        data[nm] = utils.setNameMasking(data[nm]);
      } else if (emailMaskingField.indexOf(nm) > -1) {
        data[nm] = utils.setEmailMasking(data[nm]);
      }
    }
  },
  // 텍스트 형태의 Date형 데이터 Format 을 YYYY-MM-DD 형태로 변환
  setTextDttmFormat: (data: any) => {
    const changeField = ['st_dttm', 'ed_dttm', 'disp_st_dt', 'disp_ed_dt'];
    for (const nm in data) {
      if (changeField.indexOf(nm) > -1) {
        data[nm] = data[nm].replace(/[^0-9]/g, '');
        data[nm] = data[nm].replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
      }
    }
  },
  // 리스트형 데이터에 소수점 제한처리
  decimalCalcu: (x1: number, x2: number) => {
    let x: number;
    if ((x1 * utils.demecalPoint - x2 * utils.demecalPoint) / utils.demecalPoint < 0) {
      x = 0;
    } else {
      x = (x1 * utils.demecalPoint - x2 * utils.demecalPoint) / utils.demecalPoint;
    }
    return x;
  },
  setArrayCeilField: (arrayData: any) => {
    let arrayClone: any = [];
    if (arrayData.rows) {
      arrayClone = {
        count: arrayData.count,
        rows: [],
      };
      for (const obj of arrayData.rows) {
        if (obj['dataValues']) {
          const cloneData = { ...obj.toJSON() } as any;
          utils.setCeilField(cloneData);
          arrayClone.rows.push(cloneData);
        } else {
          const cloneData = { ...obj };
          utils.setCeilField(cloneData);
          arrayClone.rows.push(cloneData);
        }
      }
    } else {
      for (const obj of arrayData) {
        const cloneData = { ...obj };
        utils.setCeilField(cloneData);
        arrayClone.push(cloneData);
      }
    }
    return arrayClone;
  },
  // Object형 데이터에 소수점 제한처리
  setCeilField: (data: any) => {
    const changeFieldIndexOf = [
      'amount',
      'fee',
      'tran_price',
      'total_price',
      'floor_price',
      'total_price_kr',
      'floor_price_kr',
      'sell_price',
      'sum_tran_price',
      'min_tran_price',
      'sell_fee',
      'royalty',
      'calcu_price',
      'eth_price_total',
      'matic_price_total',
      'klay_price_total',
      'tran_price_total',
      'sell_fee_total',
      'royalty_total',
      'calcu_price_total',
      'price_krw',
      'klay_tran_price',
      'klay_tran_price_krw',
      'klay_sell_fee',
      'klay_sell_fee_krw',
      'eth_tran_price',
      'eth_tran_price_krw',
      'eth_sell_fee',
      'eth_sell_fee_krw',
      'matic_tran_price',
      'matic_tran_price_krw',
      'matic_sell_fee',
      'matic_sell_fee_krw',
      'min_price',
      'max_price',
    ];

    for (const nm in data) {
      if (nm === 'eth_total' || nm === 'matic_total' || nm === 'klay_total') {
        data[nm] = Math.floor(data[nm] * utils.demecalPoint) / utils.demecalPoint;
      } else if (nm === 'eth_usable' || nm === 'matic_usable' || nm === 'klay_usable') {
        data[nm] = Math.floor(data[nm] * utils.demecalPoint) / utils.demecalPoint;
      } else if (changeFieldIndexOf.indexOf(nm) > -1) {
        data[nm] = Math.floor(Number(data[nm]) * utils.demecalPoint) / utils.demecalPoint;
      }
    }
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
  setPriceSplit: (price: string, network: string) => {
    // 가격에 네트워크 포함 처리
    return price.substring(-1, 6) + ' ' + network;
  },
  jsonStringify: (obj: any) => {
    let retData;
    try {
      retData = JSON.stringify(obj);
    } catch (e) {
      retData = '';
    }
    return retData;
  },
}

export default utils;
