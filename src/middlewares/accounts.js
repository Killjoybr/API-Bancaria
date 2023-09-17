const BANCO = require('../database/bancodedados');
const {contas} = BANCO

const duplicityCheck = (request, response, next) => {
    const {nome, cpf, data_nascimento, telefone, email, senha} = request.body
    const cpf_existente = contas.find( (conta) => {return conta.usuario.cpf === cpf;});
    const email_existente = contas.find( (conta) => {return conta.usuario.email === email;});
    
    if(!nome || !cpf || !data_nascimento || !telefone || !email || !senha){
        return response.status(400).json('É necessário fornecer todos os dados da conta');
    };

    if (verifyBlank(nome,cpf,data_nascimento,telefone,email,senha)) {
        return response.status(400).json({mensagem:'Não preencha os campos apenas com espaço em branco!'})
    }; 
    
    if(cpf_existente){
        return response.status(400).json('CPF já cadastrado, para solicitar outro acesso entre em contato na unidade mais próxima');
    };

    if(email_existente){
        return response.status(400).json('E-mail já cadastrado, para solicitar outro acesso entre em contato no estabelecimento mais próximo');
    };

    next()
};

const checkAccountParams = (request, response, next) => {
    const {numeroConta} = request.params
    const contaEncontrada = contas.find( (conta) => {return conta.numero === Number(numeroConta);});

    if(!contaEncontrada){
        return response.status(404).json({mensagem:'Conta não encontrada'});
    };

    next()
};

const checkAccountBody = (request, response, next) => {
    const {numero_conta} = request.body
    const contaEncontrada = contas.find( (conta) => {return conta.numero === Number(numero_conta);});

    if(!contaEncontrada){
        return response.status(404).json({mensagem:'Conta não encontrada'});
    };

    next()
};

const checkAccountQuery = (request, response, next) => {
    const {numero_conta} = request.query
    const contaEncontrada = contas.find( (conta) => {return conta.numero === Number(numero_conta);});

    if(!contaEncontrada){
        return response.status(404).json({mensagem:'Conta não encontrada'});
    };

    next()
};

module.exports = {
    duplicityCheck,
    checkAccountParams,
    checkAccountBody,
    checkAccountQuery,
}