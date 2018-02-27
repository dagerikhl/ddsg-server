const sinon = require('sinon');
const chai = require('chai');

beforeEach(() => {
    this.sandbox = sinon.sandbox.create();
});

afterEach(() => {
    this.sandbox.restore();
});
