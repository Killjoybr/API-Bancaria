const express = require('express');
const accounts = express.Router();
const controller = require('../controllers/accounts');
const accountsUtils = require('../middlewares/accounts');


//Abaixo estão todas as operações que o banco pode utilizar

accounts.get('/contas', controller.listarContas); // lista todas as contas cadastradas dentro de um []

accounts.post('/contas', accountsUtils.duplicityCheck, controller.criarConta); // Operação que permite a criação de contas

accounts.put('/contas/:numeroConta/usuario', accountsUtils.checkAccountParams, controller.atualizarConta); // Atualiza uma conta com dados novos porém não muda o identificador

accounts.delete('/contas/:numeroConta', accountsUtils.checkAccountParams, controller.deletarConta); // Deleta uma conta do banco de dados e o identificador não poderá ser usado novamente


module.exports = accounts; // Exporta o roteador para ser utilizado no index.js