'use strict';

const chalk = require('chalk');
const request = require('./request').request;
const open = require('open');
const cheerio = require('cheerio');
const logger = require('./logger');
const utils = require('./utils');
const notifier = require('node-notifier');

function parseHTML(result) {
    var $ = cheerio.load(result.body);

    var form = $('#listing-reserve-form');
    var _endpoint = form.data('endpoint');
    var csrf = $('meta[name="csrf_token"]')[0].attribs.content;

    let availableTickets = 0;
    form.find('select[name="amount"] option').each(function() {
        let value = $(this).attr('value');
        value = parseInt(value, 10);

        if (isNaN(value)) {
            throw new TypeError('Expected option.value to be of type number');
        }

        if (value > availableTickets) {
            availableTickets = value;
        }
    });

    return {
        form,
        _endpoint,
        availableTickets,
        csrf,
    };
}

function process({ form, csrf, availableTickets, _endpoint }, link, options) {
    if (! _endpoint) {
        logger.warn(chalk.yellow('Ticket already sold :(!'));
        return Promise.resolve({ alreadySold: true });
    }

    var endpoint = options.baseUrl + _endpoint;
    var token = form.find('input[name="token"]').attr('value');
    var reserveToken = form.find('input[name="reserve[_token]"]').attr('value');

    var toReserve = Math.min(options.amount, availableTickets);

    logger.info([
            ``,
            `${chalk.green('Reserving ticket')}:`,
            ` ${chalk.magenta('token')}           : ${token}`,
            ` ${chalk.magenta('reserve[_token]')} : ${reserveToken}`,
            ` ${chalk.magenta('csrf_token')}      : ${csrf}`,
            ` ${chalk.magenta('amount')}          : ${toReserve}`,
            ``,
        ].join('\n'));

    return request({ url: endpoint, session: options.sessionID }, {
        method: 'POST',
        authenticated: true,
        headers: {
            'x-csrf-token': csrf,
        },
        form: {
            'reserve[_token]': reserveToken,
            token,
            amount: 1,
        }
    })
    .catch(err => {
        utils.logErrors(err)
        throw err;
    });
}

function runFound(link, options) {
    // STEP 1 submit form
    // STEP 2 request /cart

    return request({ url: link, session: options.sessionID }, { authenticated: true })
        .then(parseHTML)
        .then(result => process(result, link, options))
        .then((result) => {
            if (result.alreadySold) {
                return result;
            }

            notifier.notify({
                title: 'TicketScoop!',
                message: 'Found a ticket, now opening your cart!',
                sound: true,
            });

            open('https://www.ticketswap.nl/cart');

            return {
                alreadySold: false,
            };
        });
}

module.exports = {
    parseHTML,
    process,
    runFound,
};
