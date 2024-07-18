import { logger } from '../../modules/logger';
import utils from '../../modules/utils';
import { Request, Response } from 'express';
import { Router } from 'express';
import axios from 'axios';
import momentTimezone from 'moment-timezone';
import { json } from 'sequelize';

const router = Router();

const defaultUrl = "https://api.15887924.com:18091/"; //테스트
//const defaultUrl = "https://api.15887924.com:18099/"; //운영서버

/**
 * 
 * 화물등록내역
 * 링크 API To 24시콜 API 호출
 * 
 * @param url_call              //화물등록내역(건별) URL
 * @param req_json              // OrdNo 화물번호 암호화
 * 
 * 
 * @apiSuccessExample {json} 성공:
 * 
 * 
 * @apiUse errorCommon
 * @apiUse ErrorSample
 * @apiErrorExample {json} Error_ooo
 * 
 * {
 *   "status": "400",
 *   "message": "실패",
 *   "path": "/api/call24/ordNoChk",
 *   "data": {
 *       "mIp": "192.168.53.51",
 *       "expired": "2024-01-23",
 *       "code": "0002",
 *       "data": "f2jyQgmQX0pnDsNjId/FTl+Y4G3EUuzf2v2gh3/WCIKvGcyrDcVVBxTtzGik4rv0WqzoXea3Ue/FcggJRScDWqdWCxjG+oSEzCCv8Bq6aEBmWIdfzK51CpMG2qp7FUopR+brz0OZwzyUJ4N1bzeW4vGCRxHxwITYVoGqpei8smAn13Qm4IYp6W7aC9ubA5Ou"
 *   }
 * }
 * 
 */
const ordNoChk = async (req: Request, res: Response) => {
   
    let retData = utils.getResultData('2007', null, req.originalUrl);
    const date = momentTimezone().tz('Asia/Seoul');
    try{

        const subUrl = req.param('url_call');
        const reqJson = req.param('req_json');
        const apiKey = req.param('api_key');
     
            //API 배차확정 
            await axios({
                url:defaultUrl+subUrl, 
                method: 'post',
                headers: {
                 'Content-Type': 'application/json',
                 'call24-api-key': apiKey,
                 'Cache-Control': 'no-cache'
                },
                data: {
                    data: reqJson,
                },
            }).then(async function (response){
                if(response.status != 200) {
                    retData = utils.getResultData(`${response.status}`, '실패', req.originalUrl, { subUrl: subUrl, expired: date.format('YYYY-MM-DD'),  data: reqJson });
                    logger.error(`Error Respose Data : \nreqJson: ${reqJson} \nstatus: ${response.status} \ndata: ${retData.data}`);
                }else{
                    retData = utils.getResultData(`${response.status}`, '정상', req.originalUrl, { subUrl: subUrl, expired: date.format('YYYY-MM-DD'),  data: reqJson });
                    logger.info(`Respose Data : \nreqJson: ${reqJson} \nstatus: ${response.status} \ndata: ${retData.data}`);
                }
                logger.info('order controller ordNoChk - response end');
                logger.info(`=====================================================================`);
            }).catch(function (error){
                retData = utils.getResultData(`400`, '실패', req.originalUrl, { subUrl: subUrl, expired: date.format('YYYY-MM-DD'), error: error.message });
                logger.error(``);
                logger.error(``);
                logger.error(`--------------------------------------------------------------------`);
                logger.error(`order controller ordNoChk Exception : \nsubUrl: ${subUrl} \reqJson: ${reqJson} \napiKey: ${apiKey} \nException : ${error}`);
                logger.error(`--------------------------------------------------------------------`);
                logger.info('order controller ordNoChk - response end');
                logger.info(`=====================================================================`);
            });
    }catch(e) {
        logger.error('\n\norder controller ordNoChk - error : ', e);
    }
    res.status(utils.getHttpStatusByCode(retData.status)).json(retData);
};

/**
 * 
 * RPA 오더 등록
 * 링크 API To 24시콜 API 호출
 * 
 * @param url_call              //
 * @param req_json              //
 * @param api_key               //
 * @param procId                // 
 * @param orderId               // 오더 ID(로그 파일에서 검색하기 위함)
 * 
 * 
 * @apiSuccessExample {json} 성공:
 * 
 * 
 * @apiUse errorCommon
 * @apiUse ErrorSample
 * @apiErrorExample {json} Error_ooo
 * 
 * {
 *   "status": "400",
 *   "message": "실패",
 *   "path": "/api/call24/regAlloc",
 *   "data": {
 *       "mIp": "192.168.53.51",
 *       "expired": "2024-01-23",
 *       "code": "0002",
 *       "data": "f2jyQgmQX0pnDsNjId/FTl+Y4G3EUuzf2v2gh3/WCIKvGcyrDcVVBxTtzGik4rv0WqzoXea3Ue/FcggJRScDWqdWCxjG+oSEzCCv8Bq6aEBmWIdfzK51CpMG2qp7FUopR+brz0OZwzyUJ4N1bzeW4vGCRxHxwITYVoGqpei8smAn13Qm4IYp6W7aC9ubA5Ou"
 *   }
 * }
 * 
 */
