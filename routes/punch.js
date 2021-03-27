const Router = require('koa-router');
const PunchController = require('../controllers/PunchController');

const router = new Router({prefix: '/api/punch'});

router.post('/create', PunchController.createPunch);
router.get('/stopPunch', PunchController.stopPunch);
router.get('/getPunching', PunchController.getPunching);
router.get('/readPunch', PunchController.readPunch);
router.get('/getPunchById', PunchController.getPunchDetail);
router.delete('/delete', PunchController.deletePunch);
router.get('/joinPunch', PunchController.joinPunch);
router.get('/getPunchList', PunchController.getPunchList);

module.exports = router;