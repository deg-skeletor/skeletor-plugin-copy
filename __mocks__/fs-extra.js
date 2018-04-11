'use strict';

const fsExtra = jest.genMockFromModule('fs-extra');

let mockSrc = Object.create(null);
const mockDest = Object.create(null);

function _setMockSrc(newmockSrc) {
    mockSrc = {...newmockSrc};
}


const copy = (srcPath, destPath) => {
    mockDest[destPath] = mockSrc[srcPath];
    return Promise.resolve(true);
};

fsExtra._setMockSrc = _setMockSrc;
fsExtra.copy = copy;
fsExtra.mockSrc = mockSrc;
fsExtra.mockDest = mockDest;
module.exports = fsExtra;