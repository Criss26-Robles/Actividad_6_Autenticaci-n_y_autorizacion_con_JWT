const express = require("express");
const permisoController = require("../controllers/permiso.controller");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

const router = express.Router();

router.use(authenticate);

router.get("/", authorize(["admin"]), permisoController.getAll);
router.get("/:id", authorize(["admin"]), permisoController.getById);
router.post("/", authorize(["admin"]), permisoController.create);
router.put("/:id", authorize(["admin"]), permisoController.update);
router.delete("/:id", authorize(["admin"]), permisoController.delete);

module.exports = router;
