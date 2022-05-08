import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';

import { apiRouter } from './router.js';

export const app = express()
var port = process.env.PORT || '3000';
app.set('port', port);

var server = http.createServer(app);
server.listen(port);
server.on('error', (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }

});
// error handler

app.use(cors())
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', apiRouter);



app.use('*', (req, res) => {
    res.json({ msg: 'route not avialble' })
});