const call24ApiPost = async (req: Request, res: Response) => {

    try{
        const body = req.body;
        const url24call = body.url_call;
        const requestjson = body.req_json;
        const procId = body.procId;
        const orderId = body.orderId;
        const jsonData = JSON.stringify(requestjson);
        const api24key = body.api_key;

        logger.info(``);
        logger.info(``);
        logger.info(``);
        logger.info(`=====================================================================`);
        logger.info(`order controller call24ApiPost - ${procId} start `);

        try{
            const http = require('https');
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'call24-api-key': api24key,
                    'Cache-Control': 'no-cache'
                }
            }
            const mReq = await http.request(defaultUrl+url24call,options,function (apiRes:any) {
                console.log('Status: ' + apiRes.statusCode);
                console.log('Headers: ' + JSON.stringify(apiRes.headers));
                logger.info(`Request Data ->  \n procId : ${procId} \n url : ${url24call} \n request_json: ${jsonData} \n api24key: ${api24key}`);
                apiRes.setEncoding('utf8');
                var resData = '';
                apiRes.on('data', function (body:any) {
                    console.log('Body: ' + body);
                    resData += body;
                });
                apiRes.on('end',function() {
                    console.log('Status: ' + apiRes.statusCode + "//" + apiRes.statusCode.type);
                    console.log(`response data : ${resData}`);
                    if(apiRes.statusCode != "200") {
                        logger.error(`Respose Data Error: \n procId: ${procId} \n orderId: ${orderId} \n ResponseData: ${resData}`)
                        //logger.error(`Respose Data Error: \n procId: ${procId} \n ResponseData: ${resData}`)
                    }else{
                        logger.info(`Respose Data : \n procId: ${procId} \n orderId: ${orderId} \n ResponseData: ${resData}`);
                        //logger.info(`Respose Data : \n procId: ${procId} \n ResponseData: ${resData}`);
                    }
                    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
                    res.write(resData);
                    res.end();
                    logger.info('order controller call24ApiPost - response end');
                    logger.info(`=====================================================================`);
                });
            });
            //await mReq.end(requestjson); // 운영서버 사용 시
            await mReq.end(requestjson); // 포스트맨 사용 시
            logger.info(`order controller call24ApiPost - ${procId} end`);
        }catch(e) {
            logger.error(`\n\norder controller call24ApiPost URL_Error : \n procId: ${procId} \n orderId: ${orderId} \n Exception : ${e}`);
            //logger.error(`\n\norder controller call24ApiPost URL_Error : \n procId: ${procId} \n Exception : ${e}`);
        }
    }catch(e) {
        logger.error('\n\norder controller call24ApiPost error : ', e);
    }
}

/**
 * 
 * 배차 완료 API
 * 24시콜 To 링크 API 호출
 * 
 * @param code 
 * @param data 
 * 
 * 
 * @apiSuccessExample {json} 성공:
 * 
 * 
 * @apiUse errorCommon
 * @apiUse ErrorSample
 * @apiErrorExample {json} Error_ooo
 * 
 * {
 *   "status": "400",
 *   "message": "실패",
 *   "path": "/api/call24/regAlloc",
 *   "data": {
 *       "mIp": "192.168.53.51",
 *       "expired": "2024-01-23",
 *       "code": "0002",
 *       "data": "f2jyQgmQX0pnDsNjId/FTl+Y4G3EUuzf2v2gh3/WCIKvGcyrDcVVBxTtzGik4rv0WqzoXea3Ue/FcggJRScDWqdWCxjG+oSEzCCv8Bq6aEBmWIdfzK51CpMG2qp7FUopR+brz0OZwzyUJ4N1bzeW4vGCRxHxwITYVoGqpei8smAn13Qm4IYp6W7aC9ubA5Ou"
 *   }
 * }
 * 
 */
