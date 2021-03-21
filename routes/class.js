const Router = require('koa-router');
const ClassController = require('../controllers/ClassController');

const router = new Router({prefix: '/api/class'});

router.post('/create', ClassController.createClass);
router.get('/findById', ClassController.findById);
router.get('/findMyClasses', ClassController.findMyClasses);
router.get('/findClassByNameAndId', ClassController.findClassByNameAndId);
router.get('/apply2Add', ClassController.apply2AddClass);
router.get('/handleApply', ClassController.handleApply);

module.exports = router;