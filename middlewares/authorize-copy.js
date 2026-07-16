const jwt = require("jsonwebtoken");
const authorize = (requiredRoles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Token requerido" });
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Inyecta los datos del usuario en la petición
      // Autorización basada en roles
      if (requiredRoles.length && !requiredRoles.includes(req.user.role)) {
        return res
          .status(403)
          .json({ error: "Acceso denegado, permisos insuficientes" });
      }
      next();
    } catch (error) {
      res.status(401).json({ error: "Token inválido o expirado" });
    }
  };
};
module.exports = authorize;
