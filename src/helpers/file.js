import fs from 'fs';
import fetch from 'node-fetch';
const saveInJsonFile = async (data, fullPath) => {

    createFolderAndSubFolder(fullPath);

    await fs.writeFileSync(
        fullPath,
        JSON.stringify(data, null, 2)
    );
};

const getTimestamps = () => (new Date().getTime());

const createFolderAndSubFolder = (fullPath) => {
    const folderPath = fullPath.split('/').slice(0, -1).join('/');
    fs.mkdirSync(folderPath, {recursive: true});
};

const downloadFile = async (url, path) => {
    await createFolderAndSubFolder(path);
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(path, buffer);
}

export {
    saveInJsonFile,
    createFolderAndSubFolder,
    downloadFile,
    getTimestamps
};