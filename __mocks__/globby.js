'use strict';

let mockSrcPaths = [];
const mockGlobbyRegEx = RegExp(/\W+/g);

/**
 * 
 * @param {Object} newMockSrc an object where keys are basePath and value is a file path
 * The newMockSrc is NOT the source path from the config, it is set in test suite
 * this method adds to mockSrcPaths the list of filePaths that would exist in the source directory
 */
function _setMockSrc(newMockSrc) {
    mockSrcPaths = [];
    const directories = Object.keys(newMockSrc);
    directories.forEach(dir => {
        const files = Array.isArray(newMockSrc[dir]) ? newMockSrc[dir] : [newMockSrc[dir]];
        files.forEach(fileName => mockSrcPaths.push(`${dir}/${fileName}`));
    });
}

const globby = jest.fn(srcDir => {
    if (srcDir) {
        return Promise.resolve(mockSrcPaths);
    }
    return {
        hasMagic,
        _setMockSrc,
        _setHasMagic
    };
});

const hasMagic = src => mockGlobbyRegEx.test(src);

globby.hasMagic = hasMagic;
globby._setMockSrc = _setMockSrc;

module.exports = globby;