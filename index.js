const fse = require('fs-extra');
const path = require('path');
const glob = require('globby');

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

/**
 * 
 * @param {String} srcPath the full src path from the config
 * This function finds the base path which is the path before any glob syntax is used
 * This helps parse the file path in the copyFile method
 * @returns {String} base path (the path before any glob syntx is used)
 */
function getSourceDir(srcPath) {
    const srcPaths = srcPath.split('/');
    let retVal = srcPaths;
    srcPaths.forEach((path, indx) => {
        if (!glob.hasMagic(path)) {
            const endIndx = indx + 1;
            retVal = srcPaths.slice(0, endIndx).join('/');
        }
    });
    return retVal;
}

/**
 *
 * @param {Object} fileConfig config object from project
 * this method gets all files in src (taking into account globbing syntax)
 * it then calls the copyFile method to copy each file in directory
 * @returns {Promise} a promise of all copyFile promises
 */
const copyDirectory = async (fileConfig) => {
    fileConfig.basePath = getSourceDir(fileConfig.src);
    const filePaths = await glob(`${fileConfig.src}`);
    const filePromises = filePaths.map(file => copyFile(fileConfig, file));
    return Promise.all(filePromises);
};

/**
 * 
 * @param {Object} fileConfig config object from project
 * @param {String} file path to file in src directory
 * this method uses the source file path, removes the base src path to get the file name with any sub-directories
 * it copies the file to the destination directory
 * fse.copy will create directories in the destination if they do not exist
 * @returns {Promise} promise representing status of file copy
 */
const copyFile = (fileConfig, file) => {
    const srcFilepath = path.resolve(process.cwd(), file);
    const filePath = file.replace(fileConfig.basePath, '');
    const destFilepath = path.resolve(process.cwd(), fileConfig.dest) + filePath;
    return fse.copy(srcFilepath, destFilepath);
};

module.exports = skeletorStaticFileCopier = () => (
    {
        run
    }
);