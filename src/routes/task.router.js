const router = require("express").Router();
const validate = require("../middleware/validate");
const authGuard = require("../middleware/auth");
const { createTaskSchema, updateTaskSchema } = require("../schemas/task.schemas");
const ctrl = require("../controllers/task.controlller");

router.use(authGuard);

router.post('/', validate(createTaskSchema), ctrl.createTask);
router.get('/', ctrl.listTask);
router.get('/:id', ctrl.getTask);
router.put('/', validate(updateTaskSchema), ctrl.updateTask);
router.delete('/', ctrl.deleteTask);

module.exports = router;