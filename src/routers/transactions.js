const express = require('express');
const transactions = express.Router();
const controller = require('../controllers/transactions');
const userAuth = require('../middlewares/userAuth');
const accountsUtils = require('../middlewares/accounts');


transactions.post('/transacoes/depositar', accountsUtils.checkAccountBody, controller.deposito); // Deposita dinheiro para alguma conta

transactions.post('/transacoes/sacar', accountsUtils.checkAccountBody, userAuth.verifyLoginBody, controller.saque); // Saca dinheiro de alguma conta

transactions.post('/transacoes/transferir', userAuth.verifyLoginTransfer, controller.transferencia); // Transferencia entre contas verificando se há saldo disponível e a senha do usuário está correta

module.exports = transactions