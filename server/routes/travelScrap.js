const router = require('express').Router();
const {scrapeTripAdvisor} = require('../controllers/travelSearchScrap')


router.post('/tripSearch',scrapeTripAdvisor);

module.exports = router;