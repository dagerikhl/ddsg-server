# Data-driven Security Game (DdSG) Server

## Introduction

**Working title: _"STIX and Stones"_**

Master Thesis of spring 2018, attending study programme of Computer Science at NTNU.

Server repository.

## Getting Started

1. Install Node and NPM _([Node.js](https://nodejs.org/en/))_.
2. Run `npm install` to install dependencies.

## Use

**Note!** Requires some enviroment variables to be set. See section [Configuration](#configuration).

### Production

1. Run `npm start`.

### Development

1. Run `npm run dev` to start Nodemon to restart server on file-changes.

## Test

### Run tests

1. Run `npm test` or `npm run test` to run all tests.
    - Run `npm run test-unit` to only run the unit tests.

### Watch / Continuously run tests

1. Run `npm run test:w` to watch all test, running them again on file-changes.
    - Run `npm run test-unit:w` to only watch the unit tests.

### Run test coverage

1. Run `npm run coverage` to check test coverage for the entire application.
    - This logs the result to the console. It also generates a HTML coverage report in the folder `coverage` which you can view in your web browser.
    - **Note!** This also performs a normal run of the tests before generating coverage report.

## Technologies

- The server is written in Node using JavaScript (ES5).
- The server is built as an [express](https://www.npmjs.com/package/express) server application.

### Configuration

- The server uses [cross-env](https://www.npmjs.com/package/cross-env) to easily set environment variables for all platforms (Windows, Linux, ++).
- The server uses [dotenv](https://www.npmjs.com/package/dotenv) for configuration.
    - All environment variables are accessed through `process.env.<variable>`.
    - **Note!** For local development, a local configuration-file, `.env`, with all environment variables is required.
        - **Note!** This file should _not_ be commited and used in production. The production server should have different values from local development.
        - **Note!** If environment variables are set through other means, such as npm scripts or server configuration, these are used over the configuration-file.
- Layout of configuration-file:
    ```dotenv
    NODE_ENV=<one of: { production, development, test }>
    
    HOST=<url>
    PORT=<number>
    
    LOCAL_JSON_STORE=<one of: { true, false }>
    LOCAL_JSON_USE=<one of: { true, false }>
    ```

### Logging

- The server usese [winston](https://www.npmjs.com/package/winston) for logging.
    - The logger logs to both console and the local log-files `combined.log` and `error.log`.
    - **Note!** This means you use `logger.debug(<...>)` instead of `console.log(<...>)` to log.
    - **Note!** Currently using `winston@3.0.0-rc1` for additional new features, but this is not a stable version.

### Testing

- The server uses [mocha](https://www.npmjs.com/package/mocha), [sinon](https://www.npmjs.com/package/sinon), and [chai](https://www.npmjs.com/package/chai) to perform unit tests.
- The server usese [nyc](https://www.npmjs.com/package/nyc) to perform coverage tests and generate coverage reports.

### HTTP requests

- The server uses [axios](https://www.npmjs.com/package/axios) for HTTP requests.

### Production specific dependecies
- In production, the server uses [node-schedule](https://www.npmjs.com/package/node-schedule) to schedule and perform an update of data from data sources at 00:30 every night.
