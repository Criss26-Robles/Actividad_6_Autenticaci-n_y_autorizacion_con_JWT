const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const token=require("../utils/jwt");
const login = async ({ email, password }) => {
  const user = await User.findOne({
    where: { email },
  });
  if (!user) {
    throw new Error("Credenciales inválidas");
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new Error("Credenciales inválidas");
  }
  return token.generateToken({
    id: user.id,
    role: user.role,
  });
};
module.exports = {
  login,
};
