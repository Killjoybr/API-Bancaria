const express = require('express');
const transactions = require('./routers/transactions');
const userAccounts = require('./routers/userAccounts') ;
const bankAuth = require('./middlewares/bankAuth');
const bankAccounts = require('./routers/bankAccounts');
const app = express();
const port = 8000;
const appMessage = console.log(`App running on port: ${port}`);

app.use(express.json()); // Middleware nativo do express para trabalhar com json 
app.use(transactions); // Rotas para transação entre contas, deposito/saque ou extrato/saldo
app.use(userAccounts); // Rotas para checagem de saldo e extrato bancário por parte do usuário
app.use(bankAuth); // Middleware para verificar se a senha do banco está correta nas requisições
app.use(bankAccounts); // Rotas para manipulação das contas (Gerência do Banco)

app.listen(port, appMessage);