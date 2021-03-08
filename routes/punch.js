const Router = require('koa-router');
const PunchController = require('../controllers/PunchController');

const router = new Router({prefix: '/api/punch'});

router.post('/create', PunchController.createPunch);
router.get('/stopPunch', PunchController.stopPunch);
router.get('/getPunching', PunchController.getPunching);

module.exports = router;