//import library
const Sequelize = require("sequelize");
//keys
const conexaoComBanco = new Sequelize("relatorio", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

const cliente = conexaoComBanco.define("cliente", {
    nome: {
      type: Sequelize.STRING,//VARCHAR
    },
    tel: {
      type: Sequelize.INTEGER,//TEXTAREA
    },
    email: {
        type: Sequelize.STRING,//TEXTAREA
      },
    dt_cadastro: {
        type: Sequelize.DATE,//TEXTAREA
    },
});


cliente.sync({force: false})

cliente.create({
    nome: 'Emily',
    tel: '981535927',
    email: 'emily@oli',
    dt_cadastro: '2024-10-25'
});