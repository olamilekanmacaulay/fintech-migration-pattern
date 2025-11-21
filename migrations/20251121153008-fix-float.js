'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
    
      await queryInterface.addColumn('Transactions', 'amount_kobo', { type: Sequelize.BIGINT }, { transaction });
      
      await queryInterface.sequelize.query(
        `UPDATE "Transactions" SET "amount_kobo" = CAST("amount" * 100 AS BIGINT)`, 
        { transaction }
      );
      
      // 3. Swap Columns
      await queryInterface.removeColumn('Transactions', 'amount', { transaction });
      await queryInterface.renameColumn('Transactions', 'amount_kobo', 'amount', { transaction });
      
      // 4. Enforce Constraints
      await queryInterface.changeColumn('Transactions', 'amount', { type: Sequelize.BIGINT, allowNull: false }, { transaction });
      
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Transactions');
  }
};