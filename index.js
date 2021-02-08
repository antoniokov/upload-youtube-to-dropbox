const fs = require('fs');
const youtube= require('ytdl-core');

const FILENAME = 'temp.m4a';


const download = async (url, filename) => {
    const video = youtube(url, {filter: 'audioonly'});

    video.on('info', (info) => { console.info('Downloading...'); });
    video.pipe(fs.createWriteStream(filename));

    return video.on('end', function() {
        console.log('Downloaded');
        return true;
    });
}


const handle = async (event) => {
    const video = await download(event.queryStringParameters.url, FILENAME);

    return {
        statusCode: 200,
        body: JSON.stringify(event.queryStringParameters.url),
    };
}

handle({
    queryStringParameters: {
        url: 'https://youtu.be/3mbBbFH9fAg'
    }
});


exports.handler = handle;

