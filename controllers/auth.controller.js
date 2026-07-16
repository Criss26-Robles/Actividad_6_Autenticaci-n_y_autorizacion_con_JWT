const authService = require("../services/auth.service");
const login = async (req, res, next) => {

    const token = await authService.login(req.body);
    res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
    });

};
module.exports = {
  login,
};
