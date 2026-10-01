import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import "./Ranking.css";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  calcularOVRJogador
} from "../pages/Cards/cardUtils";

function Ranking({
  jogadores: jogadoresProps,
  onAbrirFicha
}) {

  const [jogadores, setJogadores] = useState(
    jogadoresProps || []
  );

  const [cards, setCards] = useState([]);

  const [carregando, setCarregando] =
    useState(true);

  const [erro, setErro] =
    useState("");

  // =========================================================
  // ATUALIZAR JOGADORES RECEBIDOS DO APP
  // =========================================================

  useEffect(() => {
    if (jogadoresProps) {
      setJogadores(jogadoresProps);
    }
  }, [jogadoresProps]);

  // =========================================================
  // CARREGAR CARDS.TXT
  // =========================================================

  useEffect(() => {

    async function carregarCards() {

      try {

        const resposta = await fetch(
          "/cards.txt",
          {
            cache: "no-store"
          }
        );

        if (!resposta.ok) {
          throw new Error(
            "Não foi possível carregar cards.txt"
          );
        }

        const texto =
          await resposta.text();

        if (
          !texto.includes(
            "PELADA_CARDS_V1"
          )
        ) {
          throw new Error(
            "Arquivo cards.txt inválido."
          );
        }

        const cardsLidos = [];

        texto
          .split("\n")
          .forEach((linha) => {

            const textoLinha =
              linha.trim();

            if (
              !textoLinha.startsWith("🆔")
            ) {
              return;
            }

            const partes =
              textoLinha
                .split("|")
                .map(
                  (parte) =>
                    parte.trim()
                );

            /*
             * Formato:
             *
             * 🆔 001 | ATA 20 | DEF 20 |
             * VEL 20 | PAS 20 | DRI 20 |
             * GOLS 2 | ASSIST 5 | SALVAMENTOS 3
             */

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

            const id =
              partes[0]
                .replace("🆔", "")
                .trim();

            if (!id) {
              return;
            }

            // =================================================
            // ATRIBUTOS
            // =================================================

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

            // =================================================
            // SALVAR CARD
            // =================================================

            cardsLidos.push({
              id,
              atributos: {
                ataque,
                defesa,
                velocidade,
                passe,
                drible,
              }
            });

          });

        setCards(cardsLidos);

      } catch (error) {

        console.error(error);

        setErro(
          error.message
        );

      } finally {

        setCarregando(false);

      }

    }

    carregarCards();

  }, []);

  // =========================================================
  // VINCULAR JOGADORES + CARDS
  // =========================================================

  const jogadoresComOVR = useMemo(() => {

    return jogadores.map(
      (jogador) => {

        const card =
          cards.find(
            (item) =>
              String(item.id) ===
              String(jogador.id)
          );

        const jogadorComCard = {

          ...jogador,

          atributos:
            card?.atributos || {
              ataque: 0,
              defesa: 0,
              velocidade: 0,
              passe: 0,
              drible: 0,
            },

        };

        const ovr =
          calcularOVRJogador(
            jogadorComCard
          );

        return {
          ...jogadorComCard,
          ovr,
        };

      }
    );

  }, [jogadores, cards]);

  // =========================================================
  // ESTATÍSTICAS GERAIS
  // =========================================================

  const estatisticas = useMemo(() => {

    const gols =
      jogadores.reduce(
        (total, jogador) =>
          total +
          (Number(jogador.gols) || 0),
        0
      );

    const assistencias =
      jogadores.reduce(
        (total, jogador) =>
          total +
          (
            Number(
              jogador.assistencias
            ) || 0
          ),
        0
      );

    const salvamentos =
      jogadores.reduce(
        (total, jogador) =>
          total +
          (
            Number(
              jogador.salvamentos
            ) || 0
          ),
        0
      );

    const goleiros =
      jogadores.filter(
        (jogador) =>
          String(jogador.tipo)
            .toUpperCase() ===
          "GOLEIRO"
      ).length;

    const linha =
      jogadores.filter(
        (jogador) =>
          String(jogador.tipo)
            .toUpperCase() ===
          "LINHA"
      ).length;

    return {
      gols,
      assistencias,
      salvamentos,
      goleiros,
      linha,
    };

  }, [jogadores]);

  // =========================================================
  // ARTILHEIROS
  // =========================================================

  const artilheiros = useMemo(() => {

    return [...jogadores]
      .sort((a, b) => {

        const golsA =
          Number(a.gols) || 0;

        const golsB =
          Number(b.gols) || 0;

        if (golsB !== golsA) {
          return golsB - golsA;
        }

        return a.nome.localeCompare(
          b.nome,
          "pt-BR"
        );

      })
      .slice(0, 10);

  }, [jogadores]);

  // =========================================================
  // GARÇONS
  // =========================================================

  const melhoresAssistentes =
    useMemo(() => {

      return [...jogadores]
        .sort((a, b) => {

          const assistA =
            Number(a.assistencias) || 0;

          const assistB =
            Number(b.assistencias) || 0;

          if (
            assistB !== assistA
          ) {
            return (
              assistB -
              assistA
            );
          }

          return a.nome.localeCompare(
            b.nome,
            "pt-BR"
          );

        })
        .slice(0, 10);

    }, [jogadores]);

  // =========================================================
  // GOLEIROS DA TEMPORADA
  // =========================================================

  const melhoresGoleiros =
    useMemo(() => {

      return jogadoresComOVR
        .filter(
          (jogador) =>
            String(jogador.tipo)
              .toUpperCase() ===
            "GOLEIRO"
        )
        .sort((a, b) => {

          const salvA =
            Number(a.salvamentos) || 0;

          const salvB =
            Number(b.salvamentos) || 0;

          // 1º critério: salvamentos
          if (salvB !== salvA) {
            return salvB - salvA;
          }

          // 2º critério: OVR
          if (b.ovr !== a.ovr) {
            return b.ovr - a.ovr;
          }

          // 3º critério: nome
          return a.nome.localeCompare(
            b.nome,
            "pt-BR"
          );

        })
        .slice(0, 10);

    }, [jogadoresComOVR]);

  // =========================================================
  // DEFENSORES DA TEMPORADA
  // =========================================================
  //
  // SOMENTE jogadores LINHA.
  //
  // O critério é:
  // 1º - mais salvamentos
  // 2º - maior OVR
  // 3º - nome
  //
  // GOLEIRO NÃO PARTICIPA.
  // =========================================================

  const melhoresDefensores =
    useMemo(() => {

      return jogadoresComOVR
        .filter(
          (jogador) =>
            String(jogador.tipo)
              .toUpperCase() ===
            "LINHA"
        )
        .sort((a, b) => {

          const salvA =
            Number(a.salvamentos) || 0;

          const salvB =
            Number(b.salvamentos) || 0;

          // 1º critério: salvamentos
          if (salvB !== salvA) {
            return salvB - salvA;
          }

          // 2º critério: OVR
          if (b.ovr !== a.ovr) {
            return b.ovr - a.ovr;
          }

          // 3º critério: nome
          return a.nome.localeCompare(
            b.nome,
            "pt-BR"
          );

        })
        .slice(0, 10);

    }, [jogadoresComOVR]);

  // =========================================================
  // PREMIADOS DA TEMPORADA
  // =========================================================

  // GOAT = MAIS GOLS DA TEMPORADA
  const goatTemporada =
    artilheiros[0] || null;

  // GOLEIRO = MAIS SALVAMENTOS ENTRE GOLEIROS
  const goleiroTemporada =
    melhoresGoleiros[0] || null;

  // GARÇOM = MAIS ASSISTÊNCIAS
  const garcomTemporada =
    melhoresAssistentes[0] || null;

  // DEFENSOR = MAIS SALVAMENTOS ENTRE JOGADORES DE LINHA
  const defensorTemporada =
    melhoresDefensores[0] || null;

  // =========================================================
  // ABRIR FICHA
  // =========================================================

  function abrirFicha(jogador) {

    if (
      jogador &&
      onAbrirFicha
    ) {
      onAbrirFicha(jogador);
    }

  }

  // =========================================================
  // DADOS DOS GRÁFICOS
  // =========================================================

  const dadosGols =
    useMemo(() => {

      return artilheiros.map(
        (jogador) => ({
          nome: jogador.nome,
          gols:
            Number(jogador.gols) || 0,
        })
      );

    }, [artilheiros]);

  const dadosAssistencias =
    useMemo(() => {

      return melhoresAssistentes.map(
        (jogador) => ({
          nome: jogador.nome,
          assistencias:
            Number(
              jogador.assistencias
            ) || 0,
        })
      );

    }, [melhoresAssistentes]);

 // =========================================================
// DADOS DO GRÁFICO DE SALVAMENTOS
// SOMENTE GOLEIROS
// =========================================================

const dadosSalvamentos =
  useMemo(() => {

    return [...jogadores]
      .filter(
        (jogador) =>
          String(jogador.tipo)
            .toUpperCase() ===
          "GOLEIRO"
      )
      .sort((a, b) => {

        const salvA =
          Number(a.salvamentos) || 0;

        const salvB =
          Number(b.salvamentos) || 0;

        return salvB - salvA;

      })
      .slice(0, 10)
      .map((jogador) => ({
        nome: jogador.nome,
        salvamentos:
          Number(
            jogador.salvamentos
          ) || 0,
      }));

  }, [jogadores]);

  // DEFENSORES = SALVAMENTOS DOS JOGADORES DE LINHA
  const dadosDefesa =
    useMemo(() => {

      return melhoresDefensores.map(
        (jogador) => ({
          nome: jogador.nome,
          salvamentos:
            Number(
              jogador.salvamentos
            ) || 0,
        })
      );

    }, [melhoresDefensores]);

  // =========================================================
  // TOOLTIP
  // =========================================================

  const tooltipStyle = {

    backgroundColor:
      "#1b1f28",

    border:
      "1px solid #343a48",

    borderRadius:
      "10px",

    color:
      "#ffffff",

    boxShadow:
      "0 10px 30px rgba(0, 0, 0, 0.35)",

  };

  // =========================================================
  // CARREGANDO
  // =========================================================

  if (carregando) {

    return (

      <div className="estado">

        <span>📊</span>

        <h2>
          Carregando ranking...
        </h2>

      </div>

    );

  }

  // =========================================================
  // ERRO
  // =========================================================

  if (erro) {

    return (

      <div className="estado">

        <span>❌</span>

        <h2>
          Erro ao carregar ranking
        </h2>

        <p>
          {erro}
        </p>

      </div>

    );

  }

  // =========================================================
  // TELA
  // =========================================================

  return (

    <main className="ranking-page">

      {/* =====================================================
          CABEÇALHO
      ===================================================== */}

      <div className="ranking-title">

        <div>

          <span className="subtitle">
            ESTATÍSTICAS
          </span>

          <h1>
            Ranking da Pelada
          </h1>

          <p>
            Desempenho geral dos jogadores
          </p>

          <p>
            For chorar contate o suporte 😭:
            anaodajebapreta@orkut.com
          </p>

        </div>

      </div>

      {/* =====================================================
          PREMIADOS DA TEMPORADA
      ===================================================== */}

      <section className="ranking-premiacoes">

        {/* GOAT */}

        <button
          type="button"
          className="botao-premiacao premiacao-goat"
          onClick={() =>
            abrirFicha(goatTemporada)
          }
          disabled={!goatTemporada}
        >

          <span className="premiacao-icone">
            🐐
          </span>

          <span className="premiacao-texto">

            <strong>
              GOAT DA TEMPORADA
            </strong>

            <small>
              {goatTemporada
                ? goatTemporada.nome
                : "Nenhum jogador"}
            </small>

          </span>

          <span className="premiacao-seta">
            →
          </span>

        </button>

        {/* GOLEIRO */}

        <button
          type="button"
          className="botao-premiacao premiacao-goleiro"
          onClick={() =>
            abrirFicha(goleiroTemporada)
          }
          disabled={!goleiroTemporada}
        >

          <span className="premiacao-icone">
            🕷️
          </span>

          <span className="premiacao-texto">

            <strong>
              ARANHA NEGRA DA TEMPORADA
            </strong>

            <small>
              {goleiroTemporada
                ? goleiroTemporada.nome
                : "Nenhum goleiro"}
            </small>

          </span>

          <span className="premiacao-seta">
            →
          </span>

        </button>

        {/* GARÇOM */}

        <button
          type="button"
          className="botao-premiacao premiacao-garcom"
          onClick={() =>
            abrirFicha(garcomTemporada)
          }
          disabled={!garcomTemporada}
        >

          <span className="premiacao-icone">
            🎼
          </span>

          <span className="premiacao-texto">

            <strong>
              MAESTRO DA TEMPORADA
            </strong>

            <small>
              {garcomTemporada
                ? garcomTemporada.nome
                : "Nenhum jogador"}
            </small>

          </span>

          <span className="premiacao-seta">
            →
          </span>

        </button>

        {/* DEFENSOR */}

        <button
          type="button"
          className="botao-premiacao premiacao-defensor"
          onClick={() =>
            abrirFicha(defensorTemporada)
          }
          disabled={!defensorTemporada}
        >

          <span className="premiacao-icone">
            🦣
          </span>

          <span className="premiacao-texto">

            <strong>
              MASTODONTE DA TEMPORADA
            </strong>

            <small>
              {defensorTemporada
                ? defensorTemporada.nome
                : "Nenhum defensor"}
            </small>

          </span>

          <span className="premiacao-seta">
            →
          </span>

        </button>

      </section>

      {/* =====================================================
          RESUMO
      ===================================================== */}

      <section className="ranking-resumo">

        <div className="ranking-card ranking-card-gols">

          <span>⚽</span>

          <div>

            <strong>
              {estatisticas.gols}
            </strong>

            <small>
              Gols marcados
            </small>

          </div>

        </div>

        <div className="ranking-card ranking-card-assistencias">

          <span>🅰️</span>

          <div>

            <strong>
              {estatisticas.assistencias}
            </strong>

            <small>
              Assistências
            </small>

          </div>

        </div>

        <div className="ranking-card ranking-card-salvamentos">

          <span>🛡️</span>

          <div>

            <strong>
              {estatisticas.salvamentos}
            </strong>

            <small>
              Salvamentos
            </small>

          </div>

        </div>

        <div className="ranking-card ranking-card-jogadores">

          <span>👥</span>

          <div>

            <strong>
              {jogadores.length}
            </strong>

            <small>
              Jogadores
            </small>

          </div>

        </div>

        <div className="ranking-card ranking-card-goleiros">

          <span>🧤</span>

          <div>

            <strong>
              {estatisticas.goleiros}
            </strong>

            <small>
              Goleiros
            </small>

          </div>

        </div>

      </section>

      {/* =====================================================
          PÓDIO DE ARTILHEIROS
      ===================================================== */}

      <section className="podio">

        <div className="podio-card segundo">

          <span className="medalha">
            🥈
          </span>

          <strong>
            {artilheiros[1]?.nome || "-"}
          </strong>

          <small>
            {artilheiros[1]?.gols || 0}
            {" "}
            gols
          </small>

        </div>

        <div className="podio-card primeiro">

          <span className="medalha">
            🥇
          </span>

          <strong>
            {artilheiros[0]?.nome || "-"}
          </strong>

          <small>
            {artilheiros[0]?.gols || 0}
            {" "}
            gols
          </small>

        </div>

        <div className="podio-card terceiro">

          <span className="medalha">
            🥉
          </span>

          <strong>
            {artilheiros[2]?.nome || "-"}
          </strong>

          <small>
            {artilheiros[2]?.gols || 0}
            {" "}
            gols
          </small>

        </div>

      </section>

      {/* =====================================================
          GRÁFICOS
      ===================================================== */}

      <section className="graficos">

        {/* ===================================================
            GOLS
        =================================================== */}

        <div className="grafico-card grafico-gols">

          <div className="grafico-header">

            <div>

              <span>
                ⚽
              </span>

              <h2>
                Artilharia da Temporada
              </h2>

            </div>

            <small>
              Top 10
            </small>

          </div>

          <div
            className="grafico-container"
            style={{
              width: "100%",
              height: "350px",
              minHeight: "350px",
              overflowX: "auto",
            }}
          >

            {dadosGols.length > 0 ? (

              <BarChart
                width={600}
                height={350}
                data={dadosGols}
                layout="vertical"
                margin={{
                  top: 10,
                  right: 30,
                  left: 20,
                  bottom: 10,
                }}
              >

                <CartesianGrid
                  stroke="rgba(255, 255, 255, 0.15)"
                  strokeDasharray="4 4"
                  horizontal={false}
                />

                <XAxis
                  type="number"
                  allowDecimals={false}
                  stroke="#ffffff"
                />

                <YAxis
                  type="category"
                  dataKey="nome"
                  width={110}
                  stroke="#ffffff"
                />

                <Tooltip
                  contentStyle={tooltipStyle}
                  labelStyle={{
                    color: "#ffffff",
                    fontWeight: "600",
                  }}
                  itemStyle={{
                    color: "#ff9f43",
                  }}
                  cursor={{
                    fill:
                      "rgba(255,255,255,0.04)",
                  }}
                />

                <Bar
                  dataKey="gols"
                  name="Gols"
                  fill="#ff9f43"
                  radius={[
                    0,
                    6,
                    6,
                    0,
                  ]}
                  barSize={20}
                />

              </BarChart>

            ) : (

              <div className="grafico-vazio">

                <span>
                  ⚽
                </span>

                <p>
                  Nenhum gol registrado.
                </p>

              </div>

            )}

          </div>

        </div>

        {/* ===================================================
            ASSISTÊNCIAS
        =================================================== */}

        <div className="grafico-card grafico-assistencias">

          <div className="grafico-header">

            <div>

              <span>
                🅰️
              </span>

              <h2>
                Assistencias da temporada
              </h2>

            </div>

            <small>
              Top 10
            </small>

          </div>

          <div
            className="grafico-container"
            style={{
              width: "100%",
              height: "350px",
              minHeight: "350px",
              overflowX: "auto",
            }}
          >

            {dadosAssistencias.length > 0 ? (

              <BarChart
                width={600}
                height={350}
                data={dadosAssistencias}
                layout="vertical"
                margin={{
                  top: 10,
                  right: 30,
                  left: 20,
                  bottom: 10,
                }}
              >

                <CartesianGrid
                  stroke="rgba(255, 255, 255, 0.15)"
                  strokeDasharray="4 4"
                  horizontal={false}
                />

                <XAxis
                  type="number"
                  allowDecimals={false}
                  stroke="#ffffff"
                />

                <YAxis
                  type="category"
                  dataKey="nome"
                  width={110}
                  stroke="#ffffff"
                />

                <Tooltip
                  contentStyle={tooltipStyle}
                  labelStyle={{
                    color: "#ffffff",
                    fontWeight: "600",
                  }}
                  itemStyle={{
                    color: "#4dabf7",
                  }}
                  cursor={{
                    fill:
                      "rgba(255,255,255,0.04)",
                  }}
                />

                <Bar
                  dataKey="assistencias"
                  name="Assistências"
                  fill="#4dabf7"
                  radius={[
                    0,
                    6,
                    6,
                    0,
                  ]}
                  barSize={20}
                />

              </BarChart>

            ) : (

              <div className="grafico-vazio">

                <span>
                  🅰️
                </span>

                <p>
                  Nenhuma assistência registrada.
                </p>

              </div>

            )}

          </div>

        </div>

        {/* ===================================================
            SALVAMENTOS
        =================================================== */}

        <div className="grafico-card grafico-salvamentos">

          <div className="grafico-header">

            <div>

              <span>
                🛡️
              </span>

              <h2>
                Goleiros da temporada
              </h2>

            </div>

            <small>
              Top 10
            </small>

          </div>

          <div
            className="grafico-container"
            style={{
              width: "100%",
              height: "350px",
              minHeight: "350px",
              overflowX: "auto",
            }}
          >

            {dadosSalvamentos.length > 0 ? (

              <BarChart
                width={600}
                height={350}
                data={dadosSalvamentos}
                layout="vertical"
                margin={{
                  top: 10,
                  right: 30,
                  left: 20,
                  bottom: 10,
                }}
              >

                <CartesianGrid
                  stroke="rgba(255, 255, 255, 0.15)"
                  strokeDasharray="4 4"
                  horizontal={false}
                />

                <XAxis
                  type="number"
                  allowDecimals={false}
                  stroke="#ffffff"
                />

                <YAxis
                  type="category"
                  dataKey="nome"
                  width={110}
                  stroke="#ffffff"
                />

                <Tooltip
                  contentStyle={tooltipStyle}
                  labelStyle={{
                    color: "#ffffff",
                    fontWeight: "600",
                  }}
                  itemStyle={{
                    color: "#51cf66",
                  }}
                  cursor={{
                    fill:
                      "rgba(255,255,255,0.04)",
                  }}
                />

                <Bar
                  dataKey="salvamentos"
                  name="Salvamentos"
                  fill="#51cf66"
                  radius={[
                    0,
                    6,
                    6,
                    0,
                  ]}
                  barSize={20}
                />

              </BarChart>

            ) : (

              <div className="grafico-vazio">

                <span>
                  🛡️
                </span>

                <p>
                  Nenhum salvamento registrado.
                </p>

              </div>

            )}

          </div>

        </div>

        {/* ===================================================
            DEFENSORES
        =================================================== */}

        <div className="grafico-card grafico-defesa">

          <div className="grafico-header">

            <div>

              <span>
                🛡️
              </span>

              <h2>
                Defensores da temporada
              </h2>

            </div>

            <small>
              Top 10 
            </small>

          </div>

          <div
            className="grafico-container"
            style={{
              width: "100%",
              height: "350px",
              minHeight: "350px",
              overflowX: "auto",
            }}
          >

            {dadosDefesa.length > 0 ? (

              <BarChart
                width={600}
                height={350}
                data={dadosDefesa}
                layout="vertical"
                margin={{
                  top: 10,
                  right: 30,
                  left: 20,
                  bottom: 10,
                }}
              >

                <CartesianGrid
                  stroke="rgba(255, 255, 255, 0.15)"
                  strokeDasharray="4 4"
                  horizontal={false}
                />

                <XAxis
                  type="number"
                  allowDecimals={false}
                  stroke="#ffffff"
                />

                <YAxis
                  type="category"
                  dataKey="nome"
                  width={110}
                  stroke="#ffffff"
                />

                <Tooltip
                  contentStyle={tooltipStyle}
                  labelStyle={{
                    color: "#ffffff",
                    fontWeight: "600",
                  }}
                  itemStyle={{
                    color: "#845ef7",
                  }}
                  cursor={{
                    fill:
                      "rgba(255,255,255,0.04)",
                  }}
                />

                <Bar
                  dataKey="salvamentos"
                  name="Salvamentos"
                  fill="#845ef7"
                  radius={[
                    0,
                    6,
                    6,
                    0,
                  ]}
                  barSize={20}
                />

              </BarChart>

            ) : (

              <div className="grafico-vazio">

                <span>
                  🛡️
                </span>

                <p>
                  Nenhum defensor encontrado.
                </p>

              </div>

            )}

          </div>

        </div>

      </section>

      {/* =====================================================
          LISTAS
      ===================================================== */}

      <section className="ranking-listas">

        {/* ===================================================
            ARTILHEIROS
        =================================================== */}

        <div className="ranking-lista">

          <div className="lista-ranking-header">

            <div>

              <span>
                ⚽
              </span>

              <h2>
                Artilheiros
              </h2>

            </div>

            <small>
              Top 10 Artilheiros
            </small>

          </div>

          {artilheiros.map(
            (jogador, index) => (

              <div
                className="ranking-item"
                key={jogador.id}
              >

                <span className="posicao">
                  {index + 1}
                </span>

                <span className="nome-ranking">
                  {jogador.nome}
                </span>

                <strong className="valor-gols">

                  {Number(jogador.gols) || 0}
                  {" "}
                  ⚽

                </strong>

              </div>

            )
          )}

        </div>

        {/* ===================================================
            GARÇONS
        =================================================== */}

        <div className="ranking-lista">

          <div className="lista-ranking-header">

            <div>

              <span>
                🅰️
              </span>

              <h2>
                Garçons
              </h2>

            </div>

            <small>
              Top 10 Garçons
            </small>

          </div>

          {melhoresAssistentes.map(
            (jogador, index) => (

              <div
                className="ranking-item"
                key={jogador.id}
              >

                <span className="posicao">
                  {index + 1}
                </span>

                <span className="nome-ranking">
                  {jogador.nome}
                </span>

                <strong className="valor-ovr">

                  {Number(
                    jogador.assistencias
                  ) || 0}

                  {" "}

                  🅰️

                </strong>

              </div>

            )
          )}

        </div>

        {/* ===================================================
            GOLEIROS
        =================================================== */}

        <div className="ranking-lista">

          <div className="lista-ranking-header">

            <div>

              <span>
                🧤
              </span>

              <h2>
                Goleiros
              </h2>

            </div>

            <small>
              Top 10 Guarda Redes
            </small>

          </div>

          {melhoresGoleiros.map(
            (jogador, index) => (

              <div
                className="ranking-item"
                key={jogador.id}
              >

                <span className="posicao">
                  {index + 1}
                </span>

                <span className="nome-ranking">
                  {jogador.nome}
                </span>

                <strong className="valor-ovr">

                  {Number(
                    jogador.salvamentos
                  ) || 0}

                  {" "}

                  🛡️

                </strong>

              </div>

            )
          )}

        </div>

        {/* ===================================================
            DEFENSORES
        =================================================== */}

        <div className="ranking-lista">

          <div className="lista-ranking-header">

            <div>

              <span>
                🛡️
              </span>

              <h2>
                Defensores
              </h2>

            </div>

            <small>
              Top 10 Zagueiros
            </small>

          </div>

          {melhoresDefensores.map(
            (jogador, index) => (

              <div
                className="ranking-item"
                key={jogador.id}
              >

                <span className="posicao">
                  {index + 1}
                </span>

                <span className="nome-ranking">
                  {jogador.nome}
                </span>

                <strong className="valor-ovr">

                  {Number(
                    jogador.salvamentos
                  ) || 0}

                  {" "}

                  🛡️

                </strong>

              </div>

            )
          )}

        </div>

        {/* ===================================================
            MELHORES AVALIADOS
        =================================================== */}

        <div className="ranking-lista">

          <div className="lista-ranking-header">

            <div>

              <span>
                ⭐
              </span>

              <h2>
                Melhores avaliados
              </h2>

            </div>

            <small>
              Top 10 OVR
            </small>

          </div>

          {jogadoresComOVR
            .sort((a, b) => {

              if (b.ovr !== a.ovr) {
                return b.ovr - a.ovr;
              }

              const estrelasA =
                Number(a.estrelas) || 0;

              const estrelasB =
                Number(b.estrelas) || 0;

              if (
                estrelasB !== estrelasA
              ) {
                return estrelasB - estrelasA;
              }

              return a.nome.localeCompare(
                b.nome,
                "pt-BR"
              );

            })
            .slice(0, 10)
            .map(
              (jogador, index) => (

                <div
                  className="ranking-item"
                  key={jogador.id}
                >

                  <span className="posicao">
                    {index + 1}
                  </span>

                  <span className="nome-ranking">
                    {jogador.nome}
                  </span>

                  <strong className="valor-ovr">
                    OVR {jogador.ovr}
                  </strong>

                </div>

              )
            )}

        </div>

      </section>

    </main>

  );

}

export default Ranking;