const axios = require("axios");

const BASE_HEADERS = {
    "authority": "www.tripadvisor.com",
    "accept-language": "en-US,en;q=0.9",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    "accept-encoding": "gzip, deflate, br",
    "referer": "https://www.tripadvisor.com/Hotels",
    "origin": "https://www.tripadvisor.com",
};

const scrapeTripAdvisor = async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) return res.status(400).json({ message: "Query is required" });

        const payload = [
            {
                "variables": {
                    "request": {
                        "query": query,
                        "limit": 2,
                        "scope": "WORLDWIDE",
                        "locale": "en-US",
                        "scopeGeoId": 1,
                        "searchCenter": null,
                        "types": ["LOCATION"],
                        "locationTypes": [
                            "GEO", "AIRPORT", "ACCOMMODATION", "ATTRACTION",
                            "ATTRACTION_PRODUCT", "EATERY", "NEIGHBORHOOD",
                            "AIRLINE", "SHOPPING", "UNIVERSITY", "GENERAL_HOSPITAL",
                            "PORT", "FERRY", "CORPORATION", "VACATION_RENTAL",
                            "SHIP", "CRUISE_LINE", "CAR_RENTAL_OFFICE"
                        ],
                        "userId": null,
                        "context": {},
                        "enabledFeatures": ["articles"],
                        "includeRecent": true,
                    }
                },
                "query": "84b17ed122fbdbd4",
                "extensions": { "preRegisteredQueryId": "84b17ed122fbdbd4" }
            }
        ];

        const response = await axios.post(
            "https://www.tripadvisor.com/data/graphql/ids",
            payload,
            { headers: BASE_HEADERS }
        );

        const data = response.data[0]?.data?.Typeahead_autocomplete?.results || [];
        if (data.length === 0) return res.status(404).json({ message: "No results found" });

        return res.status(200).json({ results: data.map(r => r.details) });
    } catch (err) {
        return res.status(500).json({ message: "Server Error", error: err.message });
    }
};

module.exports = { scrapeTripAdvisor };
