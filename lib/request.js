'use strict';

const utils = require('./utils');
const extend = require('util')._extend;
const _request = require('request');
const logger = require('./logger');
const userAgent = require('random-useragent');

function request({ url, session }, opts={}) {
    var jar = _request.jar();

    let cookie = _request.cookie(`session=${session}`);
    jar.setCookie(cookie, url);

    var options = extend(opts, {
        url,
        jar,
        headers: extend({
            'User-Agent': userAgent.getRandom(),
        }, opts.headers || {}),
    });

    return new Promise(function(resolve, reject) {
        utils.logRequest(url, options);
        
        _request(options, function(err, response, body) {
            logger.debug('response %s', url, { options, err, response, body });

            if (err) {
                reject({ error: err });
            } else if(! /^2/.test('' + response.statusCode)) {
                reject({ 
                    error: body,
                    response: response 
                });
            } else {
                resolve({
                    response: response,
                    body: body,
                });
            }
        });
    });
}

module.exports.request = request;