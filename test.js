const lambda = require('./index');

lambda.handler({
    queryStringParameters: {
        url: 'https://youtu.be/3mbBbFH9fAg'
    }
});