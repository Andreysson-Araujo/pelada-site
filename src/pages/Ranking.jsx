import React, { useEffect, useMemo, useState } from "react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function Ranking() {
  const [jogadores, setJogadores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // =========================================================
  // CARREGAR JOGADORES
  // =========================================================

  useEffect(() => {
    async function carregarJogadores() {
      try {
        const resposta = await fetch("/jogadores.txt");

        if (!resposta.ok) {
          throw new Error("Não foi possível carregar jogadores.txt");
        }

        const texto = await resposta.text();

        if (!texto.includes("PELADA_APP_V1")) {
          throw new Error("Arquivo de jogadores inválido.");
        }

        const jogadoresLidos = [];

        texto.split("\n").forEach((linha, index) => {
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

          jogadoresLidos.push({
            id: index,

            nome: partes[0]
              .replace("👤", "")
              .trim(),

            estrelas:
              Number(
                partes[1]
                  .replace("⭐", "")
                  .trim()
              ) || 0,

            tipo: partes[2].toUpperCase(),

            gols:
              Number(
                partes[3]
                  .replace("⚽", "")
                  .trim()
              ) || 0,

            assistencias:
              Number(
                partes[4]
                  .replace("🅰️", "")
                  .trim()
              ) || 0,
          });
        });

        console.log("JOGADORES CARREGADOS:", jogadoresLidos);

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

  // =========================================================
  // ESTATÍSTICAS
  // =========================================================

  const estatisticas = useMemo(() => {
    const gols = jogadores.reduce(
      (total, jogador) => total + jogador.gols,
      0
    );

    const assistencias = jogadores.reduce(
      (total, jogador) => total + jogador.assistencias,
      0
    );

    const goleiros = jogadores.filter(
      (jogador) => jogador.tipo === "GOLEIRO"
    ).length;

    const linha = jogadores.filter(
      (jogador) => jogador.tipo === "LINHA"
    ).length;

    return {
      gols,
      assistencias,
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
        if (b.gols !== a.gols) {
          return b.gols - a.gols;
        }

        return a.nome.localeCompare(b.nome);
      })
      .slice(0, 10);
  }, [jogadores]);

  // =========================================================
  // ASSISTÊNCIAS
  // =========================================================

  const melhoresAssistentes = useMemo(() => {
    return [...jogadores]
      .sort((a, b) => {
        if (b.assistencias !== a.assistencias) {
          return b.assistencias - a.assistencias;
        }

        return a.nome.localeCompare(b.nome);
      })
      .slice(0, 10);
  }, [jogadores]);

  // =========================================================
  // RANKING DE ESTRELAS
  // =========================================================

  const rankingEstrelas = useMemo(() => {
    return [...jogadores]
      .sort((a, b) => {
        if (b.estrelas !== a.estrelas) {
          return b.estrelas - a.estrelas;
        }

        return a.nome.localeCompare(b.nome);
      })
      .slice(0, 10);
  }, [jogadores]);

  // =========================================================
  // DADOS DOS GRÁFICOS
  // =========================================================

  const dadosGols = useMemo(() => {
    return artilheiros.map((jogador) => ({
      nome: jogador.nome,
      gols: jogador.gols,
    }));
  }, [artilheiros]);

  const dadosAssistencias = useMemo(() => {
    return melhoresAssistentes.map((jogador) => ({
      nome: jogador.nome,
      assistencias: jogador.assistencias,
    }));
  }, [melhoresAssistentes]);

  // =========================================================
  // DEBUG DOS GRÁFICOS
  // =========================================================

  console.log("DADOS GOLS:", dadosGols);
  console.log("DADOS ASSISTÊNCIAS:", dadosAssistencias);

  // =========================================================
  // TOOLTIP
  // =========================================================

  const tooltipStyle = {
    backgroundColor: "#1b1f28",
    border: "1px solid #343a48",
    borderRadius: "10px",
    color: "#ffffff",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35)",
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

        <p>{erro}</p>
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

        </div>
      </div>

      {/* =====================================================
          CARDS DE RESUMO
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
          PÓDIO
      ===================================================== */}

      <section className="podio">

        {/* SEGUNDO */}

        <div className="podio-card segundo">

          <span className="medalha">
            🥈
          </span>

          <strong>
            {artilheiros[1]?.nome || "-"}
          </strong>

          <small>
            {artilheiros[1]?.gols || 0} gols
          </small>

        </div>

        {/* PRIMEIRO */}

        <div className="podio-card primeiro">

          <span className="medalha">
            🥇
          </span>

          <strong>
            {artilheiros[0]?.nome || "-"}
          </strong>

          <small>
            {artilheiros[0]?.gols || 0} gols
          </small>

        </div>

        {/* TERCEIRO */}

        <div className="podio-card terceiro">

          <span className="medalha">
            🥉
          </span>

          <strong>
            {artilheiros[2]?.nome || "-"}
          </strong>

          <small>
            {artilheiros[2]?.gols || 0} gols
          </small>

        </div>

      </section>

      {/* =====================================================
          GRÁFICOS
      ===================================================== */}

      <section className="graficos">

        {/* ===================================================
            GRÁFICO DE GOLS
        =================================================== */}

        <div className="grafico-card grafico-gols">

          <div className="grafico-header">

            <div>

              <span>⚽</span>

              <h2>
                Artilheiros
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
                    fill: "rgba(255,255,255,0.04)",
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
            GRÁFICO DE ASSISTÊNCIAS
        =================================================== */}

        <div className="grafico-card grafico-assistencias">

          <div className="grafico-header">

            <div>

              <span>🅰️</span>

              <h2>
                Assistências
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
                    fill: "rgba(255,255,255,0.04)",
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

      </section>

      {/* =====================================================
          LISTAS DO RANKING
      ===================================================== */}

      <section className="ranking-listas">

        {/* ===================================================
            ARTILHEIROS
        =================================================== */}

        <div className="ranking-lista">

          <div className="lista-ranking-header">

            <div>

              <span>⚽</span>

              <h2>
                Artilheiros
              </h2>

            </div>

            <small>
              Top 10
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
                  {jogador.gols} ⚽
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

              <span>⭐</span>

              <h2>
                Melhores avaliados
              </h2>

            </div>

            <small>
              Top 10
            </small>

          </div>

          {rankingEstrelas.map(
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

                <strong>
                  {"⭐".repeat(jogador.estrelas)}
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