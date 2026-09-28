import React, { useEffect, useMemo, useState } from "react";
import "./CardsPage.css";
import { calcularOVRJogador } from "./cardUtils";

function CardsPage({ jogadores, onAbrirFicha }) {
  const [cards, setCards] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [pesquisa, setPesquisa] = useState("");
  const [ovrMinimo, setOvrMinimo] = useState("todos");
  const [atributoFiltro, setAtributoFiltro] = useState("todos");
  const [atributoMinimo, setAtributoMinimo] = useState("todos");
  const [ordenacao, setOrdenacao] = useState("cadastro");
  const [tipoFiltro, setTipoFiltro] = useState("todos");

  // ============================================================
  // CARREGAR CARDS.TXT
  // ============================================================

  useEffect(() => {
    async function carregarCards() {
      try {
        setCarregando(true);
        setErro("");

        const resposta = await fetch("/cards.txt", {
          cache: "no-store",
        });

        if (!resposta.ok) {
          throw new Error(
            "Não foi possível carregar cards.txt"
          );
        }

        const texto = await resposta.text();

        if (!texto.includes("PELADA_CARDS_V1")) {
          throw new Error("Arquivo cards.txt inválido.");
        }

        const linhas = texto
          .split("\n")
          .map((linha) => linha.trim())
          .filter(Boolean);

        const cardsLidos = [];

        linhas.forEach((linha) => {
          if (!linha.startsWith("🆔")) {
            return;
          }

          const partes = linha
            .split("|")
            .map((parte) => parte.trim());

          if (partes.length < 8) {
            return;
          }

          const id = partes[0]
            .replace("🆔", "")
            .trim();

          const ataque =
            Number(
              partes[1]
                .replace("ATA", "")
                .trim()
            ) || 0;

          const defesa =
            Number(
              partes[2]
                .replace("DEF", "")
                .trim()
            ) || 0;

          const velocidade =
            Number(
              partes[3]
                .replace("VEL", "")
                .trim()
            ) || 0;

          const passe =
            Number(
              partes[4]
                .replace("PAS", "")
                .trim()
            ) || 0;

          const drible =
            Number(
              partes[5]
                .replace("DRI", "")
                .trim()
            ) || 0;

          // Dados GERAIS vindos do cards.txt
          const gols =
            Number(
              partes[6]
                .replace("GOLS", "")
                .trim()
            ) || 0;

          const assistencias =
            Number(
              partes[7]
                .replace("ASSIST", "")
                .replace("ASSISTÊNCIAS", "")
                .replace("ASSISTENCIA", "")
                .trim()
            ) || 0;

          cardsLidos.push({
            id,
            ataque,
            defesa,
            velocidade,
            passe,
            drible,
            gols,
            assistencias,
          });
        });

        // ========================================================
        // JUNTAR API + CARDS.TXT
        //
        // jogador.gols
        // jogador.assistencias
        //
        // continuam sendo os dados da API / temporada atual.
        //
        // golsGeral
        // assistenciasGeral
        //
        // vêm do cards.txt.
        // ========================================================

        const jogadoresComCards = jogadores.map((jogador) => {
          const card = cardsLidos.find(
            (item) =>
              String(item.id) ===
              String(jogador.id)
          );

          return {
            ...jogador,

            atributos: card
              ? {
                  ataque: card.ataque,
                  defesa: card.defesa,
                  velocidade: card.velocidade,
                  passe: card.passe,
                  drible: card.drible,
                }
              : {
                  ataque: 0,
                  defesa: 0,
                  velocidade: 0,
                  passe: 0,
                  drible: 0,
                },

            golsGeral: card
              ? card.gols
              : 0,

            assistenciasGeral: card
              ? card.assistencias
              : 0,
          };
        });

        setCards(jogadoresComCards);
      } catch (error) {
        console.error(
          "ERRO AO CARREGAR CARDS:",
          error
        );

        setErro(
          error.message ||
            "Erro ao carregar cards."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarCards();
  }, [jogadores]);

  // ============================================================
  // FILTROS
  // ============================================================

  const cardsFiltrados = useMemo(() => {
    let resultado = [...cards];

    // PESQUISA
    if (pesquisa.trim()) {
      const termo = pesquisa
        .toLowerCase()
        .trim();

      resultado = resultado.filter(
        (jogador) =>
          String(jogador.nome || "")
            .toLowerCase()
            .includes(termo) ||
          String(jogador.id || "")
            .toLowerCase()
            .includes(termo)
      );
    }

    // OVR MÍNIMO
    if (ovrMinimo !== "todos") {
      const minimo = Number(ovrMinimo);

      resultado = resultado.filter(
        (jogador) =>
          calcularOVRJogador(jogador) >= minimo
      );
    }

    // ATRIBUTO
    if (
      atributoFiltro !== "todos" &&
      atributoMinimo !== "todos"
    ) {
      const minimo = Number(atributoMinimo);

      resultado = resultado.filter(
        (jogador) => {
          const valor =
            Number(
              jogador.atributos?.[
                atributoFiltro
              ]
            ) || 0;

          return valor >= minimo;
        }
      );
    }

    // TIPO
    if (tipoFiltro !== "todos") {
      resultado = resultado.filter(
        (jogador) =>
          String(
            jogador.tipo || ""
          ).toUpperCase() ===
          String(
            tipoFiltro
          ).toUpperCase()
      );
    }

    // ORDENAÇÃO
    if (ordenacao === "ovr") {
      resultado.sort(
        (a, b) =>
          calcularOVRJogador(b) -
          calcularOVRJogador(a)
      );
    }

    if (ordenacao === "nome") {
      resultado.sort(
        (a, b) =>
          String(a.nome || "").localeCompare(
            String(b.nome || "")
          )
      );
    }

    if (ordenacao === "gols") {
      resultado.sort(
        (a, b) =>
          (Number(b.golsGeral) || 0) -
          (Number(a.golsGeral) || 0)
      );
    }

    if (ordenacao === "assistencias") {
      resultado.sort(
        (a, b) =>
          (Number(
            b.assistenciasGeral
          ) || 0) -
          (Number(
            a.assistenciasGeral
          ) || 0)
      );
    }

    return resultado;
  }, [
    cards,
    pesquisa,
    ovrMinimo,
    atributoFiltro,
    atributoMinimo,
    ordenacao,
    tipoFiltro,
  ]);

  // ============================================================
  // LIMPAR FILTROS
  // ============================================================

  function limparFiltros() {
    setPesquisa("");
    setOvrMinimo("todos");
    setAtributoFiltro("todos");
    setAtributoMinimo("todos");
    setOrdenacao("cadastro");
    setTipoFiltro("todos");
  }

  // ============================================================
  // CARREGANDO
  // ============================================================

  if (carregando) {
    return (
      <div className="cards-page">
        <div className="cards-estado">
          <h2>🃏 CARREGANDO CARDS...</h2>
        </div>
      </div>
    );
  }

  // ============================================================
  // ERRO
  // ============================================================

  if (erro) {
    return (
      <div className="cards-page">
        <div className="cards-estado">
          <h2>❌ ERRO</h2>
          <p>{erro}</p>
        </div>
      </div>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="cards-page">

      {/* CABEÇALHO */}

      <div className="cards-header">
        <div>
          <h1>🃏 CARDS DOS JOGADORES</h1>

          <p className="cards-subtitle">
            {cardsFiltrados.length} jogadores
          </p>
        </div>
      </div>

      {/* FILTROS */}

      <div className="cards-filtros">

        {/* PESQUISA */}

        <div className="filtro-grupo filtro-pesquisa">
          <label>PESQUISAR</label>

          <input
            type="text"
            value={pesquisa}
            onChange={(e) =>
              setPesquisa(e.target.value)
            }
            placeholder="Nome ou ID..."
          />
        </div>

        {/* OVR */}

        <div className="filtro-grupo">
          <label>OVR MÍNIMO</label>

          <select
            value={ovrMinimo}
            onChange={(e) =>
              setOvrMinimo(e.target.value)
            }
          >
            <option value="todos">
              Todos
            </option>

            <option value="90">
              90+
            </option>

            <option value="85">
              85+
            </option>

            <option value="80">
              80+
            </option>

            <option value="75">
              75+
            </option>

            <option value="70">
              70+
            </option>
          </select>
        </div>

        {/* ATRIBUTO */}

        <div className="filtro-grupo">
          <label>ATRIBUTO</label>

          <select
            value={atributoFiltro}
            onChange={(e) =>
              setAtributoFiltro(
                e.target.value
              )
            }
          >
            <option value="todos">
              Todos
            </option>

            <option value="ataque">
              Ataque
            </option>

            <option value="defesa">
              Defesa
            </option>

            <option value="velocidade">
              Velocidade
            </option>

            <option value="passe">
              Passe
            </option>

            <option value="drible">
              Drible
            </option>
          </select>
        </div>

        {/* VALOR DO ATRIBUTO */}

        <div className="filtro-grupo">
          <label>MÍNIMO</label>

          <select
            value={atributoMinimo}
            onChange={(e) =>
              setAtributoMinimo(
                e.target.value
              )
            }
          >
            <option value="todos">
              Todos
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

        {/* TIPO */}

        <div className="filtro-grupo">
          <label>TIPO</label>

          <select
            value={tipoFiltro}
            onChange={(e) =>
              setTipoFiltro(
                e.target.value
              )
            }
          >
            <option value="todos">
              Todos
            </option>

            <option value="JOGADOR">
              Jogador
            </option>

            <option value="GOLEIRO">
              Goleiro
            </option>
          </select>
        </div>

        {/* ORDENAÇÃO */}

        <div className="filtro-grupo">
          <label>ORDENAR</label>

          <select
            value={ordenacao}
            onChange={(e) =>
              setOrdenacao(
                e.target.value
              )
            }
          >
            <option value="cadastro">
              Cadastro
            </option>

            <option value="ovr">
              OVR
            </option>

            <option value="nome">
              Nome
            </option>

            <option value="gols">
              Gols
            </option>

            <option value="assistencias">
              Assistências
            </option>
          </select>
        </div>

        {/* LIMPAR */}

        <button
          className="botao-limpar-filtros"
          onClick={limparFiltros}
        >
          LIMPAR FILTROS
        </button>
      </div>

      {/* CARDS */}

      <div className="cards-grid">
        {cardsFiltrados.map(
          (jogador) => {
            const ovr =
              calcularOVRJogador(
                jogador
              );

            const tipo =
              String(
                jogador.tipo || ""
              ).toUpperCase();

            const ehGoleiro =
              tipo === "GOLEIRO";

            return (
              <div
                key={jogador.id}
                className="card-jogador"
                onClick={() =>
                  onAbrirFicha(
                    jogador
                  )
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" ||
                    e.key === " "
                  ) {
                    onAbrirFicha(
                      jogador
                    );
                  }
                }}
              >

                {/* TOPO */}

                <div className="card-topo">

                  <span className="card-id">
                    #{jogador.id}
                  </span>

                  <div className="card-ovr">
                    <span>OVR</span>

                    <strong>
                      {ovr}
                    </strong>
                  </div>

                </div>

                {/* FOTO */}

                <div className="card-foto-container">

                  <img
                    className="card-foto"
                    src={`/fotos/${jogador.id}.png`}
                    alt={
                      jogador.nome ||
                      "Jogador"
                    }
                    onError={(e) => {
                      e.currentTarget.src =
                        "/fotos/default.png";
                    }}
                  />

                </div>

                {/* NOME */}

                <div className="card-nome">
                  {jogador.nome ||
                    "JOGADOR"}
                </div>

                {/* TIPO */}

                <div className="card-tipo">
                  {jogador.tipo ||
                    "JOGADOR"}
                </div>

                {/* ESTRELAS */}

                <div className="card-estrelas">
                  {"⭐".repeat(
                    Number(
                      jogador.estrelas
                    ) || 0
                  )}
                </div>

                {/* ATRIBUTOS */}

                <div className="card-atributos">

                  <div>
                    <span>
                      {ehGoleiro
                        ? "REF"
                        : "ATA"}
                    </span>

                    <strong>
                      {
                        jogador
                          .atributos
                          ?.ataque || 0
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      DEF
                    </span>

                    <strong>
                      {
                        jogador
                          .atributos
                          ?.defesa || 0
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      {ehGoleiro
                        ? "SAI"
                        : "VEL"}
                    </span>

                    <strong>
                      {
                        jogador
                          .atributos
                          ?.velocidade || 0
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      PAS
                    </span>

                    <strong>
                      {
                        jogador
                          .atributos
                          ?.passe || 0
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      {ehGoleiro
                        ? "POS"
                        : "DRI"}
                    </span>

                    <strong>
                      {
                        jogador
                          .atributos
                          ?.drible || 0
                      }
                    </strong>
                  </div>

                </div>

                {/* ESTATÍSTICAS GERAIS DO CARDS.TXT */}

                <div className="card-estatisticas">

                  <div className="estatistica">

                    <span className="estatistica-icone">
                      ⚽
                    </span>

                    <strong>
                      {
                        jogador
                          .golsGeral || 0
                      }
                    </strong>

                    <small>
                      GOLS
                    </small>

                  </div>

                  <div className="estatistica">

                    <span className="estatistica-icone">
                      🅰️
                    </span>

                    <strong>
                      {
                        jogador
                          .assistenciasGeral ||
                        0
                      }
                    </strong>

                    <small>
                      ASSIST.
                    </small>

                  </div>

                </div>

              </div>
            );
          }
        )}
      </div>

      {/* NENHUM RESULTADO */}

      {cardsFiltrados.length === 0 && (
        <div className="cards-estado">

          <h2>
            😕 NENHUM JOGADOR ENCONTRADO
          </h2>

          <button
            className="botao-limpar-filtros"
            onClick={limparFiltros}
          >
            LIMPAR FILTROS
          </button>

        </div>
      )}

    </div>
  );
}

export default CardsPage;

