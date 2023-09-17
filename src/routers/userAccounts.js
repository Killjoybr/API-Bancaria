const express = require('express');
const accounts = express.Router();
const controller = require('../controllers/accounts');
const accountsUtils = require('../middlewares/accounts');
const userAuth = require('../middlewares/userAuth');


accounts.get('/contas/saldo', accountsUtils.checkAccountQuery, userAuth.verifyLoginQuery, controller.listarSaldo); // Lista o saldo da conta 

accounts.get('/contas/extrato', accountsUtils.checkAccountQuery, userAuth.verifyLoginQuery, controller.listarExtrato); // Lista toda movimentação da conta

module.exports = accounts