const permisoService = require("../services/permiso.service");

const getAll = async (req, res, next) => {
  try {
    const permisos = await permisoService.getAll();
    res.status(200).json(permisos);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const permiso = await permisoService.getById(req.params.id);
    res.status(200).json(permiso);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const permiso = await permisoService.create(req.body);
    res.status(201).json(permiso);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const permiso = await permisoService.update(req.params.id, req.body);
    res.status(200).json(permiso);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await permisoService.delete(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: remove,
};
