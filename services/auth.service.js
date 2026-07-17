const bcrypt = require("bcrypt");
const { User, Rol, Permiso } = require("../models");
const { generateToken } = require("../utils/jwt");
const AppError = require("../utils/AppError");

const buildTokenPayload = (user) => {
  const rol = user.Rol;
  const permisos = rol?.Permisos?.map((permiso) => permiso.nombre) || [];

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    rol: rol?.nombre || null,
    rol_id: user.rol_id,
    permisos,
  };
};

const findUserWithRole = async (where) => {
  return User.findOne({
    where,
    include: [
      {
        model: Rol,
        include: [{ model: Permiso }],
      },
    ],
  });
};

const resolveRolId = async (rol_id) => {
  if (rol_id) {
    const rol = await Rol.findByPk(rol_id);
    if (!rol) {
      throw new AppError("El rol especificado no existe", 400);
    }
    return rol.id;
  }

  let rol = await Rol.findOne({ where: { nombre: "usuario" } });
  if (!rol) {
    rol = await Rol.create({
      nombre: "usuario",
      descripcion: "Rol por defecto para usuarios registrados",
    });
  }

  return rol.id;
};

const register = async (data = {}) => {
  const { username, email, password, rol_id } = data;

  if (!username || !email || !password) {
    throw new AppError("username, email y password son obligatorios", 400);
  }

  const existingUser = await User.findOne({
    where: { email },
  });

  if (existingUser) {
    throw new AppError("El correo electrónico ya está registrado", 409);
  }

  const existingUsername = await User.findOne({
    where: { username },
  });

  if (existingUsername) {
    throw new AppError("El nombre de usuario ya está registrado", 409);
  }

  const resolvedRolId = await resolveRolId(rol_id);

  const user = await User.create({
    username,
    email,
    password,
    rol_id: resolvedRolId,
  });

  const userWithRole = await findUserWithRole({ id: user.id });
  const payload = buildTokenPayload(userWithRole);
  const token = generateToken(payload);

  return {
    user: {
      id: userWithRole.id,
      username: userWithRole.username,
      email: userWithRole.email,
      rol: userWithRole.Rol?.nombre || null,
      rol_id: userWithRole.rol_id,
    },
    token,
  };
};

const login = async (data = {}) => {
  const { email, password } = data;

  if (!email || !password) {
    throw new AppError("email y password son obligatorios", 400);
  }

  const user = await findUserWithRole({ email });

  if (!user) {
    throw new AppError("Credenciales inválidas", 401);
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    throw new AppError("Credenciales inválidas", 401);
  }

  const payload = buildTokenPayload(user);
  const token = generateToken(payload);

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      rol: user.Rol?.nombre || null,
      rol_id: user.rol_id,
      permisos: payload.permisos,
    },
    token,
  };
};

module.exports = {
  register,
  login,
};
