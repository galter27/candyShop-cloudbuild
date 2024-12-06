
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

// Function to get Facebook stats (followers, posts, and likes)
function getFacebookPageInfo() {
    return new Promise((resolve, reject) => {
        const url = `https://graph.facebook.com/v20.0/${PAGE_ID}?fields=followers_count,posts.limit(100){id,likes.summary(true)}&access_token=${ACCESS_TOKEN}`;

        https.get(url, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                try {
                    const parsedData = JSON.parse(data);
                    // Handle API error response
                    if (parsedData.error) {
                        console.error('API Error:', parsedData.error);
                        return resolve({
                            followers: 'N/A',
                            postCount: 'N/A',
                            totalLikes: 'N/A',
                            errorMessage: 'There was an issue fetching the data. Please try again later.'
                        });
                    }

                    const posts = parsedData.posts ? parsedData.posts.data : [];
                    const postCount = posts.length;
                    const totalLikes = posts.reduce((acc, post) => acc + (post.likes ? post.likes.summary.total_count : 0), 0);
                    // Return stats
                    resolve({
                        followers: parsedData.followers_count,
                        postCount: postCount,
                        totalLikes: totalLikes
                    });

                } catch (error) {
                    console.error('Error parsing response:', error.message);
                    resolve({
                        followers: 'N/A',
                        postCount: 'N/A',
                        totalLikes: 'N/A',
                        errorMessage: 'Unable to process the page info. Please try again later.'
                    });
                }
            });

        }).on('error', (error) => {
            console.error('HTTPS Error:', error.message);
            resolve({
                followers: 'N/A',
                postCount: 'N/A',
                totalLikes: 'N/A',
                errorMessage: 'There was a problem with the server. Please try again later.'
            });
        });
    });
}

module.exports = {
    getFacebookPageInfo
};    