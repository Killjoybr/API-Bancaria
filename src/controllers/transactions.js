const BANCO = require('../database/bancodedados');
const {contas} = BANCO;

const deposito = (request, response) => {
    const {numero_conta, valor} = request.body
    const contaEncontrada = contas.find( (conta) => {return conta.numero === Number(numero_conta);});
    const numeroConta = Number(numero_conta);
    const valorDeposito = Number(valor);
    const dataAtual = new Date();
    const dataAtualSTR = dataAtual.toString();
    const indiceConta = BANCO.contas.indexOf(contaEncontrada);

    if(!Number(numero_conta || !Number(valor))){
        return response.status(400).json({mensagem:'O número da conta e o valor são obrigatórios!'})
    };
    
    if(valorDeposito <= 0){
        return response.status(400).json({mensagem:'Valor do depósito inválido'});
    };
    

    const registroDeposito = {
        data: dataAtualSTR,
        numero_conta:numeroConta,
        valor: valorDeposito
    };
    
    const contaSaldo = {
        numero:numeroConta,
        saldo:contaEncontrada.saldo + valorDeposito,
        usuario:{
            nome:contaEncontrada.usuario.nome,
            cpf:contaEncontrada.usuario.cpf,
            data_nascimento:contaEncontrada.usuario.data_nascimento,
            telefone:contaEncontrada.usuario.telefone,
            email:contaEncontrada.usuario.email,
            senha:contaEncontrada.usuario.senha
        }
    };

    contas.splice(indiceConta,1, contaSaldo)
    BANCO.depositos.push(registroDeposito);

    return response.status(204).send()
};

const saque = (request, response) => {
    const {numero_conta, valor} = request.body
    const numeroConta = Number(numero_conta);
    const contaEncontrada = contas.find((conta) => {return conta.numero === numeroConta;});
    const valorSaque = Number(valor);
    
    if(!valorSaque || valorSaque <= 0){
        return response.status(400).json({mensagem:'O valor não pode ser menor que zero!'});
    };

    const contaSaque = {numero:numeroConta,saldo:contaEncontrada.saldo - valorSaque,usuario:{nome:contaEncontrada.usuario.nome,cpf:contaEncontrada.usuario.cpf,data_nascimento:contaEncontrada.usuario.data_nascimento,telefone:contaEncontrada.usuario.telefone,email:contaEncontrada.usuario.email,senha:contaEncontrada.usuario.senha}}
    if ((contaSaque.saldo - valorSaque) < 0) {
        return response.status(400).json({mensagem:'Saldo não disponível'});
    };

    const dataAtual = new Date()
    const dataAtualSTR = dataAtual.toString();
    const indiceConta = BANCO.contas.indexOf(contaEncontrada);
    const registroSaque = {data:dataAtualSTR,numero_conta:numeroConta,valor:valorSaque};
    


    contas.splice(indiceConta, 1, contaSaque)
    BANCO.saques.push(registroSaque);
    
    return response.status(204).send();
};

const transferencia = (request, response) => {
    const {numero_conta_origem, numero_conta_destino, valor, senha} = request.body
    const numeroOrigem = Number(numero_conta_origem);
    const numeroDestino = Number(numero_conta_destino);
    const numeroTransferencia = Number(valor);

    if(!numeroTransferencia || numeroTransferencia <= 0){
        return response.status(400).json({mensagem:'Valor de transferência inválido'})
    };

    const contaOrigem = contas.find((conta) => {return conta.numero === numeroOrigem});
    const contaDestino = contas.find((conta) => {return conta.numero === numeroDestino});
    
    if(!contaDestino || !contaOrigem){
        return response.status(404).json({mensagem:'Impossível fazer a transferência devido a ausência de uma ou mais contas'});
    };

    if((contaOrigem.saldo - valor) < 0){
        return response.status(400).json({mensagem:'Saldo insuficiente'});
    };

    const dataAtual = new Date()
    const dataAtualSTR = dataAtual.toString();
    const registroTransferencia = {
        data:dataAtualSTR,
        numero_conta_origem:numeroOrigem,
        numero_conta_destino:numeroDestino,
        valor: valor,
    };
    
    BANCO.transferencias.push(registroTransferencia);

    const contaPagadora = {
        numero:contaOrigem.numero,
        saldo:contaOrigem.saldo - valor,
        usuario:{
            nome:contaOrigem.usuario.nome,
            cpf:contaOrigem.usuario.cpf,
            data_nascimento:contaOrigem.usuario.data_nascimento,
            telefone:contaOrigem.usuario.telefone,
            email:contaOrigem.usuario.email,
            senha:contaOrigem.usuario.senha
        }
    };

    const contaReceptora = {
        numero:contaDestino.numero,
        saldo:contaDestino.saldo + valor,
        usuario:{
            nome:contaDestino.usuario.nome,
            cpf:contaDestino.usuario.cpf,
            data_nascimento:contaDestino.usuario.data_nascimento,
            telefone:contaDestino.usuario.telefone,
            email:contaDestino.usuario.email,
            senha:contaDestino.usuario.senha
        }
    };

    contas.splice(contas.indexOf(contaOrigem), 1, contaPagadora);
    contas.splice(contas.indexOf(contaDestino), 1, contaReceptora);

    return response.status(204).send();
};


module.exports = {
    deposito,
    saque,
    transferencia,
};