const https = require('https');
const fs = require('fs');
const path = require('path');

// Manually load environment variables from the .env file
function loadEnv() {
    const envPath = path.resolve(__dirname, '../.env');
    const envVars = fs.readFileSync(envPath, 'utf8').split('\n');
    const env = {};
    envVars.forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            env[key.trim()] = value.trim();
        }
    });
    return env;
}

const env = loadEnv();
const ACCESS_TOKEN = env.FACEBOOK_API_KEY;
const PAGE_ID = env.FACEBOOK_PAGE_ID; 

async function postMessageToFacebook(message) {
    return new Promise((resolve, reject) => {
        const postMessage = `${message}`;
        const postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        const req = https.request(`https://graph.facebook.com/v20.0/${PAGE_ID}/feed?message=${encodeURIComponent(postMessage)}&access_token=${ACCESS_TOKEN}`, postOptions, res => {
            let data = '';

            res.on('data', chunk => {
                data += chunk;
            });

            res.on('end', () => {
                const result = JSON.parse(data);
                if (result.error) {
                    return reject(new Error(result.error.message));
                }
                resolve(result);
            });
        });

        req.on('error', error => {
            reject(new Error(`Failed to post to Facebook: ${error.message}`));
        });

        req.end();
    });
}

module.exports = {
    postMessageToFacebook
};