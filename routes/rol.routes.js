const express = require("express");
const rolController = require("../controllers/rol.controller");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

const router = express.Router();

router.use(authenticate);

router.get("/", authorize(["admin"]), rolController.getAll);
router.get("/:id", authorize(["admin"]), rolController.getById);
router.post("/", authorize(["admin"]), rolController.create);
router.put("/:id", authorize(["admin"]), rolController.update);
router.delete("/:id", authorize(["admin"]), rolController.delete);

module.exports = router;
