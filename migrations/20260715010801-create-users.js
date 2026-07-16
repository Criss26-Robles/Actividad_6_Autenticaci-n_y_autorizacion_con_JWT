'use strict';

const sequelize = require('../config/database');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('Users',{
      id:{
        allowNull:false,
        autoIncrement:true,
        primaryKey:true,
        type:Sequelize.INTEGER
      },
      username:{
        allowNull:false,
        type:Sequelize.STRING,
        unique:true
      },
      email:{
        allowNull:false,
        type:Sequelize.STRING,
        unique:true
      },
      password: {
        allowNull:false,
        type:Sequelize.STRING
      },
      role:{
        allowNull:false,
        type: Sequelize.STRING,
        defaultValue: 'user'
      },
      createdAt:{
        allowNull:false,
        type:Sequelize.DATE
      },
      updatedAt:{
        allowNull:false,
        type:Sequelize.DATE
      }
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('Users');
  }
};
