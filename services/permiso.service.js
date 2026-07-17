const { Permiso, Rol } = require("../models");
const AppError = require("../utils/AppError");

const getAll = async () => {
  return Permiso.findAll({
    include: [{ model: Rol }],
  });
};

const getById = async (id) => {
  const permiso = await Permiso.findByPk(id, {
    include: [{ model: Rol }],
  });

  if (!permiso) {
    throw new AppError("Permiso no encontrado", 404);
  }

  return permiso;
};

const create = async (data = {}) => {
  const { nombre, descripcion } = data;

  if (!nombre) {
    throw new AppError("El nombre del permiso es obligatorio", 400);
  }

  const existing = await Permiso.findOne({ where: { nombre } });
  if (existing) {
    throw new AppError("Ya existe un permiso con ese nombre", 409);
  }

  return Permiso.create({ nombre, descripcion });
};

const update = async (id, data = {}) => {
  const { nombre, descripcion } = data;
  const permiso = await Permiso.findByPk(id);

  if (!permiso) {
    throw new AppError("Permiso no encontrado", 404);
  }

  if (nombre && nombre !== permiso.nombre) {
    const existing = await Permiso.findOne({ where: { nombre } });
    if (existing) {
      throw new AppError("Ya existe un permiso con ese nombre", 409);
    }
    permiso.nombre = nombre;
  }

  if (descripcion !== undefined) {
    permiso.descripcion = descripcion;
  }

  await permiso.save();
  return permiso;
};

const remove = async (id) => {
  const permiso = await Permiso.findByPk(id);

  if (!permiso) {
    throw new AppError("Permiso no encontrado", 404);
  }

  await permiso.setRols([]);
  await permiso.destroy();

  return { message: "Permiso eliminado correctamente" };
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: remove,
};
