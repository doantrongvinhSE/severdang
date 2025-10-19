const express = require('express');
const router = express.Router();
const controller = require("../controllers/cookieTokenController");
const { checkLive, checkLives  } = require("../controllers/checkLiveController");


router.get('/', controller.getAllCookieToken);
router.post('/', controller.createCookieToken);
router.delete('/:id', controller.deleteCookieTokenById);
router.put('/:id', controller.updateCookieTokenById);
router.delete('/', controller.deleteAllCookieToken);
router.get("/check/:uid", checkLive);
router.get("/check-multiple", checkLives);



module.exports = router;

