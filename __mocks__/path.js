'use strict';

const path = jest.genMockFromModule('path');

const sep = process.platform === 'win32' ? '\\' : '/';

const resolve = (dir, filepath) => filepath;

const join = (...args) => args.join(sep);

path.resolve = resolve;
path.sep = sep;
path.join = join;

module.exports = path;