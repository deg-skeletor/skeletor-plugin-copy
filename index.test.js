const skeletorStaticFileCopier = require('./index');

const srcFilepath1 = 'src/skeletor';
const destFilepath1 = 'dest/skeletor';
const content1 = ['content1.txt', 'content2.txt'];

const srcFilepath2 = 'src/skeletor2';
const destFilepath2 = 'dest/skeletor2';
const content2 = ['content1.txt'];

jest.mock('path');

beforeEach(() => {
    require('fs-extra')._setMockSrc({
        [srcFilepath1]: content1,
        [srcFilepath2]: content2
    });
});

test('run() returns a complete status object', () => {
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
    return skeletorStaticFileCopier().run(config)
        .then(response => {
            expect(response).toEqual(expectedResponse);
        });
});

describe('handles troublesome configurations', () => {
    test('run() handles malformed config object', () => {
        const config = {};

        const expectedResponse = {
            status: 'error',
            error: 'Config directories is not found or not an array.'
        };

        const response = skeletorStaticFileCopier().run(config);
        expect(response).toEqual(expectedResponse);
    });

    test('throws error if directories is not an array', () => {
        const expectedResponse = {
            status: 'error',
            error: 'Config directories is not found or not an array.'
        };

        let config = {
            directories: {}
        };
        let response = skeletorStaticFileCopier().run(config);
        expect(response).toEqual(expectedResponse);

        config = {directories: 'test'};
        response = skeletorStaticFileCopier().run(config);
        expect(response).toEqual(expectedResponse);

        config = {directories: 4};
        response = skeletorStaticFileCopier().run(config);
        expect(response).toEqual(expectedResponse);

        config = {directories: true};
        response = skeletorStaticFileCopier().run(config);
        expect(response).toEqual(expectedResponse);
    });

    test('errors if src is not a directory', () => {
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
        skeletorStaticFileCopier().run(config).then(response => {
            expect(response).toEqual(expectedResponse);
        });

    });

    test('handles dest not existing with creation', () => {
        const fakeDirectory = 'test/skeletor';
        const config = {
            directories: [
                {
                    src: srcFilepath1,
                    dest: fakeDirectory
                }
            ]
        };

        const expectedResponse = {
            status: 'complete',
            message: `${config.directories.length} ${config.directories.length === 1 ? 'directory' : 'directories'} processed`
        };

        const expectedDir = content1;

        // expect.assertions(1);
        skeletorStaticFileCopier().run(config).then(response => {
            expect(response).toEqual(expectedResponse);
            const destinationDir = require('fs-extra').mockDest[fakeDirectory];
            expect(destinationDir).toEqual(expectedDir);
        });
    });
});

describe('copies directories', () => {
    test('copies entire directories', () => {
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

        const expectedDir = content2;

        // expect.assertions(1);
        skeletorStaticFileCopier().run(config).then(response => {
            expect(response).toEqual(expectedResponse);
            const destinationDir = require('fs-extra').mockDest[destFilepath1];
            expect(destinationDir).toEqual(expectedDir);
        });

    });

    test('copies multiple directories', () => {
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

        const expectedDir1 = content1;
        const expectedDir2 = content2;

        // expect.assertions(1);
        skeletorStaticFileCopier().run(config).then(response => {
            expect(response).toEqual(expectedResponse);
            let destinationDir = require('fs-extra').mockDest[destFilepath1];
            expect(destinationDir).toEqual(expectedDir1);

            destinationDir = require('fs-extra').mockDest[destFilepath2];
            expect(destinationDir).toEqual(expectedDir2);
        });
    });
});
