var uiCtl = require('./universityIndicatorsCtl');
var bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();
//var passport = require('passport');
module.exports = router;
router.use(bodyParser.json());
//router.use(passport.initialize());


//          GET
router.get('/loadInitialData',      (req,res) => uiCtl.loadInitialData(req,res));
router.get('/',                     (req,res) => uiCtl.getUIs(req,res));
router.get('/:community(\\w+)/',    (req,res) => uiCtl.getUIsByCommunity(req,res));
router.get('/:year(\\d+)/',         (req,res) => uiCtl.getUIsByYear(req,res));
router.get('/:community/:year',     (req,res) => uiCtl.getUI(req,res));
//          POST
router.post('/',                    (req,res) => uiCtl.postUI(req,res));
router.post('/:community',          (req,res) => uiCtl.postUIByCommunity(req,res));
router.post('/:community/:year',    (req,res) => uiCtl.postUIByCommunity(req,res));
//          PUT
router.put('/',                     (req,res) => uiCtl.putToUIs(req,res));
router.put('/:community',           (req,res) => uiCtl.putToUIs(req,res));
router.put('/:community/:year',     (req,res) => uiCtl.putUIByCommunityYear(req,res));
//          DELETE
router.delete('/',                  (req,res) => uiCtl.deleteUIs(req,res));
router.delete('/:community/:year',  (req,res) => uiCtl.deleteUI(req,res));
