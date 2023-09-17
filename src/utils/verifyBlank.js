module.exports = verifyBlank = (nome, cpf, data_nascimento, telefone, email,senha) => {
    if(nome.trim().length <=0 || String(cpf).trim().length <= 0 || data_nascimento.trim().length <= 0 || telefone.trim().length <= 0 || email.trim().length <= 0 || senha.trim().length <= 0){
        return true
    } else {
        return false
    }
};