/**
 Aqui só pegamos a senha que está guardada no banco de dados 
 e verificamos atráves do AUTHENTICATOR autenticador.
 */
const senha = require('../database/bancodedados')
const password = senha.banco.senha

const bankAuth = (request, response, next) => {
    const {senha_banco} = request.query

    if(!senha_banco || senha_banco != password){
        return response.status(403).json({mensagem:'A senha do banco informada é inválida!'});
    };

    return next();
};

module.exports = bankAuth