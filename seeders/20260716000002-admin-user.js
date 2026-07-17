'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const password = await bcrypt.hash('Admin123*', 10);

    const [roles] = await queryInterface.sequelize.query(
      `SELECT id FROM "Rols" WHERE nombre = 'admin' LIMIT 1`
    );

    if (!roles.length) {
      throw new Error(
        "No existe el rol 'admin'. Ejecuta primero el seeder de roles y permisos."
      );
    }

    await queryInterface.bulkInsert('Users', [
      {
        username: 'admin',
        email: 'admin@biblioteca.com',
        password,
        rol_id: roles[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Users', {
      username: 'admin',
    });
  },
};
