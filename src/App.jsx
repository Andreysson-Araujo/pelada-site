import React, { useEffect, useMemo, useState } from "react";

import Header from "./components/Header/Header";
import Filtros from "./components/Filtros/Filtros";
import ListaJogadores from "./components/ListaJogadores/ListaJogadores";
import Resumo from "./components/Resumo";
import Ranking from "./pages/Ranking";
import Timer from "./components/Timer/Timer";
import CardsPage from "./pages/Cards/CardsPage";

import { listarJogadores } from "./services/jogadoresApi";

import "./style.css";


function App() {

  const [jogadores, setJogadores] = useState([]);

  const [pesquisa, setPesquisa] = useState("");

  const [estrelas, setEstrelas] = useState("todas");

  const [tipo, setTipo] = useState("todos");

  const [ordem, setOrdem] = useState("recentes");

  const [carregando, setCarregando] = useState(true);

  const [erro, setErro] = useState("");

  const [pagina, setPagina] = useState("dashboard");


  /* =========================
     CARREGAR JOGADORES
  ========================= */

  useEffect(() => {

    async function carregarJogadores() {

      try {

        setCarregando(true);

        setErro("");

        const jogadoresLidos =
          await listarJogadores();

        console.log(
          "JOGADORES CARREGADOS DA PLANILHA:",
          jogadoresLidos
        );

        setJogadores(jogadoresLidos);

      } catch (error) {

        console.error(
          "ERRO AO CARREGAR JOGADORES:",
          error
        );

        setErro(
          error.message ||
          "Não foi possível carregar os jogadores."
        );

      } finally {

        setCarregando(false);

      }

    }

    carregarJogadores();

  }, []);


  /* =========================
     ATUALIZAR JOGADOR
  ========================= */

  function atualizarJogador(resultado) {

    setJogadores(
      (jogadoresAtuais) => {

        return jogadoresAtuais.map(
          (jogador) => {

            if (
              String(jogador.id) !==
              String(resultado.id)
            ) {

              return jogador;

            }

            return {

              ...jogador,

              gols:
                Number(resultado.gols) || 0,

              assistencias:
                Number(resultado.assistencias) || 0,

            };

          }
        );

      }
    );

  }


  /* =========================
     FILTROS + ORDENAÇÃO
  ========================= */

  const jogadoresFiltrados = useMemo(() => {

    const filtrados = jogadores.filter(
      (jogador) => {

        /* =========================
           PESQUISA
        ========================= */

        const nomeMatch =
          jogador.nome
            ?.toLowerCase()
            .includes(
              pesquisa.toLowerCase()
            );


        /* =========================
           ESTRELAS
        ========================= */

        const estrelasMatch =
          estrelas === "todas" ||
          jogador.estrelas === Number(estrelas);


        /* =========================
           TIPO
        ========================= */

        const tipoJogador =
          jogador.tipo
            ?.trim()
            .toUpperCase();

        const tipoSelecionado =
          tipo
            ?.trim()
            .toUpperCase();

        const tipoMatch =
          tipoSelecionado === "TODOS" ||
          tipoJogador === tipoSelecionado;


        return (
          nomeMatch &&
          estrelasMatch &&
          tipoMatch
        );

      }
    );


    /* =========================
       ORDENAÇÃO
    ========================= */

    return [...filtrados].sort(
      (a, b) => {

        /* MAIS RECENTES */

        if (ordem === "recentes") {

          return (
            b.ordemCadastro -
            a.ordemCadastro
          );

        }


        /* MAIS ANTIGOS */

        if (ordem === "antigos") {

          return (
            a.ordemCadastro -
            b.ordemCadastro
          );

        }


        /* A-Z */

        if (ordem === "az") {

          return a.nome.localeCompare(
            b.nome,
            "pt-BR"
          );

        }


        /* Z-A */

        if (ordem === "za") {

          return b.nome.localeCompare(
            a.nome,
            "pt-BR"
          );

        }


        return 0;

      }
    );

  }, [
    jogadores,
    pesquisa,
    estrelas,
    tipo,
    ordem,
  ]);


  /* =========================
     CARREGANDO
  ========================= */

  if (carregando) {

    return (

      <div className="estado">

        <span>
          ⚽
        </span>

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

        <span>
          ❌
        </span>

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
     TIMER
  ========================= */

  if (pagina === "timer") {

    return (

      <div className="app">

        <Header
          total={jogadores.length}
          pagina={pagina}
          setPagina={setPagina}
        />

        <Timer />

      </div>

    );

  }


  /* =========================
     CARDS
  ========================= */

  if (pagina === "cards") {

    return (

      <div className="app">

        <Header
          total={jogadores.length}
          pagina={pagina}
          setPagina={setPagina}
        />

        <CardsPage
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


        {/* =========================
            TÍTULO
        ========================= */}

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

            ☁️ Google Sheets

          </div>

        </div>


        {/* =========================
            RESUMO
        ========================= */}

        <Resumo
          jogadores={jogadores}
        />


        {/* =========================
            FILTROS
        ========================= */}

        <Filtros
          pesquisa={pesquisa}
          setPesquisa={setPesquisa}

          estrelas={estrelas}
          setEstrelas={setEstrelas}

          tipo={tipo}
          setTipo={setTipo}

          ordem={ordem}
          setOrdem={setOrdem}
        />


        {/* =========================
            RESULTADO
        ========================= */}

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


        {/* =========================
            LISTA
        ========================= */}

        <ListaJogadores
          jogadores={jogadoresFiltrados}
          onAtualizarJogador={
            atualizarJogador
          }
        />


      </main>

    </div>

  );

}


export default App;