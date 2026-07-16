const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const RolPermiso = sequelize.define(
  "RolPermiso",
  {
    rol_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    permiso_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = RolPermiso;