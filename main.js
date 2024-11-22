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
//###Rotas###
app.get("/", function (req, res) {
    res.send("Rota principal");
});

// CLIENTE
// salvar
app.post("/cliente", async function (req, res) {
    const { nome, tel, email, dt_cadastro } = req.body;

    const novoCliente = await cliente.create({ nome, tel, email, dt_cadastro }); //função que espera
  
    res.json({
      resposta: "cliente criado com sucesso",
      cliente: novoCliente,
    });
});

app.get("/cliente", async function (req, res) {
  res.render("cliente")
});

// deletar
app.post("/deletar-cliente", async function (req, res) {
  const { id } = req.body;
  const idNumber = parseInt(id, 10); // Converte o ID para número

  const deleted = await cliente.destroy({
    where: { id: idNumber },
  });

  if (deleted) {
    res.json({ mensagem: "Cliente deletado com sucesso" });
  } else {
    res.status(404).json({ mensagem: "Cliente não encontrado" });
  }
});

app.get("/deletar-cliente", async function (req, res) {
  res.render("deletar-cliente")
}); 


// Editar cliente via ID, nome e idade como parâmetros
app.post("/editar-cliente", async function (req, res) {
  const { id, nome, tel, email, dt_cadastro } = req.body;
  const idNumber = parseInt(id, 10); // Converte o ID para número

  const [updated] = await cliente.update(
    { id, nome, tel, email, dt_cadastro },
    {
      where: { id: idNumber }, // Usa o ID numérico
    }
  );

  res.json({
    mensagem: "Cliente atualizado com sucesso",
  });
});

app.get("/editar-cliente", async function (req, res) {
  res.render("editar-cliente")
}); 


// // Exibir todos os alunos
// app.get("/mostrar", async function (req, res) {
//   const clientes = await cliente.findAll(); // Busca todos os registros
//   res.json(clientes); // Retorna os registros em formato JSON
// });

// Exibir todos os alunos com tratativa de erros:


// app.get("/mostrar", async function (req, res) {
//   try {
//       const clientes = await cliente.findAll(); // Busca todos os registros
//       res.json(clientes); // Retorna os registros em formato JSON
//   } catch (error) {
//       res.status(500).json({ message: `Erro ao buscar clientes: ${error}` }); // Retorna erro ao cliente
//   }
// });

/////////////////////////////////////////////////////////////////////////////////////////////////////////

// MENSALIDADE

// salvar
app.post("/mensalidade", async function (req, res) {
  const { valor_mensal,categ, data_venc } = req.body;

  const novaMensalidade = await mensalidades.create({ valor_mensal,categ, data_venc }); //função que espera

  res.json({
    resposta: "mensalidade criada com sucesso",
    mensalidades: novaMensalidade,
  });
});

app.get("/mensalidade", async function (req, res) {
  res.render("mensalidade")
}); 

// deletar
app.post("/deletar-mensalidade", async function (req, res) {
const { id } = req.body;
const idNumber = parseInt(id, 10); // Converte o ID para número

const deleted = await mensalidades.destroy({
  where: { id: idNumber },
});

if (deleted) {
  res.json({ mensagem: "Mensalidade deletada com sucesso" });
} else {
  res.status(404).json({ mensagem: "Mensalidade não encontrada" });
}
});

app.get("/deletar-mensalidade", async function (req, res) {
  res.render("deletar-mensalidade")
}); 

// Editar mensalidade via ID, nome e idade como parâmetros
app.post("/editar-mensalidade", async function (req, res) {
const { valor_mensal, categ, data_venc } = req.body;
const idNumber = parseInt(id, 10); // Converte o ID para número

const [updated] = await cliente.update(
  { valor_mensal, categ, data_venc },
  {
    where: { id: idNumber }, // Usa o ID numérico
  }
);

res.json({
  mensagem: "mensalidade atualizada com sucesso",
});
});

app.get("/editar-mensalidade", async function (req, res) {
  res.render("editar")
}); 

// mostrar todas as mensalidades
app.get("/mensalidades", async function (req, res) {
  try {
      const mensalidade = await mensalidades.findAll(); // Busca todos os registros
      res.json(mensalidade); // Retorna os registros em formato JSON
  } catch (error) {
      res.status(500).json({ message: `Erro ao buscar mensalidade: ${error}` }); // Retorna erro ao cliente
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////

// PAGAMENTOS

// salvar
app.get("/pagamento", async function (req, res) {
  const { data_pag, valor_pag, id_clie, id_mensal } = req.body;

  const novoPagamento = await pagamentos.create({ data_pag, valor_pag, id_clie, id_mensal }); //função que espera

  res.json({
    resposta: "pagamento criada com sucesso",
    pagamentos: novoPagamento,
  });
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
);

res.json({
  mensagem: "pagamento atualizada com sucesso",
});
});

// MOSTRAR
app.get("/pagamentos", async function (req, res) {
  try {
      const pagamento = await pagamentos.findAll(); // Busca todos os registros
      res.json(pagamento); // Retorna os registros em formato JSON
  } catch (error) {
      res.status(500).json({ message: `Erro ao buscar pagamento: ${error}` }); // Retorna erro ao cliente
  }
});

// MOSTRAR TUDO DO CLIENTE
app.get("/mostrar", async function (req, res) {
  try {

    const pagamento = await pagamentos.findAll(); // Busca todos os registros
    const mensalidade = await mensalidades.findAll(); // Busca todos os registros
    res.json({pagamento, mensalidade}); // Retorna os registros em formato JSON

} catch (error) {
    res.status(500).json({ message: `Erro ao mostrar tudo: ${error}` }); // Retorna erro ao cliente
}

});

// comando que seta o handlebars
app.engine("handlebars", engine())
app.set("view engine", "handlebars")

//###Servidor###
app.listen(3031, function () {
    console.log("Server is running on port 3031");
});
