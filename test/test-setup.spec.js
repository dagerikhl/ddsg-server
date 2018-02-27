const sinon = require('sinon');

const fileHandler = require('../app/services/file-handler');

require('../logger');

beforeEach(function () {
    this.sandbox = sinon.sandbox.create();

    this.sandbox.spy(logger, 'error');
    this.sandbox.spy(logger, 'warn');
    this.sandbox.spy(logger, 'info');
    this.sandbox.spy(logger, 'verbose');
    this.sandbox.spy(logger, 'debug');
    this.sandbox.spy(logger, 'silly');

    this.sandbox.stub(fileHandler, 'getFileContent').returns('{}');
    this.sandbox.stub(fileHandler, 'setFileContent');
});

afterEach(function () {
    this.sandbox.restore();
});
