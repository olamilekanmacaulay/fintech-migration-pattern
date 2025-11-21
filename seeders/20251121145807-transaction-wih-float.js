'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Transactions', [
      {
        description: 'Legacy Payment A',
        amount: 100.50, 
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        description: 'Legacy Payment B',
        amount: 50.00, 
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        description: 'Legacy Payment C (Precision Risk)',
        amount: 20.99, 
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Transactions', null, {});
  }
};