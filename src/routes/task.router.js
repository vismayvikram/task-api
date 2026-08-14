const router = require("express").Router();
const validate = require("../middleware/validate");
const authGuard = require("../middleware/auth");
const { createSchema, updateSchema } = require("../schemas/task.schemas");
const { tagSchema } = require('../schemas/tag.schema');
const ctrl = require("../controllers/task.controlller");
const tagCtrl = require('../controllers/tag.controller');
router.use(authGuard);

router.post('/', validate(createSchema), ctrl.createTask);
router.get('/', ctrl.listTask);
router.get('/:id', ctrl.getTask);
router.put('/', validate(updateSchema), ctrl.updateTask);
router.delete('/', ctrl.deleteTask);


router.post('/:id/tag', validate(tagSchema), tagCtrl.addTag);
router.post('/:id/tag/:tagId', tagCtrl.removeTag);
module.exports = router;