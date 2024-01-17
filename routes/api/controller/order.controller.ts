import { logger } from '../../modules/logger';
import utils from '../../modules/utils';

import { Request, Response } from 'express';
import { Router } from 'express';
import momentTimezone from 'moment-timezone';
import DB from '../../../db/models';
import { Json } from 'sequelize/types/utils';

const router = Router();

const call24ApiPost = async (req: Request, res: Response) => {
    logger.info('order controller call24ApiPost - start ');

    try{
        const defaultUrl = "https://api.15887924.com:18091/";
        const body = req.body;
        const url24call = body.url_call;
        const requestjson = body.req_json;
        //const jsonData = JSON.stringify(requestjson);
        const api24key = body.api_key;

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
                apiRes.setEncoding('utf8');
                var resData = '';
                apiRes.on('data', function (body:any) {
                    console.log('Body: ' + body);
                    resData += body;
                });
                apiRes.on('end',function() {
                    console.log(`response data : ${resData}`);
                    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
                    res.write(resData);
                    res.end();
                });
            });
            await mReq.end(requestjson);
        }catch(e) {
            logger.error('order controller call24ApiPost URL_Error : ', e);
        }
    }catch(e) {
        logger.error('order controller call24ApiPost error : ', e);
    }
}

router.post('/call24',call24ApiPost);

const orderController = {
    router,
    call24ApiPost
};

export default orderController;