app.get('/index', (req, response) => {
    if (!req.query.person) {
        return response.status(400).send('Missing person parameter');
    }

    const url = "https://en.wikipedia.org/w/api.php";
    const params = {
        action: "opensearch",
        search: req.query.person,
        limit: "1",
        namespace: "0",
        format: "json"
    };

    request({url, qs: params, timeout: 5000}, (err, res, body) => {
        if (err) {
            console.error('API request failed:', err);
            return response.status(502).send('Wikipedia API unavailable');
        }

        try {
            const result = JSON.parse(body);
            
            // Validate response structure
            if (!result[3] || !result[3][0]) {
                console.warn('No results found for:', req.query.person);
                return response.status(404).send('No Wikipedia article found');
            }

            const articleUrl = result[3][0];
            wikip(articleUrl, (err, final) => {
                if (err) {
                    console.error('Infobox parsing failed:', err);
                    return response.status(500).send('Infobox parse error');
                }
                response.json(final);
            });

        } catch (parseError) {
            console.error('Response parsing failed:', parseError);
            response.status(502).send('Invalid API response');
        }
    });
});