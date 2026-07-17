const rolService = require("../services/rol.service");

const getAll = async (req, res, next) => {
  try {
    const roles = await rolService.getAll();
    res.status(200).json(roles);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const rol = await rolService.getById(req.params.id);
    res.status(200).json(rol);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const rol = await rolService.create(req.body);
    res.status(201).json(rol);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const rol = await rolService.update(req.params.id, req.body);
    res.status(200).json(rol);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await rolService.delete(req.params.id);
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
