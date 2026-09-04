import React, { useEffect, useMemo, useState } from "react";

import "./CardsPage.css";

import { calcularOVRJogador } from "./cardUtils";

function CardsPage({ jogadores }) {

  // =====================================================
  // ESTADOS DOS CARDS
  // =====================================================

  const [cards, setCards] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // =====================================================
  // ESTADOS DOS FILTROS
  // =====================================================

  const [pesquisa, setPesquisa] = useState("");

  const [ovrMinimo, setOvrMinimo] = useState("todos");

  const [atributoFiltro, setAtributoFiltro] = useState("todos");

  const [atributoMinimo, setAtributoMinimo] = useState("todos");

  const [ordenacao, setOrdenacao] = useState("cadastro");

  // =====================================================
  // CARREGAR CARDS.TXT
  // =====================================================

  useEffect(() => {

    async function carregarCards() {

      try {

        setCarregando(true);
        setErro("");

        const resposta = await fetch("/cards.txt");

        if (!resposta.ok) {
          throw new Error(
            "Não foi possível carregar cards.txt"
          );
        }

        const texto = await resposta.text();

        // =================================================
        // VALIDAR ARQUIVO
        // =================================================

        if (!texto.includes("PELADA_CARDS_V1")) {

          throw new Error(
            "Arquivo cards.txt inválido."
          );

        }

        const linhas = texto.split("\n");

        const cardsLidos = [];

        // =================================================
        // LER CARDS
        // =================================================

        linhas.forEach((linha) => {

          const textoLinha = linha.trim();

          // Ignora títulos, separadores e linhas vazias
          if (!textoLinha.startsWith("🆔")) {
            return;
          }

          const partes = textoLinha
            .split("|")
            .map((parte) => parte.trim());

          if (partes.length < 6) {

            console.warn(
              "Linha de card inválida:",
              textoLinha
            );

            return;
          }

          // =================================================
          // ID
          // =================================================

          const id = partes[0]
            .replace("🆔", "")
            .trim();

          if (!id) {

            console.warn(
              "Card sem ID:",
              textoLinha
            );

            return;
          }

          // =================================================
          // ATAQUE
          // =================================================

          const ataque =
            Number(
              partes[1]
                .replace("ATA", "")
                .trim()
            ) || 0;

          // =================================================
          // DEFESA
          // =================================================

          const defesa =
            Number(
              partes[2]
                .replace("DEF", "")
                .trim()
            ) || 0;

          // =================================================
          // VELOCIDADE
          // =================================================

          const velocidade =
            Number(
              partes[3]
                .replace("VEL", "")
                .trim()
            ) || 0;

          // =================================================
          // PASSE
          // =================================================

          const passe =
            Number(
              partes[4]
                .replace("PAS", "")
                .trim()
            ) || 0;

          // =================================================
          // DRIBLE
          // =================================================

          const drible =
            Number(
              partes[5]
                .replace("DRI", "")
                .trim()
            ) || 0;

          // =================================================
          // ADICIONAR CARD
          // =================================================

          cardsLidos.push({
            id,
            ataque,
            defesa,
            velocidade,
            passe,
            drible
          });

        });

        console.log(
          "CARDS LIDOS:",
          cardsLidos
        );

        // =================================================
        // VINCULAR JOGADORES COM CARDS
        // =================================================

        const jogadoresComCards = jogadores.map(
          (jogador) => {

            const card = cardsLidos.find(
              (item) =>
                item.id === jogador.id
            );

            return {

              ...jogador,

              atributos: card
                ? {
                  ataque: card.ataque,
                  defesa: card.defesa,
                  velocidade: card.velocidade,
                  passe: card.passe,
                  drible: card.drible
                }
                : {
                  ataque: 0,
                  defesa: 0,
                  velocidade: 0,
                  passe: 0,
                  drible: 0
                }

            };

          }
        );

        console.log(
          "JOGADORES + CARDS:",
          jogadoresComCards
        );

        setCards(jogadoresComCards);

      } catch (error) {

        console.error(
          "Erro ao carregar cards:",
          error
        );

        setErro(
          error.message ||
          "Não foi possível carregar os cards."
        );

      } finally {

        setCarregando(false);

      }

    }

    carregarCards();

  }, [jogadores]);

  // =====================================================
  // FOTO DO JOGADOR
  // =====================================================

  function obterFotoJogador(jogador) {

    // Exemplo:
    // 001 -> /fotos/001.png
    // 002 -> /fotos/002.png

    return `/fotos/${jogador.id}.png`;

  }

  // =====================================================
  // LIMPAR FILTROS
  // =====================================================

  function limparFiltros() {

    setPesquisa("");

    setOvrMinimo("todos");

    setAtributoFiltro("todos");

    setAtributoMinimo("todos");

    setOrdenacao("cadastro");

  }

  // =====================================================
  // FILTRAR E ORDENAR CARDS
  // =====================================================

  const cardsFiltrados = useMemo(() => {

    let resultado = [...cards];

    // ===================================================
    // PESQUISA
    // ===================================================

    if (pesquisa.trim() !== "") {

      const termo = pesquisa
        .toLowerCase()
        .trim();

      resultado = resultado.filter(
        (jogador) => {

          const nome =
            jogador.nome?.toLowerCase() || "";

          const id =
            jogador.id?.toString() || "";

          return (
            nome.includes(termo) ||
            id.includes(termo)
          );

        }
      );

    }

    // ===================================================
    // OVR MÍNIMO
    // ===================================================

    if (ovrMinimo !== "todos") {

      const minimo =
        Number(ovrMinimo);

      resultado = resultado.filter(
        (jogador) => {

          const ovr =
            calcularOVRJogador(jogador);

          return ovr >= minimo;

        }
      );

    }

    // ===================================================
    // ATRIBUTO MÍNIMO
    // ===================================================

    if (
      atributoFiltro !== "todos" &&
      atributoMinimo !== "todos"
    ) {

      const minimo =
        Number(atributoMinimo);

      resultado = resultado.filter(
        (jogador) => {

          const valor =
            Number(
              jogador.atributos?.[
              atributoFiltro
              ] || 0
            );

          return valor >= minimo;

        }
      );

    }

    // ===================================================
    // ORDENAÇÃO
    // ===================================================

    resultado.sort((a, b) => {

      switch (ordenacao) {

        // -----------------------------------------------
        // NOME A-Z
        // -----------------------------------------------

        case "nomeAsc":

          return (a.nome || "")
            .localeCompare(
              b.nome || "",
              "pt-BR",
              {
                sensitivity: "base"
              }
            );

        // -----------------------------------------------
        // NOME Z-A
        // -----------------------------------------------

        case "nomeDesc":

          return (b.nome || "")
            .localeCompare(
              a.nome || "",
              "pt-BR",
              {
                sensitivity: "base"
              }
            );

        // -----------------------------------------------
        // OVR MAIOR
        // -----------------------------------------------

        case "ovrDesc":

          return (
            calcularOVRJogador(b) -
            calcularOVRJogador(a)
          );

        // -----------------------------------------------
        // OVR MENOR
        // -----------------------------------------------

        case "ovrAsc":

          return (
            calcularOVRJogador(a) -
            calcularOVRJogador(b)
          );

        // -----------------------------------------------
        // ID CRESCENTE
        // -----------------------------------------------

        case "idAsc":

          return (
            Number(a.id) -
            Number(b.id)
          );

        // -----------------------------------------------
        // ID DECRESCENTE
        // -----------------------------------------------

        case "idDesc":

          return (
            Number(b.id) -
            Number(a.id)
          );

        // -----------------------------------------------
        // CADASTRO CRESCENTE
        // -----------------------------------------------

        case "cadastro":

          return (
            Number(a.ordemCadastro || 0) -
            Number(b.ordemCadastro || 0)
          );

        // -----------------------------------------------
        // CADASTRO DECRESCENTE
        // -----------------------------------------------

        case "cadastroDesc":

          return (
            Number(b.ordemCadastro || 0) -
            Number(a.ordemCadastro || 0)
          );

        default:

          return 0;

      }

    });

    return resultado;

  }, [
    cards,
    pesquisa,
    ovrMinimo,
    atributoFiltro,
    atributoMinimo,
    ordenacao
  ]);

  // =====================================================
  // CARREGANDO
  // =====================================================

  if (carregando) {

    return (

      <main className="cards-page">

        <div className="cards-estado">

          <span>🃏</span>

          <h2>
            Carregando cards...
          </h2>

        </div>

      </main>

    );

  }

  // =====================================================
  // ERRO
  // =====================================================

  if (erro) {

    return (

      <main className="cards-page">

        <div className="cards-estado">

          <span>❌</span>

          <h2>
            Erro ao carregar cards
          </h2>

          <p>
            {erro}
          </p>

        </div>

      </main>

    );

  }

  // =====================================================
  // PÁGINA
  // =====================================================

  return (

    <main className="cards-page">

      {/* =================================================
          CABEÇALHO
      ================================================= */}

      <div className="cards-header">

        <div>

          <span className="cards-subtitle">
            PELADA APP
          </span>

          <h1>
            🃏 Cards dos Jogadores
          </h1>

          <p>
            {cardsFiltrados.length} de{" "}
            {cards.length} cards
          </p>

        </div>

        <div className="cards-arquivo">
          📄 cards.txt
        </div>

      </div>

      {/* =================================================
          FILTROS
      ================================================= */}

      <div className="cards-filtros">

        {/* PESQUISA */}

        <div className="filtro-grupo filtro-pesquisa">

          <label>
            🔎 Pesquisar jogador
          </label>

          <input
            type="text"
            placeholder="Nome ..."
            value={pesquisa}
            onChange={(evento) =>
              setPesquisa(evento.target.value)
            }
          />

        </div>

        {/* OVR */}

        <div className="filtro-grupo">

          <label>
            ⭐ OVR mínimo
          </label>

          <select
            value={ovrMinimo}
            onChange={(evento) =>
              setOvrMinimo(evento.target.value)
            }
          >

            <option value="todos">
              Todos
            </option>

            <option value="10">
              10+
            </option>

            <option value="20">
              20+
            </option>

            <option value="30">
              30+
            </option>

            <option value="40">
              40+
            </option>

            <option value="50">
              50+
            </option>

            <option value="60">
              60+
            </option>

            <option value="70">
              70+
            </option>

            <option value="80">
              80+
            </option>

            <option value="90">
              90+
            </option>

          </select>

        </div>

        {/* ATRIBUTO */}

        <div className="filtro-grupo">

          <label>
            📊 Atributo
          </label>

          <select
            value={atributoFiltro}
            onChange={(evento) => {

              setAtributoFiltro(
                evento.target.value
              );

              setAtributoMinimo("todos");

            }}
          >

            <option value="todos">
              Todos
            </option>

            <option value="ataque">
              ATA
            </option>

            <option value="defesa">
              DEF
            </option>

            <option value="velocidade">
              VEL
            </option>

            <option value="passe">
              PAS
            </option>

            <option value="drible">
              DRI
            </option>

          </select>

        </div>

        {/* VALOR DO ATRIBUTO */}

        <div className="filtro-grupo">

          <label>
            📈 Valor mínimo
          </label>

          <select
            value={atributoMinimo}
            onChange={(evento) =>
              setAtributoMinimo(
                evento.target.value
              )
            }
            disabled={
              atributoFiltro === "todos"
            }
          >

            <option value="todos">
              Todos
            </option>

            <option value="10">
              10+
            </option>

            <option value="20">
              20+
            </option>

            <option value="25">
              25+
            </option>

            <option value="30">
              30+
            </option>

            <option value="35">
              35+
            </option>

            <option value="40">
              40+
            </option>

            <option value="50">
              50+
            </option>

          </select>

        </div>

        {/* ORDENAÇÃO */}

        <div className="filtro-grupo">

          <label>
            🔤 Ordenar por
          </label>

          <select
            value={ordenacao}
            onChange={(evento) =>
              setOrdenacao(evento.target.value)
            }
          >

            <option value="cadastro">
              Cadastro ↑
            </option>

            <option value="cadastroDesc">
              Cadastro ↓
            </option>

            <option value="nomeAsc">
              Nome A → Z
            </option>

            <option value="nomeDesc">
              Nome Z → A
            </option>

            <option value="ovrDesc">
              OVR maior → menor
            </option>

            <option value="ovrAsc">
              OVR menor → maior
            </option>

            <option value="idAsc">
              ID crescente
            </option>

            <option value="idDesc">
              ID decrescente
            </option>

          </select>

        </div>

        {/* LIMPAR */}

        <button
          className="botao-limpar-filtros"
          onClick={limparFiltros}
          type="button"
        >
          🔄 Limpar
        </button>

      </div>

      {/* =================================================
          RESULTADO VAZIO
      ================================================= */}

      {cardsFiltrados.length === 0 ? (

        <div className="cards-estado">

          <span>🔎</span>

          <h2>
            Nenhum jogador encontrado
          </h2>

          <p>
            Tente alterar os filtros ou a pesquisa.
          </p>

        </div>

      ) : (

        /* =================================================
           GRID DOS CARDS
        ================================================= */

        <div className="cards-grid">

          {cardsFiltrados.map((jogador) => {

            const ovr =
              calcularOVRJogador(jogador);

            return (

              <div
                className="card-jogador"
                key={jogador.id}
              >

                {/* =========================================
                    FOTO
                ========================================= */}

                <div className="card-foto-container">

                  <img
                    className="card-foto"
                    src={obterFotoJogador(jogador)}
                    alt={`Foto de ${jogador.nome}`}
                    onError={(evento) => {

                      evento.currentTarget.onerror =
                        null;

                      evento.currentTarget.src =
                        "/fotos/default.png";

                    }}
                  />

                </div>

                {/* =========================================
                    TOPO
                ========================================= */}

                <div className="card-topo">

                  <span className="card-id">

                    ID {jogador.id}

                  </span>

                  <div className="card-ovr">

                    <span>
                      OVR
                    </span>

                    <strong>
                      {ovr}
                    </strong>

                  </div>

                </div>

                {/* =========================================
                    NOME
                ========================================= */}

                <div className="card-nome">

                  {jogador.nome}

                </div>

                {/* =========================================
                    TIPO
                ========================================= */}

                <div className="card-tipo">

                  {jogador.tipo === "GOLEIRO"
                    ? "🧤 GOLEIRO"
                    : "⚽ JOGADOR DE LINHA"}

                </div>

                {/* =========================================
                    ESTRELAS
                ========================================= */}

                <div className="card-estrelas">

                  {"⭐".repeat(
                    Math.max(
                      0,
                      jogador.estrelas || 0
                    )
                  )}

                </div>

                {/* =========================================
                    ATRIBUTOS
                ========================================= */}

                <div className="card-atributos">

                  {jogador.tipo === "GOLEIRO" ? (
                    <>
                      <div className="atributo">
                        <span>REF</span>
                        <strong>
                          {jogador.atributos?.ataque || 0}
                        </strong>
                      </div>

                      <div className="atributo">
                        <span>DEF</span>
                        <strong>
                          {jogador.atributos?.defesa || 0}
                        </strong>
                      </div>

                      <div className="atributo">
                        <span>SAI</span>
                        <strong>
                          {jogador.atributos?.velocidade || 0}
                        </strong>
                      </div>

                      <div className="atributo">
                        <span>PAS</span>
                        <strong>
                          {jogador.atributos?.passe || 0}
                        </strong>
                      </div>

                      <div className="atributo">
                        <span>POS</span>
                        <strong>
                          {jogador.atributos?.drible || 0}
                        </strong>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="atributo">
                        <span>ATA</span>
                        <strong>
                          {jogador.atributos?.ataque || 0}
                        </strong>
                      </div>

                      <div className="atributo">
                        <span>DEF</span>
                        <strong>
                          {jogador.atributos?.defesa || 0}
                        </strong>
                      </div>

                      <div className="atributo">
                        <span>VEL</span>
                        <strong>
                          {jogador.atributos?.velocidade || 0}
                        </strong>
                      </div>

                      <div className="atributo">
                        <span>PAS</span>
                        <strong>
                          {jogador.atributos?.passe || 0}
                        </strong>
                      </div>

                      <div className="atributo">
                        <span>DRI</span>
                        <strong>
                          {jogador.atributos?.drible || 0}
                        </strong>
                      </div>
                    </>
                  )}

                </div>

              </div>

            );

          })}

        </div>

      )}

    </main>

  );

}

export default CardsPage;

