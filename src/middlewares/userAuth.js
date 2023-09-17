const {contas} = require('../database/bancodedados');

const verifyLoginTransfer = (request, response, next) => {
    const {numero_conta_origem, senha} = request.body
    const contaEncontrada = contas.find( (conta) => {
        return conta.numero === Number(numero_conta_origem);
    });

    if(!contaEncontrada){
        return response.status(404).json({mensagem:'Conta não encontrada'});
    };

    if(contaEncontrada.usuario.senha !== senha){
        return response.status(401).json({mensagem:'ACESSO NEGADO!'});
    };

    next();
};

const verifyLoginBody = (request, response, next) => {
    const {numero_conta, senha} = request.body

    const contaEncontrada = contas.find((conta) => {return conta.numero === Number(numero_conta);});
    
    if(!contaEncontrada){
        return response.status(404).json({mensagem:'Conta não encontrada'});
    };

    if(contaEncontrada.usuario.senha !== senha){
        return response.status(400).json({mensagem:'ACESSO NEGADO!'});
    };

    next()
};

const verifyLoginQuery = (request, response, next) => {
    const {numero_conta, senha} = request.query

    const contaEncontrada = contas.find((conta) => {return conta.numero === Number(numero_conta);});

    if(!numero_conta || !senha){
        return response.status(400).json({mensagem:'Fornecer a senha e o número da conta é obrigatório'});
    };

    if(contaEncontrada.usuario.senha != senha){
        return response.status(403).json({mensagem:'ACESSO NEGADO'});
    };

    next();
};

module.exports = {
    verifyLoginTransfer,
    verifyLoginBody,
    verifyLoginQuery,
};