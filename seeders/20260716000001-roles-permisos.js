'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert('Rols', [
      {
        nombre: 'admin',
        descripcion: 'Administrador del sistema',
        createdAt: now,
        updatedAt: now,
      },
      {
        nombre: 'usuario',
        descripcion: 'Usuario estándar del sistema',
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await queryInterface.bulkInsert('Permisos', [
      {
        nombre: 'gestionar_roles',
        descripcion: 'Crear, editar y eliminar roles',
        createdAt: now,
        updatedAt: now,
      },
      {
        nombre: 'gestionar_permisos',
        descripcion: 'Crear, editar y eliminar permisos',
        createdAt: now,
        updatedAt: now,
      },
      {
        nombre: 'gestionar_usuarios',
        descripcion: 'Administrar usuarios del sistema',
        createdAt: now,
        updatedAt: now,
      },
    ]);

    const [roles] = await queryInterface.sequelize.query(
      `SELECT id, nombre FROM "Rols" WHERE nombre IN ('admin', 'usuario')`
    );
    const [permisos] = await queryInterface.sequelize.query(
      `SELECT id FROM "Permisos"`
    );

    const adminRole = roles.find((rol) => rol.nombre === 'admin');

    if (adminRole && permisos.length > 0) {
      await queryInterface.bulkInsert(
        'RolPermisos',
        permisos.map((permiso) => ({
          rol_id: adminRole.id,
          permiso_id: permiso.id,
        }))
      );
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('RolPermisos', null, {});
    await queryInterface.bulkDelete('Permisos', null, {});
    await queryInterface.bulkDelete('Rols', null, {});
  },
};
