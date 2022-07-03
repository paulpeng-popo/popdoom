/* express.js */
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import expressValidation from 'express-validation';
import httpStatus from 'http-status';
import morgan from 'morgan';
import AppError from '../server/helper/AppError';
import index from '../server/routes/index.route';
import config from './config';

const app = express();

app.use(cors());
app.use(morgan('dev'));

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* GET home page. */
app.get('/', (req, res) => {
    res.send(`server started on  port http://127.0.0.1:${config.port} (${config.env})`);
});

app.use('/api', index);

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
    let errorMessage;
    let errorCode;
    let errorStatus;
    // express validation error 所有傳入參數驗證錯誤
    if (err instanceof expressValidation.ValidationError) {
        if (err.errors[0].location === 'query' || err.errors[0].location === 'body') {
            errorMessage = err.errors[0].messages;
            errorCode = 400;
            errorStatus = httpStatus.BAD_REQUEST;
        }
        const error = new AppError.APIError(errorMessage, errorStatus, true, errorCode);
        return next(error);
    }
    return next(err);
});

// error handler, send stacktrace only during development 錯誤後最後才跑這邊
app.use((err, req, res, next) => {
    res.status(err.status).json({
        message: err.isPublic ? err.message : httpStatus[err.status],
        code: err.code ? err.code : httpStatus[err.status],
        stack: config.env === 'development' ? err.stack : {}
    });
    next();
});

export default app;
