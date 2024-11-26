const express = require("express");
const app = express();
const Sequelize = require("sequelize");
const {engine} = require("express-handlebars");


//###Banco de dados###
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

  const mensalidades = conexaoComBanco.define("mensalidades", {
    valor_mensal: {
      type: Sequelize.INTEGER,//VARCHAR
    },
    categ: {
      type: Sequelize.STRING,//TEXTAREA
    },
    data_venc: {
        type: Sequelize.DATE,
    },
  });
  
  const pagamentos = conexaoComBanco.define("pagamentos", {
    data_pag: {
      type: Sequelize.DATE,//VARCHAR
    },
    valor_pag: {
      type: Sequelize.INTEGER,//TEXTAREA
    },
    id_clie: {
      type: Sequelize.INTEGER,
      references: { model: cliente, key: 'id' }
    },
    id_mensal: {
      type: Sequelize.INTEGER,
      references: { model: mensalidades, key: 'id' }
    },
  });


mensalidades.sync({force: false})
cliente.sync({force: false})
pagamentos.sync({force: false})


app.use(
  express.urlencoded({
    extended: true
  })
)
//###Rotas###


// ROTA DE LOGIN
app.get('/login', (req, res) => {
  res.render('login');
});

app.use(express.static('public'))

// ROTA DE INICIO
app.get('/home', (req, res) => {
  res.render('home');
});


///////////////////////////////////////////////////////////////////////////////////////////////////////

// CLIENTE

// salvar
app.get("/cliente", async function (req, res) {
  res.render("cliente")
});

app.post("/cliente", async function (req, res) {
    const { nome, tel, email, dt_cadastro } = req.body;

    const novoCliente = await cliente.create({ nome, tel, email, dt_cadastro }); //função que espera
  
    res.redirect("/home");
});

 


/////////////////////////////////////////////////////////////////////////////////////////////////////////

// MENSALIDADE

// salvar
app.post("/salvar-mensalidade", async function (req, res) {
  const { valor_mensal,categ, data_venc } = req.body;

  const novaMensalidade = await mensalidades.create({ valor_mensal,categ, data_venc }); //função que espera

  res.render("contratos");
});

//renderizer formulario
app.get('/contrato', async function (req, res) {
  res.render('contratos')
});

// MOSTRAR
app.get("/mensalidade", async function (req, res) {
  const mensalidade = await mensalidades.findAll({raw: true});
  res.render("mensalidade", {mensalidade: mensalidade})
}); 


// Editar mensalidade via ID, nome e idade como parâmetros
app.post("/editar-mensalidade", async function (req, res) {
  const { valor_mensal, categ, data_venc } = req.body;
  const idNumber = parseInt(id, 10); // Converte o ID para número
  
  const [updated] = await mensalidades.update(
    { valor_mensal, categ, data_venc },
    {
      where: { id: idNumber }, // Usa o ID numérico
    }
  )});

app.get("/edicao-mensalidade/:id", async function (req, res){
  const id = req.params.id
  const mensalidade = await mensalidades.findOne({raw: true, where: {id: id}});
  res.render("editar", {mensalidade: mensalidade})
});


// deletar
app.post("/deletar-mensalidade", async function (req, res) {
  const { id } = req.body;

  const deleted = await mensalidades.destroy({ raw: true, where: { id: id }});
  
  if (deleted) {
    res.redirect("/mensalidade");
  } else {
    res.status(404).redirect("/mensalidade");
  }
  });


/////////////////////////////////////////////////////////////////////////////////////////////////////////

// PAGAMENTOS

// salvar
app.post("/salvar-pagamento", async function (req, res) {
  const { data_pag, valor_pag, id_clie, id_mensal } = req.body;

  const novoPagamento = await pagamentos.create({ data_pag, valor_pag, id_clie, id_mensal }); //função que espera
s
  res.redirect("/calendario");
});


// MOSTRAR
app.get("/pagamentos", async function (req, res) {
  const calendario = await pagamentos.findAll({raw: true});
  res.render("calendario", {calendario: calendario})
}); 

// EDITAR pagamento via ID, nome e idade como parâmetros
app.get("/editar-pagamento", async function (req, res) {
  const { data_pag, valor_pag, id_clie, id_mensal } = req.body;
  const idNumber = parseInt(id, 10); // Converte o ID para número
  
  const [updated] = await pagamentos.update(
    { data_pag, valor_pag, id_clie, id_mensal },
    {
      where: { id: idNumber }, // Usa o ID numérico
    }
  )});

  app.get("/edicao-pagamento/:id", async function (req, res){
    const id = req.params.id
    const pagamento = await pagamentos.findOne({raw: true, where: {id: id}});
    res.render("editar-pag", {pagamento: pagamento})
  });


// comando que seta o handlebars
app.engine("handlebars", engine())
app.set("view engine", "handlebars")


//###Servidor###
app.listen(3031, function () {
    console.log("Server is running on port 3031");
});


  