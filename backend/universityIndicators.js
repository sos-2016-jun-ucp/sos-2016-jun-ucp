var uiCtl = require('./universityIndicatorsCtl');
var bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();
var passport = require('passport');
module.exports = router;
router.use(bodyParser.json());
router.use(passport.initialize());


//          GET
router.get('/loadInitialData',  uiCtl.WriteAccess, (req,res) => uiCtl.loadInitialData(req,res));
router.get('/',                 uiCtl.ReadAccess, (req,res) => uiCtl.getUIs(req,res));
router.get('/:community(\\w+)/', uiCtl.ReadAccess,(req,res) => uiCtl.getUIsByCommunity(req,res));
router.get('/:year(\\d+)/',     uiCtl.ReadAccess, (req,res) => uiCtl.getUIsByYear(req,res));
router.get('/:community/:year',  uiCtl.ReadAccess, (req,res) => uiCtl.getUI(req,res));
//          POST
router.post('/',                uiCtl.WriteAccess,(req,res) => uiCtl.postUI(req,res));
router.post('/:community',       uiCtl.WriteAccess, (req,res) => uiCtl.postUIByCommunity(req,res));
router.post('/:community/:year', uiCtl.WriteAccess, (req,res) => uiCtl.postUIByCommunity(req,res));
//          PUT
router.put('/',                 uiCtl.WriteAccess, (req,res) => uiCtl.putToUIs(req,res));
router.put('/:community',        uiCtl.WriteAccess, (req,res) => uiCtl.putToUIs(req,res));
router.put('/:community/:year',  uiCtl.WriteAccess, (req,res) => uiCtl.putUIByCommunityYear(req,res));
//          DELETE
router.delete('/',              uiCtl.WriteAccess, (req,res) => uiCtl.deleteUIs(req,res));
router.delete('/:community/:year',uiCtl.WriteAccess, (req,res) => uiCtl.deleteUI(req,res));
