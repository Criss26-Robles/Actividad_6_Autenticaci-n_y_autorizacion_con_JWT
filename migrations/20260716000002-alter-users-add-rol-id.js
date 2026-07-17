'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('Users');

    if (table.role && !table.rol_id) {
      const now = new Date();

      const [existingRoles] = await queryInterface.sequelize.query(
        `SELECT id, nombre FROM "Rols"`
      );

      if (!existingRoles.some((rol) => rol.nombre === 'admin')) {
        await queryInterface.bulkInsert('Rols', [
          {
            nombre: 'admin',
            descripcion: 'Administrador del sistema',
            createdAt: now,
            updatedAt: now,
          },
        ]);
      }

      if (!existingRoles.some((rol) => rol.nombre === 'usuario')) {
        await queryInterface.bulkInsert('Rols', [
          {
            nombre: 'usuario',
            descripcion: 'Usuario estándar del sistema',
            createdAt: now,
            updatedAt: now,
          },
        ]);
      }

      await queryInterface.addColumn('Users', 'rol_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });

      await queryInterface.sequelize.query(`
        UPDATE "Users" SET "rol_id" = (
          SELECT id FROM "Rols" WHERE nombre = 'admin' LIMIT 1
        )
        WHERE role = 'admin'
      `);

      await queryInterface.sequelize.query(`
        UPDATE "Users" SET "rol_id" = (
          SELECT id FROM "Rols" WHERE nombre = 'usuario' LIMIT 1
        )
        WHERE "rol_id" IS NULL
      `);

      await queryInterface.removeColumn('Users', 'role');

      await queryInterface.changeColumn('Users', 'rol_id', {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Rols',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      });
    } else if (!table.rol_id) {
      await queryInterface.addColumn('Users', 'rol_id', {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Rols',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('Users');

    if (table.rol_id && !table.role) {
      await queryInterface.addColumn('Users', 'role', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'user',
      });

      await queryInterface.sequelize.query(`
        UPDATE "Users" u
        SET role = r.nombre
        FROM "Rols" r
        WHERE u.rol_id = r.id
      `);

      await queryInterface.removeColumn('Users', 'rol_id');
    }
  },
};
