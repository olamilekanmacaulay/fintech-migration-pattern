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
    amount: DataTypes.FLOAT 
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};