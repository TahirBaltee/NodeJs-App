const express = require('express');
const app = express();
const request = require('request');
const wikip = require('wiki-infobox-parser');

// Configuration
app.set("view engine", 'ejs');

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/index', (req, response) => {
    // Validate input
    if (!req.query.person || typeof req.query.person !== 'string') {
        return response.status(400).send('Invalid search parameter');
    }

    const url = "https://en.wikipedia.org/w/api.php";
    const params = {
        action: "opensearch",
        search: req.query.person.trim(),
        limit: "1",
        namespace: "0",
        format: "json"
    };

    // Build URL safely
    const queryString = Object.keys(params)
        .map(key => `${key}=${encodeURIComponent(params[key])}`)
        .join('&');

    request(`${url}?${queryString}`, (err, res, body) => {
        if (err) {
            console.error('API request failed:', err);
            return response.status(502).render('404');
        }

        try {
            const result = JSON.parse(body);
            
            // Validate response structure
            if (!Array.isArray(result) || result.length < 4 || !result[3] || !result[3][0]) {
                console.warn('Unexpected API response:', result);
                return response.status(404).render('404');
            }

            const articleUrl = result[3][0];
            
            // Validate URL
            if (!articleUrl.includes('wikipedia.org/wiki/')) {
                console.warn('Invalid Wikipedia URL:', articleUrl);
                return response.status(404).render('404');
            }

            // Process infobox
            wikip(articleUrl, (err, final) => {
                if (err) {
                    console.error('Infobox parsing failed:', err);
                    return response.status(500).render('404');
                }
                response.json(final);
            });

        } catch (parseError) {
            console.error('Response parsing failed:', parseError);
            response.status(502).render('404');
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).render('404');
});

// Start server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});