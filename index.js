const fse = require('fs-extra');
const path = require('path');
const glob = require('globby');

const run = config => {

    if (config.directories && Array.isArray(config.directories)) {
        const promises = config.directories.map(directoryConfig => copyDirectory(directoryConfig, directoryConfig.dest));

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
                console.log(error);
                return {
                    status: 'error',
                    error: error
                };
            });
    }

    return Promise.resolve({
        status: 'error',
        error: 'Config directories is not found or not an array.'
    });
};

const checkDirectoryStatus = dest => {
    return fse.ensureDir(dest)
        .then(() => Promise.resolve());
};

const copyDirectory = (fileConfig, dest) => {
    return checkDirectoryStatus(dest).then(() => {
        return glob(`${fileConfig.src}${fileConfig.regEx || ''}`)
            .then(files => {
                const filePromises = files.map(file => copyFile(fileConfig, file));
                return Promise.all(filePromises);
            });
    });
};

const copyFile = (fileConfig, file) => {
    const srcFilepath = path.resolve(process.cwd(), file);
    const filePath = file.replace(fileConfig.src, '');
    const destFilepath = path.resolve(process.cwd(), fileConfig.dest) + filePath;
    return fse.copy(srcFilepath, destFilepath);
};

module.exports = skeletorStaticFileCopier = () => (
    {
        run
    }
);