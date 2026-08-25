import React, { useEffect, useMemo, useState } from "react";

import Header from "./components/Header";
import Filtros from "./components/Filtros";
import ListaJogadores from "./components/ListaJogadores";
import Resumo from "./components/Resumo";
import Ranking from "./pages/Ranking";

import "./style.css";

function App() {
  const [jogadores, setJogadores] = useState([]);

  const [pesquisa, setPesquisa] = useState("");
  const [estrelas, setEstrelas] = useState("todas");
  const [tipo, setTipo] = useState("todos");

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [pagina, setPagina] = useState("dashboard");

  /* =========================
     CARREGAR JOGADORES
  ========================= */

  useEffect(() => {
    async function carregarJogadores() {
      try {
        const resposta = await fetch("/jogadores.txt");

        if (!resposta.ok) {
          throw new Error(
            "Não foi possível carregar jogadores.txt"
          );
        }

        const texto = await resposta.text();

        if (!texto.includes("PELADA_APP_V1")) {
          throw new Error(
            "Arquivo de jogadores inválido."
          );
        }

        const linhas = texto.split("\n");

        const jogadoresLidos = [];

        linhas.forEach((linha, index) => {
          const textoLinha = linha.trim();

          if (!textoLinha.startsWith("👤")) {
            return;
          }

          const partes = textoLinha
            .split("|")
            .map((parte) => parte.trim());

          if (partes.length < 5) {
            return;
          }

          const nome = partes[0]
            .replace("👤", "")
            .trim();

          const estrelas =
            Number(
              partes[1]
                .replace("⭐", "")
                .trim()
            ) || 0;

          const tipo = partes[2].toUpperCase();

          const gols =
            Number(
              partes[3]
                .replace("⚽", "")
                .trim()
            ) || 0;

          const assistencias =
            Number(
              partes[4]
                .replace("🅰️", "")
                .trim()
            ) || 0;

          jogadoresLidos.push({
            id: index,
            nome,
            estrelas,
            tipo,
            gols,
            assistencias,
          });
        });

        setJogadores(jogadoresLidos);

      } catch (error) {
        console.error(error);

        setErro(error.message);

      } finally {
        setCarregando(false);
      }
    }

    carregarJogadores();
  }, []);

  /* =========================
     FILTROS
  ========================= */

  const jogadoresFiltrados = useMemo(() => {
    return jogadores.filter((jogador) => {

      const nomeMatch =
        jogador.nome
          .toLowerCase()
          .includes(
            pesquisa.toLowerCase()
          );

      const estrelasMatch =
        estrelas === "todas" ||
        jogador.estrelas === Number(estrelas);

      const tipoMatch =
        tipo === "todos" ||
        jogador.tipo === tipo;

      return (
        nomeMatch &&
        estrelasMatch &&
        tipoMatch
      );
    });

  }, [
    jogadores,
    pesquisa,
    estrelas,
    tipo,
  ]);

  /* =========================
     CARREGANDO
  ========================= */

  if (carregando) {
    return (
      <div className="estado">
        <span>⚽</span>

        <h2>
          Carregando jogadores...
        </h2>
      </div>
    );
  }

  /* =========================
     ERRO
  ========================= */

  if (erro) {
    return (
      <div className="estado">
        <span>❌</span>

        <h2>
          Erro ao carregar jogadores
        </h2>

        <p>
          {erro}
        </p>
      </div>
    );
  }

  /* =========================
     RANKING
  ========================= */

  if (pagina === "ranking") {
    return (
      <div className="app">

        <Header
          total={jogadores.length}
          pagina={pagina}
          setPagina={setPagina}
        />

        <Ranking
          jogadores={jogadores}
        />

      </div>
    );
  }

  /* =========================
     DASHBOARD
  ========================= */

  return (
    <div className="app">

      <Header
        total={jogadores.length}
        pagina={pagina}
        setPagina={setPagina}
      />

      <main className="dashboard">

        {/* TÍTULO */}

        <div className="dashboard-title">

          <div>
            <span className="subtitle">
              GERENCIAMENTO
            </span>

            <h1>
              Jogadores
            </h1>
          </div>

          <div className="arquivo-info">
            📄 jogadores.txt
          </div>

        </div>

        {/* RESUMO */}

        <Resumo
          jogadores={jogadores}
        />

        {/* FILTROS */}

        <Filtros
          pesquisa={pesquisa}
          setPesquisa={setPesquisa}

          estrelas={estrelas}
          setEstrelas={setEstrelas}

          tipo={tipo}
          setTipo={setTipo}
        />

        {/* RESULTADO */}

        <div className="resultado-info">

          Mostrando{" "}

          <strong>
            {jogadoresFiltrados.length}
          </strong>

          {" "}de{" "}

          <strong>
            {jogadores.length}
          </strong>

          {" "}jogadores

        </div>

        {/* LISTA */}

        <ListaJogadores
          jogadores={jogadoresFiltrados}
        />

      </main>

    </div>
  );
}

export default App;