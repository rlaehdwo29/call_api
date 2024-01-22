import { logger } from '../../modules/logger';
import { Request, Response } from 'express';
import { Router } from 'express';

const router = Router();

const call24ApiPost = async (req: Request, res: Response) => {

    try{
        const defaultUrl = "https://api.15887924.com:18091/";
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
                    }else{
                        logger.info(`Respose Data : \n procId: ${procId} \n orderId: ${orderId} \n ResponseData: ${resData}`);
                    }
                    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
                    res.write(resData);
                    res.end();
                    logger.info('order controller call24ApiPost - response end');
                    logger.info(`=====================================================================`);
                });
            });
            await mReq.end(jsonData);
            logger.info(`order controller call24ApiPost - ${procId} end`);
        }catch(e) {
            logger.error(`\n\norder controller call24ApiPost URL_Error : \n procId: ${procId} \n orderId: ${orderId} \n Exception : ${e}`);
        }
    }catch(e) {
        logger.error('\n\norder controller call24ApiPost error : ', e);
    }
}

router.post('/call24',call24ApiPost);

const orderController = {
    router,
    call24ApiPost
};

export default orderController;