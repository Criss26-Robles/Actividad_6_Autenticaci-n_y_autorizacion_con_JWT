/**
 * Autoriza el acceso según roles y/o permisos del JWT.
 *
 * Uso:
 *  - authorize()                         → cualquier usuario autenticado
 *  - authorize(["admin"])                → uno de los roles indicados
 *  - authorize("crear_rol")              → permiso específico
 *  - authorize({ roles: ["admin"], permissions: ["crear_rol"] })
 */
const authorize = (required) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Usuario no autenticado",
      });
    }

    if (
      required === undefined ||
      required === null ||
      (Array.isArray(required) && required.length === 0)
    ) {
      return next();
    }

    const userRole = req.user.rol || req.user.role;
    const userPermisos = req.user.permisos || [];

    let requiredRoles = [];
    let requiredPermissions = [];

    if (typeof required === "string") {
      requiredPermissions = [required];
    } else if (Array.isArray(required)) {
      requiredRoles = required;
    } else if (typeof required === "object") {
      requiredRoles = required.roles || [];
      requiredPermissions = required.permissions || [];
    }

    const hasRole =
      requiredRoles.length === 0 || requiredRoles.includes(userRole);

    const hasPermission =
      requiredPermissions.length === 0 ||
      requiredPermissions.some((permiso) => userPermisos.includes(permiso));

    if (!hasRole || !hasPermission) {
      return res.status(403).json({
        message: "No tiene permisos para realizar esta acción",
      });
    }

    next();
  };
};

module.exports = authorize;
