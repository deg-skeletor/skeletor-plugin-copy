'use strict';

const path = jest.genMockFromModule('path');

const resolve = (dir, filepath) => {
	return filepath;
};

const sep = () => {
	if (process.platform === 'win32') {
		return '\\';
	}
	return '/';
};

const join = () => arguments.join(sep());

path.resolve = resolve;
path.sep = sep;
path.join = join;

module.exports = path;