const sinon = require('sinon');

require('../logger');

beforeEach(function () {
    this.sandbox = sinon.sandbox.create();

    this.sandbox.spy(logger, 'error');
    this.sandbox.spy(logger, 'warn');
    this.sandbox.spy(logger, 'info');
    this.sandbox.spy(logger, 'verbose');
    this.sandbox.spy(logger, 'debug');
    this.sandbox.spy(logger, 'silly');
});

afterEach(function () {
    this.sandbox.restore();
});
