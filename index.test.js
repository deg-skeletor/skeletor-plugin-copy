const skeletorStaticFileCopier = require('./index');

const srcFilepath1 = 'src/skeletor';
const destFilepath1 = 'dest/skeletor';
const content1 = ['content1.txt', 'content2.txt'];

const srcFilepath2 = 'src/skeletor2';
const destFilepath2 = 'dest/skeletor2';
const content2 = ['content1.txt'];

const errorResponse = {
    status: 'error',
    error: 'Config directories is not found or not an array.'
};
const logger = {
    info: () => {},
    error: () => {}
};
const options = {
    logger
};
let fseInstance;
let globby;

jest.mock('globby');
jest.mock('path');

beforeEach(() => {
    fseInstance = require('fs-extra');
    fseInstance._setMockSrc({
        [srcFilepath1]: content1,
        [srcFilepath2]: content2
    });

    globby = require('globby');
    globby._setMockSrc({
        [srcFilepath1]: content1,
        [srcFilepath2]: content2
    });
});

afterEach(() => fseInstance._resetMockDest());

test('run() returns a complete status object', async () => {
    const config = {
        directories: [
            {
                src: srcFilepath1,
                dest: destFilepath2
            }
        ]
    };

    const expectedResponse = {
        status: 'complete',
        message: '1 directory processed'
    };

    expect.assertions(1);
    const response = await skeletorStaticFileCopier().run(config, options);
    expect(response).toEqual(expectedResponse);
});

describe('handles troublesome configurations', () => {
    test('run() handles malformed config object', async () => {
        const config = {};

        const response = await skeletorStaticFileCopier().run(config, options);
        expect(response).toEqual(errorResponse);
    });

    describe('throws error if directories is', () => {

        test('empty obj', async () => {
            const config = {
                directories: {}
            };
            const response = await skeletorStaticFileCopier().run(config, options);
            expect(response).toEqual(errorResponse);
        });

        test('a string', async () => {
            const config = {
                directories: 'test'
            };
            const response = await skeletorStaticFileCopier().run(config, options);
            expect(response).toEqual(errorResponse);
        });

        test('a number', async () => {
            const config = {
                directories: 4
            };
            const response = await skeletorStaticFileCopier().run(config, options);
            expect(response).toEqual(errorResponse);
        });

        test('a boolean', async () => {
            const config = {
                directories: false
            };
            const response = await skeletorStaticFileCopier().run(config, options);
            expect(response).toEqual(errorResponse);
        });
    });

    test('errors if src is not a directory', async () => {
        const fakeDirectory = 'test/skeletor';
        const config = {
            directories: [
                {
                    src: fakeDirectory,
                    dest: 'dest/skeletor'
                }
            ]
        };

        const expectedResponse = {
            status: 'error',
            error: `Directory "${fakeDirectory}" not found`
        };

        // expect.assertions(1);
        try {
            await skeletorStaticFileCopier().run(config, options);
        } catch (e) {
            expect(response).toEqual(expectedResponse);
        }

    });

});

describe('copies directories', () => {

    test('copies entire directories', async () => {
        const config = {
            directories: [
                {
                    src: srcFilepath1,
                    dest: destFilepath1
                }
            ]
        };

        const expectedResponse = {
            status: 'complete',
            message: `${config.directories.length} ${config.directories.length === 1 ? 'directory' : 'directories'} processed`
        };

        const file1 = `${destFilepath1}/content1.txt`;
        const file2 = `${destFilepath1}/content2.txt`;

        const response = await skeletorStaticFileCopier().run(config, options);
        expect(response).toEqual(expectedResponse);
        expect(fseInstance.mockDest).toContain(file1);
        expect(fseInstance.mockDest).toContain(file2);

    });

    test('copies multiple directories', async () => {
        const config = {
            directories: [
                {
                    src: srcFilepath1,
                    dest: destFilepath1
                },
                {
                    src: srcFilepath2,
                    dest: destFilepath2
                }
            ]
        };

        const expectedResponse = {
            status: 'complete',
            message: `${config.directories.length} ${config.directories.length === 1 ? 'directory' : 'directories'} processed`
        };

        const file1 = `${destFilepath1}/content1.txt`;
        const file2 = `${destFilepath1}/content2.txt`;
        const file3 = `${destFilepath2}/content1.txt`;

        const response = await skeletorStaticFileCopier().run(config, options);
        expect(response).toEqual(expectedResponse);
        expect(fseInstance.mockDest).toContain(file1);
        expect(fseInstance.mockDest).toContain(file2);
        expect(fseInstance.mockDest).toContain(file3);
    });

    describe('globbing syntax', () => {
        const baseDir = 'src/skeletor';
        const expectedResponse = {
            status: 'complete',
            message: '1 directory processed'
        };

        beforeEach(() => {
            fseInstance._setMockSrc({
                [baseDir]: 'sample/content.txt'
            });

            globby._setMockSrc({
                [baseDir]: 'sample/content.txt'
            });
        });

        test('at beginning of src path', async () => {
            const globbingSrc = '!(dest)/**';
            const expectedPath = 'dest/skeletor/src/skeletor/sample/content.txt';
            const config = {
                directories: [
                    {
                        src: globbingSrc,
                        dest: 'dest/skeletor'
                    }
                ]
            };

            const response = await skeletorStaticFileCopier().run(config, options);
            expect(response).toEqual(expectedResponse);
            expect(fseInstance.mockDest).toContain(expectedPath);
        });

        test('in middle of src path', async () => {
            const globbingSrc = 'src/skeletor/!(testDir)/sample/**';
            const expectedPath = 'dest/skeletor/sample/content.txt';
            const config = {
                directories: [
                    {
                        src: globbingSrc,
                        dest: 'dest/skeletor'
                    }
                ]
            };

            const response = await skeletorStaticFileCopier().run(config, options);
            expect(response).toEqual(expectedResponse);
            expect(fseInstance.mockDest).toContain(expectedPath);
        });

        test('at end of src path', async () => {
            const globbingSrc = 'src/skeletor/!(testDir)/**';
            const expectedPath = 'dest/skeletor/sample/content.txt';
            const config = {
                directories: [
                    {
                        src: globbingSrc,
                        dest: 'dest/skeletor'
                    }
                ]
            };

            const response = await skeletorStaticFileCopier().run(config, options);
            expect(response).toEqual(expectedResponse);
            expect(fseInstance.mockDest).toContain(expectedPath);
        });
    });

});