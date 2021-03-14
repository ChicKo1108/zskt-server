const Router = require('koa-router');
const HomeController = require('../controllers/HomeController');

const router = new Router({ prefix: '/api/home' });

router.get('/getPageData', HomeController.getPageData);

module.exports = router;