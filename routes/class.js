const Router = require('koa-router');
const ClassController = require('../controllers/ClassController');

const router = new Router({prefix: '/api/class'});

router.post('/create', ClassController.createClass);

module.exports = router;