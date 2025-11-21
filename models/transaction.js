'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
        //...
    }
  }
  Transaction.init({
    description: DataTypes.STRING,
    // the problem: the amount in float
    amount: {
			type: DataTypes.BIGINT,
			allowNull: false,
	
			get() {
					const rawValue = this.getDataValue('amount');
					return rawValue !== null ? Number(rawValue) / 100 : null;
			},
			// sets App (Naira) -> Database (Kobo)
			// App sends: 50.00 | DB stores: 5000
			set(value) {
					this.setDataValue('amount', Math.round(Number(value) * 100));
			}
    },
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};