//  Copyright © 2018 DIG Development team. All rights reserved.

'use strict';

// Webhook module

const config = require('config');
const crashHandler = require('../crash-handling.js');
const IPAddr = require('ipaddr.js');
const logger = require('../logger.js');
const Restify = require('restify');
const server = require('../server/server.js');
const TAG = 'webhook';

let restify = null;

const HTTP_CODE_OK = 200;
const HTTP_CODE_NO_DATA = 204;
const HTTP_INTERNAL_ERROR = 500;

module.exports = {
    init: function() {
        logger.debug(TAG, 'Starting webhook module');

        restify = Restify.createServer({
            name: 'Discord Bot',
        });

        restify.use(Restify.bodyParser({mapParams: true}));
        restify.use(Restify.queryParser());

        restify.opts(/.*/, function(req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', req.header('Access-Control-Request-Method'));
            res.header('Access-Control-Allow-Headers', req.header('Access-Control-Request-Headers'));
            res.send(HTTP_CODE_OK);

            return next();
        });

        restify.post('/jenkins', function restifyPostJenkins(req, res) {
            // let IP;
            // IP = req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;/
            // const Addr = IPAddr.parse(IP);

            logger.debug(TAG, req.params.message);
            logger.debug(TAG, req.params.channel);

            sendBotMessage(req.params.channel, '[' + req.params.type + ':' + req.params.status + '] ' + req.params.message);

            // logger.debug(TAG, req.body);

            // if (!Addr.match(IPAddr.parseCIDR('192.168.0.0/24')) === true) {
            // /    console.log('Ip is invalid?');
            //    return res.send(503, { 'error': 'invalid ip' });/
            // }
            // return next(new Error('Request originated from an invalid IP CIDR range.'));
            return res.send(HTTP_CODE_NO_DATA);
        });

        restify.post('/echo', function restifyPostEcho(req, res) {
            crashHandler.logEvent(TAG, 'echo');
            sendBotMessage(req.params.channel, req.params.message);
            res.send(HTTP_CODE_OK);
        });

        restify.get('/', function getIndex(req, res) {
            res.send('DIG rest bot');
        });

        restify.on('uncaughtException', function(req, res, route, err) {
            let message = '**Restify error!**' +
            '\nError Message: ' + err.message +
            '\nPath: ' + route.spec.path +
            '\nMethod: ' + route.spec.method +
            '\nStack:' +
            '\n' + err.stack;

            logger.warning(TAG, message);
            return res.send(HTTP_INTERNAL_ERROR, {'error': err.message});
        });

        restify.listen(config.get('general.port'), '0.0.0.0', function restifyListen() {
            logger.info(TAG, 'Server now listening on :' + config.get('general.port'));
        });
    },
};

function sendBotMessage(ch, msg) {
    let channel = server.getChannelInGuild(ch, config.get('general.server'));
    if (!channel) { return; }
    server.getChannelInGuild(ch, config.get('general.server')).sendMessage(msg)
        .then(
            logger.debug(TAG, 'Successfuly sent message')
        )
        .catch(err => {
            logger.debug(TAG, 'Failed to send message error: ' + err);
        });
}
