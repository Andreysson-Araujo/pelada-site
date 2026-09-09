import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import Header from "./components/Header/Header";
import Filtros from "./components/Filtros/Filtros";
import ListaJogadores from "./components/ListaJogadores/ListaJogadores";
import Resumo from "./components/Resumo";
import Ranking from "./pages/Ranking";
import Timer from "./components/Timer/Timer";
import TimerFlutuante from "./components/Timer/TimerFlutuante";
import CardsPage from "./pages/Cards/CardsPage";
import PeladaPage from "./pages/Pelada/PeladaPage";

import { listarJogadores } from "./services/jogadoresApi";
import { gerarListaJogadores } from "./services/exportarJogadores";

import "./style.css";


function App() {

  const [jogadores, setJogadores] = useState([]);

  const [pesquisa, setPesquisa] = useState("");

  const [estrelas, setEstrelas] =
    useState("todas");

  const [tipo, setTipo] =
    useState("todos");

  const [ordem, setOrdem] =
    useState("recentes");

  const [carregando, setCarregando] =
    useState(true);

  const [erro, setErro] =
    useState("");

  const [pagina, setPagina] =
    useState("dashboard");


  // ==================================================
  // TIMER
  // ==================================================

  const [duracao, setDuracao] =
    useState(10);

  const [tempo, setTempo] =
    useState(10 * 60);

  const [rodando, setRodando] =
    useState(false);

  const [acrescimos, setAcrescimos] =
    useState(0);

  const [modoAcrescimo, setModoAcrescimo] =
    useState(false);


  // ==================================================
  // CRONÔMETRO
  // ==================================================

  useEffect(() => {

    if (!rodando) {
      return;
    }

    const intervalo =
      setInterval(() => {

        setTempo((tempoAtual) => {

          if (tempoAtual > 0) {
            return tempoAtual - 1;
          }

          setRodando(false);
          setModoAcrescimo(true);

          return 0;

        });

      }, 1000);


    return () => {
      clearInterval(intervalo);
    };

  }, [rodando]);


  // ==================================================
  // SELECIONAR DURAÇÃO
  // ==================================================

  function selecionarDuracao(minutos) {

    setDuracao(minutos);

    setTempo(minutos * 60);

    setRodando(false);

    setModoAcrescimo(false);

    setAcrescimos(0);

  }


  // ==================================================
  // INICIAR
  // ==================================================

  function iniciar() {

    setRodando(true);

  }


  // ==================================================
  // PAUSAR
  // ==================================================

  function pausar() {

    setRodando(false);

  }


  // ==================================================
  // REINICIAR
  // ==================================================

  function reiniciar() {

    setTempo(duracao * 60);

    setRodando(false);

    setModoAcrescimo(false);

    setAcrescimos(0);

  }


  // ==================================================
  // ADICIONAR ACRÉSCIMO
  // ==================================================

  function adicionarAcrescimo(minutos) {

    setAcrescimos(
      (atual) =>
        atual + minutos
    );

    setTempo(
      (atual) =>
        atual + minutos * 60
    );

    setModoAcrescimo(true);

    setRodando(true);

  }


  // ==================================================
  // CARREGAR JOGADORES
  // ==================================================

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

        setJogadores(
          jogadoresLidos
        );

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


  // ==================================================
  // ATUALIZAR JOGADOR
  // ==================================================

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
                Number(
                  resultado.assistencias
                ) || 0,
            };

          }
        );

      }
    );

  }


  // ==================================================
  // EXPORTAR LISTA
  // ==================================================

  async function exportarLista() {

    try {

      const texto =
        gerarListaJogadores(
          jogadores
        );


      if (
        navigator.share &&
        /Android|iPhone|iPad|iPod/i.test(
          navigator.userAgent
        )
      ) {

        await navigator.share({
          title: "Pelada App",
          text: texto,
        });

        return;

      }


      await navigator.clipboard.writeText(
        texto
      );


      alert(
        "Lista copiada! Agora é só colar no WhatsApp."
      );

    } catch (error) {

      if (
        error?.name ===
        "AbortError"
      ) {

        return;

      }

      console.error(
        "ERRO AO EXPORTAR LISTA:",
        error
      );

      alert(
        "Não foi possível exportar a lista."
      );

    }

  }


  // ==================================================
  // FILTROS
  // ==================================================

  const jogadoresFiltrados =
    useMemo(() => {

      const filtrados =
        jogadores.filter(
          (jogador) => {

            const nomeMatch =
              jogador.nome
                ?.toLowerCase()
                .includes(
                  pesquisa.toLowerCase()
                );


            const estrelasMatch =
              estrelas === "todas" ||
              Number(jogador.estrelas) ===
              Number(estrelas);


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
              tipoJogador ===
              tipoSelecionado;


            return (
              nomeMatch &&
              estrelasMatch &&
              tipoMatch
            );

          }
        );


      return [...filtrados].sort(
        (a, b) => {

          if (
            ordem === "recentes"
          ) {

            return (
              b.ordemCadastro -
              a.ordemCadastro
            );

          }


          if (
            ordem === "antigos"
          ) {

            return (
              a.ordemCadastro -
              b.ordemCadastro
            );

          }


          if (
            ordem === "az"
          ) {

            return a.nome.localeCompare(
              b.nome,
              "pt-BR"
            );

          }


          if (
            ordem === "za"
          ) {

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
      ordem
    ]);


  // ==================================================
  // CARREGANDO
  // ==================================================

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


  // ==================================================
  // ERRO
  // ==================================================

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


  // ==================================================
  // TIMER
  // ==================================================

  if (pagina === "timer") {

    return (
      <div className="app">

        <Header
          total={jogadores.length}
          pagina={pagina}
          setPagina={setPagina}
        />


        <Timer

          duracao={duracao}

          tempo={tempo}

          rodando={rodando}

          acrescimos={acrescimos}

          modoAcrescimo={
            modoAcrescimo
          }

          selecionarDuracao={
            selecionarDuracao
          }

          iniciar={iniciar}

          pausar={pausar}

          reiniciar={reiniciar}

          adicionarAcrescimo={
            adicionarAcrescimo
          }

        />

      </div>
    );

  }


  // ==================================================
  // RANKING
  // ==================================================

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


        <TimerFlutuante

          tempo={tempo}

          rodando={rodando}

          modoAcrescimo={
            modoAcrescimo
          }

          setPagina={setPagina}

          pausar={pausar}

          iniciar={iniciar}

        />

      </div>
    );

  }


  // ==================================================
  // CARDS
  // ==================================================

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


        <TimerFlutuante

          tempo={tempo}

          rodando={rodando}

          modoAcrescimo={
            modoAcrescimo
          }

          setPagina={setPagina}

          pausar={pausar}

          iniciar={iniciar}

        />

      </div>
    );

  }


  // ==================================================
  // PELADA
  // ==================================================

  if (pagina === "pelada") {

    return (
      <div className="app">

        <Header
          total={jogadores.length}
          pagina={pagina}
          setPagina={setPagina}
        />

        <PeladaPage
          jogadores={jogadores}
        />


        <TimerFlutuante

          tempo={tempo}

          rodando={rodando}

          modoAcrescimo={
            modoAcrescimo
          }

          setPagina={setPagina}

          pausar={pausar}

          iniciar={iniciar}

        />

      </div>
    );

  }


  // ==================================================
  // DASHBOARD / JOGADORES
  // ==================================================

  return (
    <div className="app">

      <Header
        total={jogadores.length}
        pagina={pagina}
        setPagina={setPagina}
      />


      <main className="dashboard">

        <div className="dashboard-title">

          <div>

            <span className="subtitle">
              GERENCIAMENTO
            </span>

            <h1>
              Jogadores
            </h1>

          </div>


          <div className="dashboard-acoes">

            <div className="arquivo-info">
              ☁️ Google Sheets
            </div>


            <button
              type="button"
              className="botao-exportar"
              onClick={exportarLista}
            >
              📋 Exportar lista
            </button>

          </div>

        </div>


        <Resumo
          jogadores={jogadores}
        />


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


        <ListaJogadores

          jogadores={
            jogadoresFiltrados
          }

          onAtualizarJogador={
            atualizarJogador
          }

        />

      </main>


      <TimerFlutuante

        tempo={tempo}

        rodando={rodando}

        modoAcrescimo={
          modoAcrescimo
        }

        setPagina={setPagina}

        pausar={pausar}

        iniciar={iniciar}

      />

    </div>
  );

}


export default App;