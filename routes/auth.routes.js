const express = require("express");
const authController = require("../controllers/auth.controller");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

const router = express.Router();

// Rutas públicas
router.post("/register", authController.register);
router.post("/login", authController.login);

// Ruta protegida (solo usuarios autenticados)
router.get("/dashboard", authenticate, authorize(), (req, res) => {
  res.json({
    message: "Bienvenido al panel",
    userId: req.user.id,
    rol: req.user.rol,
  });
});

// Ruta protegida y restringida (solo administradores)
router.post("/admin/users", authenticate, authorize(["admin"]), (req, res) => {
  res.json({ message: "Usuario creado exitosamente" });
});

module.exports = router;
