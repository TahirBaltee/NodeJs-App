const express = require('express');
const axios = require('axios'); // Replaced deprecated 'request'
const wikip = require('wiki-infobox-parser');
const app = express();

app.set("view engine", 'ejs');

// Middleware to validate input
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/index', async (req, res) => {
    try {
        // Validate input
        if (!req.query.person || typeof req.query.person !== 'string') {
            return res.status(400).render('error', { message: 'Invalid search parameter' });
        }

        // Wikipedia API call
        const response = await axios.get('https://en.wikipedia.org/w/api.php', {
            params: {
                action: "opensearch",
                search: req.query.person.trim(),
                limit: 1,
                format: "json"
            },
            timeout: 5000
        });

        const result = response.data;
        
        // Validate response
        if (!Array.isArray(result) || result.length < 4 || !result[3]?.[0]) {
            return res.status(404).render('error', { message: 'No Wikipedia article found' });
        }

        // Process infobox
        const articleUrl = result[3][0];
        wikip(articleUrl, (err, final) => {
            if (err) {
                console.error('Infobox error:', err);
                return res.status(500).render('error', { message: 'Failed to parse infobox' });
            }
            res.json(final);
        });

    } catch (error) {
        console.error('API Error:', error.message);
        res.status(500).render('error', { message: 'Service unavailable' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).render('error', { message: 'Something went wrong' });
});

app.listen(3000, '0.0.0.0', () => {
    console.log("Server running on port 3000");
});