const BANCO = require('../database/bancodedados');
const verifyBlank = require('../utils/verifyBlank');
const {contas} = BANCO;

const listarContas = (request, response) => {
    response.status(200).json(contas);
};

const criarConta = (request, response) => {
    const {nome, cpf, data_nascimento, telefone, email, senha} = request.body
    let identificador = BANCO.numero
   
    if(verifyBlank(nome,cpf,data_nascimento,telefone,email,senha)){
      return response.status(400).json({mensagem:'Não preencha os campos apenas '});
    };

    contas.push({
        numero:identificador,
        saldo:0,
        usuario:{
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    });

    BANCO.numero = identificador + 1

    return response.status(201).json(`Obrigado por juntar-se a CubosBank ${nome}, aqui seu dinheiro rende ao CUBO`);
};

const atualizarConta = (request, response) => {
    const {nome, cpf, data_nascimento, telefone, email, senha} = request.body
    const {numeroConta} = request.params
    const contaEncontrada = contas.find( (conta) => {return conta.numero === Number(numeroConta);});
    const indiceContaEncontrada = BANCO.contas.indexOf(contaEncontrada)

    if(!contaEncontrada){
        return response.status(404).json({mensagem:'Conta não encontrada, impossível atualizar'});
    };
    
    if(cpf){
        const conta = contas.find( (conta) => {return conta.usuario.cpf === cpf});
        if(conta){
            return response.status(400).json({mensagem:'CPF já cadastrado, caso queira mudar outros valores apague o CPF e tente novamente'});
        };
    };
    
    if(email){
        const conta = contas.find( (conta) => {return conta.usuario.email === email});
        if(conta){
            return response.status(400).json({mensagem:'E-mail já cadastrado, caso queira mudar outros valores apague o e-mail e tente novamente'});
        };
    };     

    if(verifyBlank(nome,cpf,data_nascimento,telefone,email,senha)){
        return response.status(400).json({mensagem:'Não preencha os campos apenas com espaços em branco'});
    };
    

    const contaAlterada = {
        numero:contaEncontrada.numero,
        saldo:contaEncontrada.saldo,
        usuario:{
            nome:nome ?? contaEncontrada.usuario.nome,
            cpf: cpf ?? contaEncontrada.usuario.cpf,
            data_nascimento: data_nascimento ?? contaEncontrada.usuario.data_nascimento,
            telefone:telefone ?? contaEncontrada.usuario.telefone,
            email:email ?? contaEncontrada.usuario.email,
            senha: senha ?? contaEncontrada.usuario.senha
        }
    };

    BANCO.contas.splice(indiceContaEncontrada, 1, contaAlterada);

    return response.status(204).send();
};

const deletarConta = (request, response) => {
    const {numeroConta} = request.params

    const contaEncontrada = contas.find((conta) => {return conta.numero === Number(numeroConta);});

    if(!contaEncontrada){
        return response.status(404).json({mensagem:'Conta não encontrada, impossível deletar'});
    };

    if(Number(numeroConta) <= 0 || !Number(numeroConta)){
        return response.status(400).json({mensagem:'O número fornecido é inválido'});
    };

    BANCO.contas.splice(contas.indexOf(contaEncontrada), 1);

    return response.status(204).send()
};

const listarSaldo = (request,response) => {
    const {numero_conta} = request.query
    const contaEncontrada = contas.find( (conta) => {return conta.numero === Number(numero_conta)});

    const saldo = contaEncontrada.saldo

    return response.status(200).json(saldo)
};

const listarExtrato = (request, response) => {
    const {numero_conta} = request.query
    const extratoConta = []


    const transferencias = BANCO.transferencias.filter( (transferencias) => {
        return transferencias.numero_conta_origem == Number(numero_conta) || transferencias.numero_conta_destino == Number(numero_conta)
    });
    const depositos = BANCO.depositos.filter( (depositos) => {
        return depositos.numero_conta === Number(numero_conta)
    });
    const saques = BANCO.saques.filter( (saque) => {
        return saque.numero_conta === Number(numero_conta)
    });


    extratoConta.push({transferencias:transferencias},{depositos:depositos},{saques:saques});

    return response.status(200).json(extratoConta)
};

module.exports = {
    listarContas,
    criarConta,
    atualizarConta,
    deletarConta,
    listarSaldo,
    listarExtrato,
};