const regAlloc = async (req: Request, res: Response) => {

    let retData = utils.getResultData('2007', null, req.originalUrl);
    const date = momentTimezone().tz('Asia/Seoul');
    try{

        //const code = req.query.code;
        //const data = req.query.data;
        const code = req.param('code');
        const data = req.param('data');
        
        if(code != "0101"){

            logger.info(``);
            logger.info(``);
            logger.info(``);
            logger.info(``);
            logger.info(`=====================================================================`);
            logger.info(`order controller regAlloc - start `);
            var ip = "";
            
            /*var localIpV4Address = require('local-ipv4-address');
            await localIpV4Address().then(function(ipAddress: string) {
                console.log(`My Ip Address => ${ipAddress}`);
                ip = ipAddress;
            });*/
    
            const response = await axios.get('https://api64.ipify.org?format=json');
            ip = response.data.ip;
            console.log('Public IP:', ip);

            //API 배차확정 
            await axios({
                url:'https://app.logis-link.co.kr/api/alloc/alloc24CallAlloc', 
                method: 'post',
                data: {
                    mIp: ip,
                    code: code,
                    data: data,
                },
            }).then(async function (response){
                if(response.status != 200) {
                    retData = utils.getResultData(`${response.status}`, '실패', req.originalUrl, { mIp: ip, expired: date.format('YYYY-MM-DD'), code: code, data: data });
                    logger.error(`Error Respose Data : \nmIp: ${ip} \nstatus: ${response.status} \ncode: ${code} \ndata: ${data}`);
                }else{
                    retData = utils.getResultData(`${response.status}`, '정상', req.originalUrl, { mIp: ip, expired: date.format('YYYY-MM-DD'), code: code, data: data });
                    logger.info(`Respose Data : \nmIp: ${ip} \nstatus: ${response.status} \ncode: ${code} \ndata: ${data}`);
                }
                logger.info('order controller regAlloc - response end');
                logger.info(`=====================================================================`);
            }).catch(function (error){
                retData = utils.getResultData(`400`, '실패', req.originalUrl, { mIp: ip, expired: date.format('YYYY-MM-DD'), code: code, data: data });
                logger.error(``);
                logger.error(``);
                logger.error(`--------------------------------------------------------------------`);
                logger.error(`order controller regAlloc Exception : \nmIp: ${ip} \ncode: ${code} \ndata: ${data} \nException : ${error}`);
                logger.error(`--------------------------------------------------------------------`);
                logger.info('order controller regAlloc - response end');
                logger.info(`=====================================================================`);
            });
        }
    }catch(e) {
        logger.error('\n\norder controller regAlloc - error : ', e);
    }
    res.status(utils.getHttpStatusByCode(retData.status)).json(retData);
};

/**
 * 
 * 화물등록내역(건별) API
 * 링크 To 24시콜 API 호출
 * 
 * @param data 
 * 
 * 
 * @apiSuccessExample {json} 성공:
 * 
 * 
 * @apiUse errorCommon
 * @apiUse ErrorSample
 * @apiErrorExample {json} Error_ooo
 * 
 * {
 *   "status": "400",
 *   "message": "실패",
 *   "path": "/api/order/getOrder",
 *   "data": {
 *       "mIp": "192.168.53.51",
 *       "expired": "2024-01-23",
 *       "code": "0002",
 *       "data": "f2jyQgmQX0pnDsNjId/FTl+Y4G3EUuzf2v2gh3/WCIKvGcyrDcVVBxTtzGik4rv0WqzoXea3Ue/FcggJRScDWqdWCxjG+oSEzCCv8Bq6aEBmWIdfzK51CpMG2qp7FUopR+brz0OZwzyUJ4N1bzeW4vGCRxHxwITYVoGqpei8smAn13Qm4IYp6W7aC9ubA5Ou"
 *   }
 * }
 * 
 */
/*const call24GetOrder = async (req: Request, res: Response) => {

    let retData = utils.getResultData('2007', null, req.originalUrl);
    const date = momentTimezone().tz('Asia/Seoul');
    const body = req.body;
    const requestjson = body.data;
    logger.info("11111 => " + body.data);
    const jsonData = JSON.stringify(requestjson);
    logger.info("22222 => " + jsonData);
    const api24key = body.api_key;

    try{

        await axios({
            url :defaultUrl+'/api/order/getOrder',
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'call24-api-key': api24key,
                'Cache-Control': 'no-cache'
            },
            data: {
                jsonData,
            },
        }).then(async function (response){
            logger.info(`Respose Data123123123 : ${JSON.stringify(response.data)}`);
            if(response.status != 200) {
                retData = utils.getResultData(`${response.status}`, '실패', req.originalUrl, {expired: date.format('YYYY-MM-DD'), data: jsonData });
        
            }else{
                retData = utils.getResultData(`${response.status}`, '정상', req.originalUrl, { expired: date.format('YYYY-MM-DD'), data: jsonData });
                logger.info(`Respose Data :\nstatus: ${response.status} \ndata: ${jsonData}`);
            }
            logger.info('order controller regAlloc - response end');
            logger.info(`=====================================================================`);
        }).catch(function (error){
            retData = utils.getResultData(`400`, '실패', req.originalUrl, {expired: date.format('YYYY-MM-DD'), data: jsonData });
            logger.error(``);
            logger.error(``);
            logger.error(`--------------------------------------------------------------------`);
            logger.error(`order controller regAlloc Exception :\ndata: ${requestjson} \nException : ${error}`);
            logger.error(`--------------------------------------------------------------------`);
            logger.info('order controller regAlloc - response end');
            logger.info(`=====================================================================`);
        });
    
    }catch(e) {
        logger.error(`\n\norder controller call24GetOrder URL_Error : Exception : ${e}`);
        //logger.error(`\n\norder controller call24ApiPost URL_Error : \n procId: ${procId} \n Exception : ${e}`);
    }
    res.status(utils.getHttpStatusByCode(retData.status)).json(retData);
};*/

router.post('/call24',call24ApiPost);
router.post('/call24/regAlloc', regAlloc);
router.post('/call24/ordNoChk',ordNoChk);

//router.post('/order/getOrder', call24GetOrder);
//router.post('/call24/regAlloc', regAlloc);

const orderController = {
    router,
    call24ApiPost,
    regAlloc,
    ordNoChk
};

export default orderController;