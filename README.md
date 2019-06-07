# 🎫 TicketScoop
**TicketSwap.com auto buyer bot**

### DEPRECATED:

Ticketscoop is deprecated and will not be maintained by me in the future. The code will remain available for reference purposes or for future work by other people.

### DISCLAIMER

Using the script will currently get you banned from Ticketswap (obviously it is against their terms of service). You can still use the code in the script but you will have to alter the requests to circumvent detection by Ticketswap (I suspect requests from the script are either detected by the timeout used or by some header value in the HTTP request).

[![Build Status](https://travis-ci.org/matthisk/TicketScoop.svg?branch=master)](https://travis-ci.org/matthisk/TicketScoop)

This command line tool is used to automatically reserve ticketswap.com tickets

## Install

```bash
npm install ticketscoop -g
```

## Requirements

To run the script you should be using NodeJS version 6 or higher.

## Usage

Before you can use the command you need to sign in to TicketSwap using your browser.
Navigate to the ticketswap website and sign in. Once signed in you need to inspect your cookies 
and retrieve the `session` value this should be supplied to the `--session` command line argument.

After you have retrieved your session id you can run the command as follows:

```bash
$ ticketscoop start https://ticketswap.com/path/to/event --session <your_session_id>
```

The following options are available:

```
Commands:
  start

Options:
  --session, -s  Session ID retrieved from your ticketswap.nl cookie  [required]
  --amount, -n   The amount of tickets to reserve                   [default: 1]
  --help         Show help                                             [boolean]
```
