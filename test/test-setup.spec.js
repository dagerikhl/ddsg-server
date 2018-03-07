const sinon = require('sinon');

beforeEach(function () {
    this.sandbox = sinon.sandbox.create();

    this.sandbox.logger = {
        error: sinon.stub(logger, 'error'),
        warn: sinon.stub(logger, 'warn'),
        info: sinon.stub(logger, 'info'),
        verbose: sinon.stub(logger, 'verbose'),
        debug: sinon.stub(logger, 'debug'),
        silly: sinon.stub(logger, 'silly')
    };

});

afterEach(function () {
    this.sandbox.restore();

    logger.error.restore();
    logger.warn.restore();
    logger.info.restore();
    logger.verbose.restore();
    logger.debug.restore();
    logger.silly.restore();
});
