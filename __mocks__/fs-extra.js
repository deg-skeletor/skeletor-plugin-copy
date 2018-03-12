'use strict';

const fsExtra = jest.genMockFromModule('fs-extra');

let mockSrc = Object.create(null);
const mockDest = Object.create(null);

function _setMockSrc(newmockSrc) {
    mockSrc = {...newmockSrc};
}

const stat = (dest) => {
    return Promise.resolve({
        isDirectory: mockSrc[dest]
    });
};

const mkdir = dest => {
    mockDest[dest] = [];
    Promise.resolve();
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
fsExtra.stat = stat;
fsExtra.mkdir = mkdir;
fsExtra.readdir = readdir;
fsExtra.copyFile = copyFile;

module.exports = fsExtra;