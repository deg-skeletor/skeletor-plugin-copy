'use strict';

const fsExtra = jest.genMockFromModule('fs-extra');

let mockSrc = Object.create(null);
const mockDest = Object.create(null);

function _setMockSrc(newmockSrc) {
    mockSrc = {...newmockSrc};
}

const existsSync = (dest) => {
    return mockSrc[dest];
};

const mkdirSync = dest => {
    mockDest[dest] = [];
};

const readdir = directory => {
    return mockSrc[directory] ?
        Promise.resolve(mockSrc[directory]) :
        Promise.reject(`Directory "${directory}" not found`);
};

const copyFile = (srcPath, destPath) => {
    mockDest[destPath] = mockSrc[srcPath];
    return Promise.resolve(true);
};

fsExtra._setMockSrc = _setMockSrc;
fsExtra.existsSync = existsSync;
fsExtra.mkdirSync = mkdirSync;
fsExtra.readdir = readdir;
fsExtra.copyFile = copyFile;

module.exports = fsExtra;