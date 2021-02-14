const fs = require('fs');
const path = require('path');
const youtube= require('ytdl-core');
const Dropbox = require('dropbox').Dropbox;


const downloadFromYouTube = async (info, path) => {
    return new Promise((resolve, reject) => {
        const video = youtube.downloadFromInfo(info, { quality: process.env.YOUTUBE_FORMAT });
        video.pipe(fs.createWriteStream(path));
        video.on('end', resolve);
    });
};

const uploadToDropbox = async (file, pathDropbox) => {
    const dropbox = new Dropbox({ accessToken: process.env.DROPBOX_TOKEN });

    return dropbox.filesUpload({
            contents: file,
            path: pathDropbox,
            mode: { '.tag': "add" },
            autorename: true
        });
};

exports.handler = async (event) => {
    console.log('Getting metadata...');
    const info = await youtube.getInfo(event.queryStringParameters.url);
    const filename = `${info.videoDetails.title}.${process.env.FILE_EXTENSION}`;
    const filepath = path.join(__dirname, filename);

    console.log(`Downloading "${filename}"...`);
    await downloadFromYouTube(info, filepath);
    console.log('Downloaded');

    console.log('Reading the file...');
    const file = fs.readFileSync(filepath);

    console.log('Uploading...');
    await uploadToDropbox(file, path.join(process.env.DROPBOX_PATH, filename));
    console.log('Uploaded');

    return {
        statusCode: 200,
        body: JSON.stringify(event.queryStringParameters.url),
    };
}
