//import properties from './config/properties';

import createError, { HttpError } from 'http-errors';
import express,{ Request, Response } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import syslog from 'morgan';
import { logger, stream } from './routes/modules/logger';
import properties from './config/properties';
import apiRouter from './routes/api/api_route';
import helmet from 'helmet';
import hidePoweredBy from 'hide-powered-by';
import cors from 'cors';

const corsOption = { credentials: true };

var app = express();

app.use(helmet.hsts());
app.disable('x-powered-by');
app.use(hidePoweredBy());
app.use(helmet());

app.enable('etag');
app.set('etag', 'strong');

app.use(cors(corsOption));
app.use(syslog('combined', { stream: stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(`/`, apiRouter);

logger.info("하아앙 =>" + properties.defaultUrl);

// catch 404 and forward to error handler
app.use((_req: Request, _res: Response, next: express.NextFunction) => {
  logger.info("뭐가 문젠데 =>" + _req.originalUrl + "//" + _req.baseUrl + "//" + _req.url)
  next(createError(404));
});

// error handler
app.use((err: HttpError, req: Request, res: Response) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
