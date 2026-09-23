import React, { useMemo, useRef, useState } from "react";

import "./PeladaPage.css";

import { sortearTimes } from "./sortearTimes";

import { nomesTimes } from "./nomesTimes";

function PeladaPage({ jogadores }) {
  const [selecionados, setSelecionados] = useState([]);

  const [jogadoresPorTime, setJogadoresPorTime] =
    useState(4);

  const [times, setTimes] = useState([]);

  const resultadoRef = useRef(null);

  // ==================================================
  // SELECIONAR / DESELECIONAR JOGADOR
  // ==================================================

  function alternarJogador(id) {
    setSelecionados((atuais) => {
      if (atuais.includes(id)) {
        return atuais.filter(
          (jogadorId) => jogadorId !== id
        );
      }

      return [...atuais, id];
    });
  }

  // ==================================================
  // SELECIONAR TODOS
  // ==================================================

  function selecionarTodos() {
    setSelecionados(
      jogadores.map((jogador) => jogador.id)
    );
  }

  // ==================================================
  // LIMPAR
  // ==================================================

  function limparSelecao() {
    setSelecionados([]);
    setTimes([]);
  }

  // ==================================================
  // JOGADORES PRESENTES
  // ==================================================

  const jogadoresPresentes = useMemo(() => {
    return jogadores.filter((jogador) =>
      selecionados.includes(jogador.id)
    );
  }, [jogadores, selecionados]);

  // ==================================================
  // GOLEIROS
  // ==================================================

  const goleirosPresentes = useMemo(() => {
    return jogadoresPresentes.filter(
      (jogador) =>
        jogador.tipo
          ?.trim()
          .toUpperCase() === "GOLEIRO"
    );
  }, [jogadoresPresentes]);

  // ==================================================
  // JOGADORES DE LINHA
  // ==================================================

  const jogadoresLinhaPresentes = useMemo(() => {
    return jogadoresPresentes.filter(
      (jogador) =>
        jogador.tipo
          ?.trim()
          .toUpperCase() !== "GOLEIRO"
    );
  }, [jogadoresPresentes]);

  // ==================================================
  // SORTEAR TIMES
  // ==================================================

  function realizarSorteio() {
    if (jogadoresLinhaPresentes.length === 0) {
      alert(
        "Selecione pelo menos um jogador de linha."
      );

      return;
    }

    if (goleirosPresentes.length === 0) {
      const continuar = window.confirm(
        "Nenhum goleiro foi selecionado. Deseja continuar mesmo assim?"
      );

      if (!continuar) {
        return;
      }
    }

    const resultado = sortearTimes(
      jogadoresPresentes,
      jogadoresPorTime,
      nomesTimes
    );

    setTimes(resultado);

    setTimeout(() => {
      resultadoRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }

  // ==================================================
  // PRIMEIRA PARTIDA
  // ==================================================

  const primeiraPartida = useMemo(() => {
    if (times.length < 2) {
      return null;
    }

    return {
      time1: times[0],
      time2: times[1],
    };
  }, [times]);

  // ==================================================
  // COPIAR TIMES
  // ==================================================

  async function copiarTimes() {
    if (times.length === 0) {
      return;
    }

    let texto = "";

    texto += "⚽ PELADA APP\n";
    texto += "🏆 TIMES SORTEADOS\n";
    texto +=
      "━━━━━━━━━━━━━━━━━━━━\n\n";

    times.forEach((time) => {
      texto +=
        `🔢 ${time.numero} - ${time.nome}\n`;

      if (time.goleiro) {
        texto +=
          `🧤 Goleiro: ${time.goleiro.nome}\n`;
      } else {
        texto +=
          "🧤 Goleiro: Não definido\n";
      }

      if (time.jogadores.length > 0) {
        time.jogadores.forEach((jogador) => {
          texto +=
            `⚽ ${jogador.nome}\n`;
        });
      } else {
        texto +=
          "⚽ Jogadores: Aguardando\n";
      }

      texto +=
        `⭐ Força: ${time.forca}\n`;

      texto += "\n";
    });

    texto +=
      "━━━━━━━━━━━━━━━━━━━━\n";

    texto +=
      "🔐 PELADA_APP_V1";

    try {
      await navigator.clipboard.writeText(
        texto
      );

      alert(
        "Times copiados! Agora é só mandar no grupo. 📋⚽"
      );
    } catch (error) {
      console.error(
        "Erro ao copiar times:",
        error
      );

      alert(
        "Não foi possível copiar os times."
      );
    }
  }

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <main className="pelada-page">

      {/* ==========================================
          TÍTULO
      ========================================== */}

      <div className="pelada-titulo">

        <span className="subtitle">
          ORGANIZAÇÃO
        </span>

        <h1>
          Pelada
        </h1>

        <p>
          Selecione quem está presente e
          monte times equilibrados.
        </p>

      </div>

      {/* ==========================================
          CONTROLES
      ========================================== */}

      <section className="pelada-controles">

        <div className="pelada-controle">

          <label>
            Jogadores de linha por time
          </label>

          <select
            value={jogadoresPorTime}
            onChange={(e) =>
              setJogadoresPorTime(
                Number(e.target.value)
              )
            }
          >
            <option value={4}>
              4 jogadores
            </option>

            <option value={5}>
              5 jogadores
            </option>

            <option value={6}>
              6 jogadores
            </option>

            <option value={7}>
              7 jogadores
            </option>

          </select>

        </div>

        <div className="pelada-acoes">

          <button
            type="button"
            onClick={selecionarTodos}
          >
            ☑️ Selecionar todos
          </button>

          <button
            type="button"
            onClick={limparSelecao}
          >
            Limpar
          </button>

        </div>

      </section>

      {/* ==========================================
          JOGADORES
      ========================================== */}

      <section className="pelada-selecao">

        <div className="pelada-selecao-header">

          <div>

            <h2 className="titulo-cont">
              Jogadores presentes
            </h2>

            <span>
              {selecionados.length} selecionados
            </span>

          </div>

        </div>

        <div className="pelada-jogadores">

          {jogadores.map((jogador) => {

            const selecionado =
              selecionados.includes(
                jogador.id
              );

            const goleiro =
              jogador.tipo
                ?.trim()
                .toUpperCase() ===
              "GOLEIRO";

            return (
              <button
                type="button"
                key={jogador.id}
                className={
                  `pelada-jogador ${
                    selecionado
                      ? "selecionado"
                      : ""
                  }`
                }
                onClick={() =>
                  alternarJogador(
                    jogador.id
                  )
                }
              >

                <span className="pelada-check">
                  {selecionado ? "✓" : ""}
                </span>

                <span className="pelada-avatar">
                  {jogador.nome
                    ?.charAt(0)
                    ?.toUpperCase()}
                </span>

                <span className="pelada-jogador-info">

                  <strong>
                    {jogador.nome}
                  </strong>

                  <small>
                    {goleiro
                      ? "🧤 Goleiro"
                      : "⚽ Linha"}
                  </small>

                </span>

                <span className="pelada-estrelas">
                  {"⭐".repeat(
                    Number(
                      jogador.estrelas
                    ) || 0
                  )}
                </span>

              </button>
            );
          })}

        </div>

      </section>

      {/* ==========================================
          RESUMO
      ========================================== */}

      <section className="pelada-resumo">

        <div>

          <strong>
            {jogadoresLinhaPresentes.length}
          </strong>

          <span>
            jogadores de linha
          </span>

        </div>

        <div>

          <strong>
            {goleirosPresentes.length}
          </strong>

          <span>
            goleiros
          </span>

        </div>

        <div>

          <strong>
            {selecionados.length}
          </strong>

          <span>
            presentes
          </span>

        </div>

      </section>

      {/* ==========================================
          SORTEAR
      ========================================== */}

      <button
        type="button"
        className="botao-sortear"
        onClick={realizarSorteio}
      >
        🎲 Sortear times
      </button>

      {/* ==========================================
          RESULTADO
      ========================================== */}

      {times.length > 0 && (

        <section
          className="times-resultado"
          ref={resultadoRef}
        >

          {/* CABEÇALHO */}

          <div className="times-header">

            <div>

              <span className="subtitle">
                RESULTADO
              </span>

              <h2>
                Times sorteados
              </h2>

            </div>

            <div className="times-acoes">

              <button
                type="button"
                className="botao-copiar-times"
                onClick={copiarTimes}
              >
                📋 Copiar times
              </button>

              <button
                type="button"
                onClick={realizarSorteio}
              >
                🔄 Sortear novamente
              </button>

            </div>

          </div>

          {/* ======================================
              PRIMEIRA PARTIDA
          ====================================== */}

          {primeiraPartida && (

            <div className="proxima-partida">

              <span className="subtitle">
                PRIMEIRA PARTIDA
              </span>

              <h3>
                ⚔️ Quem joga primeiro?
              </h3>

              <div className="confronto">

                <div className="confronto-time">

                  <span className="numero-time">
                    {primeiraPartida.time1.numero}
                  </span>

                  <strong>
                    {primeiraPartida.time1.nome}
                  </strong>

                </div>

                <span className="versus">
                  ×
                </span>

                <div className="confronto-time">

                  <span className="numero-time">
                    {primeiraPartida.time2.numero}
                  </span>

                  <strong>
                    {primeiraPartida.time2.nome}
                  </strong>

                </div>

              </div>

              <p>
                O vencedor continua e enfrenta
                o próximo time da fila.
              </p>

            </div>

          )}

          {/* ======================================
              FILA
          ====================================== */}

          <div className="fila-times">

            <div className="fila-header">

              <span className="subtitle">
                ORDEM DA FILA
              </span>

              <p>
                Os números definem a ordem
                dos confrontos.
              </p>

            </div>

            <div className="fila-lista">

              {times.map((time, index) => (

                <div
                  className={
                    `fila-time ${
                      index < 2
                        ? "fila-primeiros"
                        : ""
                    }`
                  }
                  key={time.numero}
                >

                  <span className="numero-time">
                    {time.numero}
                  </span>

                  <strong>
                    {time.nome}
                  </strong>

                  {index < 2 && (

                    <span className="fila-status">
                      ⚔️ Jogando
                    </span>

                  )}

                  {index >= 2 && (

                    <span className="fila-status">
                      🔒 Cerca {index - 1}
                    </span>

                  )}

                </div>

              ))}

            </div>

          </div>

          {/* ======================================
              CARDS DOS TIMES
          ====================================== */}

          <div className="times-grid">

            {times.map((time) => (

              <article
                className={
                  `time-card ${
                    time.jogadores.length === 0
                      ? "time-vazio"
                      : ""
                  }`
                }
                key={time.numero}
              >

                <div className="time-card-header">

                  <div className="time-identificacao">

                    <span className="numero-time-card">
                      {time.numero}
                    </span>

                    <h3>
                      🏆 {time.nome}
                    </h3>

                  </div>

                  <span>
                    Força: {time.forca}
                  </span>

                </div>

                {/* GOLEIRO */}

                <div className="time-goleiro">

                  <span>
                    🧤
                  </span>

                  <strong>
                    {time.goleiro
                      ? time.goleiro.nome
                      : "Sem goleiro"}
                  </strong>

                </div>

                {/* JOGADORES */}

                <div className="time-jogadores">

                  {time.jogadores.length > 0 ? (

                    time.jogadores.map(
                      (jogador) => (

                        <div
                          className="time-jogador"
                          key={jogador.id}
                        >

                          <span>
                            {jogador.nome}
                          </span>

                          <small>
                            {"⭐".repeat(
                              Number(
                                jogador.estrelas
                              ) || 0
                            )}
                          </small>

                        </div>

                      )
                    )

                  ) : (

                    <div className="time-sem-jogadores">

                      <span>
                        👤
                      </span>

                      <strong>
                        Aguardando jogadores
                      </strong>

                      <small>
                        Time disponível para
                        jogadores atrasados
                      </small>

                    </div>

                  )}

                </div>

              </article>

            ))}

          </div>

        </section>

      )}

    </main>
  );
}

export default PeladaPage;

