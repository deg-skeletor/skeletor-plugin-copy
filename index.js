const fse = require('fs-extra');
const path = require('path');

const run = config => {

    if (config.directories && Array.isArray(config.directories)) {
        const promises = config.directories.map(directoryConfig => copyDirectory(directoryConfig));

        return Promise.all(promises)
            .then(() => {
                const descriptor = config.directories.length === 1 ? 'directory' : 'directories';
                const message = `${config.directories.length} ${descriptor} processed`;
                return {
                    status: 'complete',
                    message: message
                };
            })
            .catch(error => {
                return {
                    status: 'error',
                    error: error
                };
            });
    }

    return Promise.reject({
        status: 'error',
        error: 'Config directories is not found or not an array.'
    });
};

const copyDirectory = fileConfig => {

    return fse.stat(fileConfig.dest).then(statResp => {
        if (!statResp.isDirectory) {
            fse.mkdirSync(fileConfig.dest);
            return fse.readdir(fileConfig.src)
                .then(files => {
                    files.forEach(file => {
                        copyFile(fileConfig, file);
                    });
                })
                .catch(readErr => Promise.reject(readErr));
        }
        return fse.readdir(fileConfig.src)
            .then(files => {
                files.forEach(file => {
                    copyFile(fileConfig, file);
                });
            })
            .catch(readErr => Promise.reject(readErr));
    });
};



const copyFile = (fileConfig, file) => {
    const srcFilepath = path.resolve(process.cwd(), fileConfig.src, file);
    const destFilepath = path.resolve(process.cwd(), fileConfig.dest, file);
    return fse.copyFile(srcFilepath, destFilepath)
        .catch(copyErr => Promise.reject(copyErr));
};

module.exports = skeletorStaticFileCopier = () => (
    {
        run
    }
);