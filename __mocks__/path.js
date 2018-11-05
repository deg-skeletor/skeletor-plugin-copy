'use strict';

const path = jest.genMockFromModule('path');

const sep = '/';

const resolve = (dir, filepath) => filepath;

const join = (...args) => args.join(sep);

const extname = srcPath => srcPath.indexOf('.html') >= 0;

const dirname = srcPath => {
    if(srcPath === 'index.html') {
        return '.';
    }

    const pathItems = srcPath.split('/');
    pathItems.pop();
    return pathItems.join('/');
};

path.resolve = resolve;
path.sep = sep;
path.join = join;
path.extname = extname;
path.dirname = dirname;

module.exports = path;