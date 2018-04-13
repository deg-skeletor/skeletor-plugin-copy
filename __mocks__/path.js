'use strict';

const path = jest.genMockFromModule('path');

const sep = '/';

const resolve = (dir, filepath) => filepath;

const join = (...args) => args.join(sep);

path.resolve = resolve;
path.sep = sep;
path.join = join;

module.exports = path;