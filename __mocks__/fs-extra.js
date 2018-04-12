'use strict';

const fsExtra = jest.genMockFromModule('fs-extra');

let mockSrc = [];
let mockDest = [];

/**
 * 
 * @param {Object} newMockSrc an object where keys are basePath and value is a file path
 * The newMockSrc is NOT the source path from the config, it is set in test suite
 * this method adds to mockSrc the list of filePaths that would exist in the source directory
 */
function _setMockSrc(newMockSrc) {
    mockSrc = [];
    const directories = Object.keys(newMockSrc);
    directories.forEach(dir => {
        const files = Array.isArray(newMockSrc[dir]) ? newMockSrc[dir] : [newMockSrc[dir]];
        files.forEach(fileName => mockSrc.push(`${dir}/${fileName}`));
    });
}

function _resetMockDest() {
    mockDest = [];
    fsExtra.mockDest = mockDest;
}

const copy = (srcPath, destPath) => {
    mockDest.push(destPath);
    return Promise.resolve(true);
};

fsExtra._setMockSrc = _setMockSrc;
fsExtra._resetMockDest = _resetMockDest;
fsExtra.copy = copy;
fsExtra.mockDest = mockDest;
module.exports = fsExtra;