const { Rol, Permiso, User } = require("../models");
const AppError = require("../utils/AppError");

const getAll = async () => {
  return Rol.findAll({
    include: [{ model: Permiso }],
  });
};

const getById = async (id) => {
  const rol = await Rol.findByPk(id, {
    include: [{ model: Permiso }],
  });

  if (!rol) {
    throw new AppError("Rol no encontrado", 404);
  }

  return rol;
};

const create = async (data = {}) => {
  const { nombre, descripcion, permisosIds } = data;

  if (!nombre) {
    throw new AppError("El nombre del rol es obligatorio", 400);
  }

  const existing = await Rol.findOne({ where: { nombre } });
  if (existing) {
    throw new AppError("Ya existe un rol con ese nombre", 409);
  }

  const rol = await Rol.create({ nombre, descripcion });

  if (Array.isArray(permisosIds) && permisosIds.length > 0) {
    const permisos = await Permiso.findAll({
      where: { id: permisosIds },
    });
    await rol.setPermisos(permisos);
  }

  return getById(rol.id);
};

const update = async (id, data = {}) => {
  const { nombre, descripcion, permisosIds } = data;
  const rol = await Rol.findByPk(id);

  if (!rol) {
    throw new AppError("Rol no encontrado", 404);
  }

  if (nombre && nombre !== rol.nombre) {
    const existing = await Rol.findOne({ where: { nombre } });
    if (existing) {
      throw new AppError("Ya existe un rol con ese nombre", 409);
    }
    rol.nombre = nombre;
  }

  if (descripcion !== undefined) {
    rol.descripcion = descripcion;
  }

  await rol.save();

  if (Array.isArray(permisosIds)) {
    const permisos = await Permiso.findAll({
      where: { id: permisosIds },
    });
    await rol.setPermisos(permisos);
  }

  return getById(id);
};

const remove = async (id) => {
  const rol = await Rol.findByPk(id);

  if (!rol) {
    throw new AppError("Rol no encontrado", 404);
  }

  const usersWithRole = await User.count({ where: { rol_id: id } });
  if (usersWithRole > 0) {
    throw new AppError(
      "No se puede eliminar el rol porque tiene usuarios asignados",
      409
    );
  }

  await rol.setPermisos([]);
  await rol.destroy();

  return { message: "Rol eliminado correctamente" };
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: remove,
};
