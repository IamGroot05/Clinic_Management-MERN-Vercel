const router = require('express').Router();
const { DoclogController } = require('../controllers/DoclogController');
const { createDoc } = require('../controllers/createDoc');
const { docDataReader } = require('../controllers/docDataReader');
const { enquirePatController } = require('../controllers/enquirePatController');
const { retrieveSingleToken } = require('../controllers/retrieveSingleToken');
const { getTokensForToday } = require('../controllers/retrieveToken');
const { getStates } = require('../controllers/getStates');
const { saveMR } = require('../controllers/mrController');

router.post('/logdoc',DoclogController)
router.post('/enqpat',enquirePatController);
router.post('/createdoc',createDoc);
router.post('/retdoc',docDataReader);
router.get('/retalltoken',getTokensForToday);
router.get('/retState', getStates)
router.post('/rettoken',retrieveSingleToken);
router.post('/mr', saveMR);
module.exports = router;