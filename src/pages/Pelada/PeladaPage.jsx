import React, {
  useMemo,
  useRef,
  useState,
} from "react";

import "./PeladaPage.css";

import { sortearTimes } from "./sortearTimes";
import { nomesTimes } from "./nomesTimes";

function PeladaPage({ jogadores }) {
  // ==================================================
  // ESTADOS
  // ==================================================

  const [textoLista, setTextoLista] =
    useState("");

  const [
    listaProcessada,
    setListaProcessada,
  ] = useState(false);

  const [
    jogadoresPresentes,
    setJogadoresPresentes,
  ] = useState([]);

  const [
    jogadoresPorTime,
    setJogadoresPorTime,
  ] = useState(4);

  const [times, setTimes] =
    useState([]);

  const resultadoRef =
    useRef(null);

  const [
    restricoes,
    setRestricoes,
  ] = useState([]);

  const [
    jogadorRestricaoA,
    setJogadorRestricaoA,
  ] = useState("");

  const [
    jogadorRestricaoB,
    setJogadorRestricaoB,
  ] = useState("");

  // ==================================================
  // NORMALIZAR NOME
  // ==================================================

  function normalizarNome(nome) {
    return String(nome || "")
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      )
      .replace(
        /[\u200B-\u200D\uFEFF]/g,
        ""
      )
      .replace(
        /⁠/g,
        ""
      )
      .trim()
      .toLowerCase()
      .replace(
        /\s+/g,
        " "
      );
  }

  // ==================================================
  // PROCESSAR LISTA DO WHATSAPP
  // ==================================================

  function processarLista() {
    if (
      !textoLista.trim()
    ) {
      alert(
        "Cole primeiro a lista da pelada."
      );

      return;
    }

    const linhas =
      textoLista
        .split(/\r?\n/)
        .map((linha) =>
          linha
            .replace(
              /[\u200B-\u200D\uFEFF]/g,
              ""
            )
            .replace(
              /⁠/g,
              ""
            )
            .trim()
        )
        .filter(Boolean);

    const nomesDaLista = [];

    let categoria = null;

    // ==================================================
    // LER TODAS AS LINHAS
    // ==================================================

    linhas.forEach(
      (linha) => {
        const linhaMaiuscula =
          linha
            .normalize("NFD")
            .replace(
              /[\u0300-\u036f]/g,
              ""
            )
            .toUpperCase();

        // ----------------------------------------------
        // GOLEIRO
        // ----------------------------------------------

        if (
          linhaMaiuscula.includes(
            "GOLEIRO"
          )
        ) {
          categoria =
            "GOLEIRO";

          return;
        }

        // ----------------------------------------------
        // JOGADORES DE LINHA
        // ----------------------------------------------

        if (
          linhaMaiuscula.includes(
            "JOGADOR LINHA"
          ) ||
          linhaMaiuscula.includes(
            "JOGADORES LINHA"
          ) ||
          linhaMaiuscula.includes(
            "JOGADOR DE LINHA"
          ) ||
          linhaMaiuscula.includes(
            "JOGADORES DE LINHA"
          )
        ) {
          categoria =
            "JOGADOR";

          return;
        }

        // ----------------------------------------------
        // SEPARADORES
        // ----------------------------------------------

        if (
          /^[-_=]+$/.test(
            linha.replace(
              /\s/g,
              ""
            )
          )
        ) {
          return;
        }

        // ----------------------------------------------
        // CABEÇALHOS
        // ----------------------------------------------

        if (
          linhaMaiuscula.includes(
            "PELADA DOS MORTOS"
          ) ||
          linhaMaiuscula.includes(
            "PELADA APP"
          ) ||
          linhaMaiuscula.includes(
            "CAMPO SINTETICO"
          ) ||
          linhaMaiuscula.includes(
            "CAMPO SINTÉTICO"
          ) ||
          linhaMaiuscula.includes(
            "TERCA"
          ) ||
          linhaMaiuscula.includes(
            "TERÇA"
          ) ||
          linhaMaiuscula.includes(
            "21H"
          ) ||
          linhaMaiuscula.includes(
            "22H"
          ) ||
          linhaMaiuscula.includes(
            "23H"
          )
        ) {
          return;
        }

        // ----------------------------------------------
        // AINDA NÃO CHEGOU NA LISTA
        // ----------------------------------------------

        if (!categoria) {
          return;
        }

        // ----------------------------------------------
        // REMOVER NÚMERO
        // ----------------------------------------------

        let nome =
          linha.replace(
            /^\s*\d+\s*[.)\-:]?\s*/,
            ""
          );

        // ----------------------------------------------
        // REMOVER CARACTERES DE LISTA
        // ----------------------------------------------

        nome = nome
          .replace(
            /^[•▪️🔹🔸◾◽]+\s*/,
            ""
          )
          .replace(
            /[\u200B-\u200D\uFEFF]/g,
            ""
          )
          .replace(
            /⁠/g,
            ""
          )
          .trim();

        if (!nome) {
          return;
        }

        // ----------------------------------------------
        // ADICIONAR
        // ----------------------------------------------

        nomesDaLista.push({
          nome,
          tipo: categoria,
        });
      }
    );

    // ==================================================
    // SEPARAR NOMES DUPLICADOS
    // ==================================================

    const nomesUnicos =
      nomesDaLista.filter(
        (item, index, array) =>
          index ===
          array.findIndex(
            (outro) =>
              normalizarNome(
                outro.nome
              ) ===
              normalizarNome(
                item.nome
              )
          )
      );

    // ==================================================
    // TRANSFORMAR NOMES EM JOGADORES
    // ==================================================

    const encontrados = [];

    nomesUnicos.forEach(
      (
        item,
        index
      ) => {
        const nomeNormalizado =
          normalizarNome(
            item.nome
          );

        // ----------------------------------------------
        // PROCURAR CADASTRADO
        // ----------------------------------------------

        let jogador =
          jogadores.find(
            (jogador) =>
              normalizarNome(
                jogador.nome
              ) ===
              nomeNormalizado
          );

        // ----------------------------------------------
        // BUSCA MAIS FLEXÍVEL
        // ----------------------------------------------

        if (!jogador) {
          jogador =
            jogadores.find(
              (jogador) => {
                const nomeBanco =
                  normalizarNome(
                    jogador.nome
                  );

                return (
                  nomeBanco.includes(
                    nomeNormalizado
                  ) ||
                  nomeNormalizado.includes(
                    nomeBanco
                  )
                );
              }
            );
        }

        // ==================================================
        // CADASTRADO
        // ==================================================

        if (jogador) {
          encontrados.push({
            ...jogador,

            // O tipo da lista tem prioridade
            tipo: item.tipo,

            temporario: false,
          });

          return;
        }

        // ==================================================
        // NÃO CADASTRADO
        // ==================================================
        //
        // ELE ENTRA MESMO ASSIM
        // ==================================================

        encontrados.push({
          id: `lista-${Date.now()}-${index}`,

          nome: item.nome,

          tipo: item.tipo,

          estrelas: 0,

          temporario: true,
        });
      }
    );

    // ==================================================
    // VERIFICAR
    // ==================================================

    if (
      encontrados.length ===
      0
    ) {
      alert(
        "Nenhum jogador foi encontrado na lista."
      );

      return;
    }

    // ==================================================
    // SALVAR
    // ==================================================

    setJogadoresPresentes(
      encontrados
    );

    setRestricoes([]);

    setJogadorRestricaoA("");

    setJogadorRestricaoB("");

    setTimes([]);

    setListaProcessada(
      true
    );

    // ==================================================
    // CONTAGEM
    // ==================================================

    const cadastrados =
      encontrados.filter(
        (jogador) =>
          !jogador.temporario
      ).length;

    const temporarios =
      encontrados.filter(
        (jogador) =>
          jogador.temporario
      ).length;

    // ==================================================
    // MENSAGEM
    // ==================================================

    setTimeout(() => {
      alert(
        `Lista processada!\n\n` +
          `👥 Total: ${encontrados.length}\n` +
          `✅ Cadastrados: ${cadastrados}\n` +
          `🆕 Vindos da lista: ${temporarios}`
      );
    }, 100);

    // ==================================================
    // ROLAR
    // ==================================================

    setTimeout(() => {
      document
        .querySelector(
          ".pelada-configuracao"
        )
        ?.scrollIntoView({
          behavior:
            "smooth",
          block: "start",
        });
    }, 150);
  }

  // ==================================================
  // REMOVER/ADICIONAR JOGADOR
  // ==================================================

  function alternarPresenca(
    id
  ) {
    setJogadoresPresentes(
      (atuais) => {
        const existe =
          atuais.some(
            (jogador) =>
              jogador.id === id
          );

        if (existe) {
          return atuais.filter(
            (jogador) =>
              jogador.id !== id
          );
        }

        const jogador =
          jogadores.find(
            (item) =>
              item.id === id
          );

        if (!jogador) {
          return atuais;
        }

        return [
          ...atuais,
          jogador,
        ];
      }
    );

    setTimes([]);
  }

  // ==================================================
  // GOLEIROS
  // ==================================================

  const goleirosPresentes =
    useMemo(() => {
      return jogadoresPresentes.filter(
        (jogador) =>
          jogador.tipo
            ?.trim()
            .toUpperCase() ===
          "GOLEIRO"
      );
    }, [
      jogadoresPresentes,
    ]);

  // ==================================================
  // JOGADORES DE LINHA
  // ==================================================

  const jogadoresLinhaPresentes =
    useMemo(() => {
      return jogadoresPresentes.filter(
        (jogador) =>
          jogador.tipo
            ?.trim()
            .toUpperCase() !==
          "GOLEIRO"
      );
    }, [
      jogadoresPresentes,
    ]);

  // ==================================================
  // ADICIONAR RESTRIÇÃO
  // ==================================================

  function adicionarRestricao() {
    if (
      !jogadorRestricaoA ||
      !jogadorRestricaoB
    ) {
      alert(
        "Selecione os dois jogadores."
      );

      return;
    }

    if (
      jogadorRestricaoA ===
      jogadorRestricaoB
    ) {
      alert(
        "Escolha jogadores diferentes."
      );

      return;
    }

    const existe =
      restricoes.some(
        ([a, b]) =>
          (a ===
            jogadorRestricaoA &&
            b ===
              jogadorRestricaoB) ||
          (a ===
            jogadorRestricaoB &&
            b ===
              jogadorRestricaoA)
      );

    if (existe) {
      alert(
        "Essa restrição já foi adicionada."
      );

      return;
    }

    setRestricoes(
      (atuais) => [
        ...atuais,
        [
          jogadorRestricaoA,
          jogadorRestricaoB,
        ],
      ]
    );

    setJogadorRestricaoA("");

    setJogadorRestricaoB("");

    setTimes([]);
  }

  // ==================================================
  // REMOVER RESTRIÇÃO
  // ==================================================

  function removerRestricao(
    index
  ) {
    setRestricoes(
      (atuais) =>
        atuais.filter(
          (_, i) =>
            i !== index
        )
    );

    setTimes([]);
  }

  // ==================================================
  // REALIZAR SORTEIO
  // ==================================================

  function realizarSorteio() {
    if (
      jogadoresLinhaPresentes.length ===
      0
    ) {
      alert(
        "Nenhum jogador de linha foi selecionado."
      );

      return;
    }

    if (
      goleirosPresentes.length ===
      0
    ) {
      const continuar =
        window.confirm(
          "Nenhum goleiro foi selecionado.\n\nDeseja continuar mesmo assim?"
        );

      if (!continuar) {
        return;
      }
    }

    try {
      const resultado =
        sortearTimes(
          jogadoresPresentes,
          jogadoresPorTime,
          nomesTimes,
          restricoes
        );

      setTimes(
        resultado
      );

      setTimeout(() => {
        resultadoRef.current?.scrollIntoView(
          {
            behavior:
              "smooth",
            block: "start",
          }
        );
      }, 100);
    } catch (error) {
      console.error(
        "Erro no sorteio:",
        error
      );

      alert(
        error.message ||
          "Não foi possível realizar o sorteio."
      );
    }
  }

  // ==================================================
  // PRIMEIRA PARTIDA
  // ==================================================

  const primeiraPartida =
    useMemo(() => {
      if (
        times.length < 2
      ) {
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
    if (
      times.length === 0
    ) {
      return;
    }

    let texto =
      "⚰️☠️ PELADA DOS MORTOS\n";

    texto +=
      "🏆 TIMES SORTEADOS\n";

    texto +=
      "━━━━━━━━━━━━━━━━━━━━\n\n";

    times.forEach(
      (time) => {
        texto +=
          `🔢 ${time.numero} - ${time.nome}\n`;

        if (
          time.goleiro
        ) {
          texto +=
            `🧤 Goleiro: ${time.goleiro.nome}\n`;
        } else {
          texto +=
            "🧤 Goleiro: Não definido\n";
        }

        if (
          time.jogadores
            .length > 0
        ) {
          time.jogadores.forEach(
            (jogador) => {
              texto +=
                `⚽ ${jogador.nome}\n`;
            }
          );
        } else {
          texto +=
            "⚽ Jogadores: Aguardando\n";
        }

        texto +=
          `⭐ Força: ${time.forca}\n`;

        texto += "\n";
      }
    );

    texto +=
      "━━━━━━━━━━━━━━━━━━━━\n";

    texto +=
      "🔐 PELADA_APP_V1";

    try {
      await navigator.clipboard.writeText(
        texto
      );

      alert(
        "Times copiados! 📋⚽"
      );
    } catch (error) {
      console.error(
        "Erro ao copiar:",
        error
      );

      alert(
        "Não foi possível copiar os times."
      );
    }
  }

  // ==================================================
  // LIMPAR TUDO
  // ==================================================

  function limparTudo() {
    setTextoLista("");

    setListaProcessada(
      false
    );

    setJogadoresPresentes(
      []
    );

    setRestricoes([]);

    setJogadorRestricaoA(
      ""
    );

    setJogadorRestricaoB(
      ""
    );

    setTimes([]);
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
          Cole a lista do WhatsApp
          e monte times
          equilibrados.
        </p>

      </div>

      {/* ==========================================
          IMPORTAR LISTA
      ========================================== */}

      {!listaProcessada && (
        <section className="pelada-importacao">

          <div className="pelada-secao-titulo">

            <span className="subtitle">
              LISTA DA PELADA
            </span>

            <h2>
              Cole a lista do WhatsApp
            </h2>

            <p>
              O sistema identifica
              goleiros e jogadores
              de linha automaticamente.
            </p>

          </div>

          <textarea
            className="pelada-textarea"
            value={textoLista}
            onChange={(event) =>
              setTextoLista(
                event.target.value
              )
            }
            placeholder={`⚰️☠️PELADA DOS MORTOS

🕘21h às 23h ou mais
🗓️ TERÇA-FEIRA - XX/XX
📍CAMPO SINTÉTICO TANGARÁ

___________________
GOLEIRO
1. GOLEIRO 1
2. GOleiro 2

____________________
JOGADOR LINHA
1. Jogador 1
2. Jogador 2
3. Jogador 3
4. Jogador 4
5. Jogador 5
`}
          />

          <div className="pelada-importacao-acoes">

            <button
              type="button"
              className="botao-sortear"
              onClick={
                processarLista
              }
            >
              📋 Processar lista
            </button>

          </div>

        </section>
      )}

      {/* ==========================================
          CONFIGURAÇÃO
      ========================================== */}

      {listaProcessada && (
        <section className="pelada-configuracao">

          {/* ========================================
              CONTROLES
          ======================================== */}

          <section className="pelada-controles">

            <div className="pelada-controle">

              <label>
                Jogadores de linha
                por time
              </label>

              <select
                value={
                  jogadoresPorTime
                }
                onChange={(
                  event
                ) =>
                  setJogadoresPorTime(
                    Number(
                      event.target
                        .value
                    )
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
                onClick={
                  limparTudo
                }
              >
                🔄 Nova lista
              </button>

            </div>

          </section>

          {/* ========================================
              JOGADORES
          ======================================== */}

          <section className="pelada-selecao">

            <div className="pelada-selecao-header">

              <div>

                <h2 className="titulo-cont">
                  Jogadores presentes
                </h2>

                <span>
                  {
                    jogadoresPresentes.length
                  }{" "}
                  presentes
                </span>

              </div>

            </div>

            <div className="pelada-jogadores">

              {jogadoresPresentes.map(
                (jogador) => {
                  const goleiro =
                    jogador.tipo
                      ?.trim()
                      .toUpperCase() ===
                    "GOLEIRO";

                  return (
                    <button
                      type="button"
                      key={
                        jogador.id
                      }
                      className="pelada-jogador selecionado"
                      onClick={() =>
                        alternarPresenca(
                          jogador.id
                        )
                      }
                    >

                      <span className="pelada-check">
                        ✓
                      </span>

                      <span className="pelada-avatar">
                        {jogador.nome
                          ?.charAt(
                            0
                          )
                          ?.toUpperCase()}
                      </span>

                      <span className="pelada-jogador-info">

                        <strong>
                          {
                            jogador.nome
                          }

                          {jogador.temporario && (
                            <small
                              style={{
                                display:
                                  "block",
                                opacity:
                                  0.65,
                              }}
                            >
                              🆕 Não
                              cadastrado
                            </small>
                          )}

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
                }
              )}

            </div>

            <p className="pelada-ajuda">
              Clique em um jogador
              para retirá-lo da pelada.
            </p>

          </section>

          {/* ========================================
              RESUMO
          ======================================== */}

          <section className="pelada-resumo">

            <div>

              <strong>
                {
                  jogadoresLinhaPresentes.length
                }
              </strong>

              <span>
                jogadores de linha
              </span>

            </div>

            <div>

              <strong>
                {
                  goleirosPresentes.length
                }
              </strong>

              <span>
                goleiros
              </span>

            </div>

            <div>

              <strong>
                {
                  jogadoresPresentes.length
                }
              </strong>

              <span>
                presentes
              </span>

            </div>

          </section>

          {/* ========================================
              RESTRIÇÕES
          ======================================== */}

          <section className="pelada-restricoes">

            <div className="pelada-secao-titulo">

              <span className="subtitle">
                REGRAS DO SORTEIO
              </span>

              <h2>
                🚫 Não podem ficar
                juntos
              </h2>

              <p>
                Escolha dois jogadores
                que não podem cair no
                mesmo time.
              </p>

            </div>

            <div className="restricao-form">

              <select
                value={
                  jogadorRestricaoA
                }
                onChange={(
                  event
                ) =>
                  setJogadorRestricaoA(
                    event.target
                      .value
                  )
                }
              >

                <option value="">
                  Jogador 1
                </option>

                {jogadoresLinhaPresentes.map(
                  (jogador) => (
                    <option
                      key={
                        jogador.id
                      }
                      value={
                        jogador.nome
                      }
                    >
                      {
                        jogador.nome
                      }
                    </option>
                  )
                )}

              </select>

              <span className="restricao-x">
                ×
              </span>

              <select
                value={
                  jogadorRestricaoB
                }
                onChange={(
                  event
                ) =>
                  setJogadorRestricaoB(
                    event.target
                      .value
                  )
                }
              >

                <option value="">
                  Jogador 2
                </option>

                {jogadoresLinhaPresentes.map(
                  (jogador) => (
                    <option
                      key={
                        jogador.id
                      }
                      value={
                        jogador.nome
                      }
                    >
                      {
                        jogador.nome
                      }
                    </option>
                  )
                )}

              </select>

              <button
                type="button"
                onClick={
                  adicionarRestricao
                }
              >
                + Adicionar
              </button>

            </div>

            {/* --------------------------------------
                RESTRIÇÕES ADICIONADAS
            -------------------------------------- */}

            {restricoes.length >
              0 && (
              <div className="restricoes-lista">

                {restricoes.map(
                  (
                    [
                      jogadorA,
                      jogadorB,
                    ],
                    index
                  ) => (
                    <div
                      className="restricao-item"
                      key={
                        `${jogadorA}-${jogadorB}`
                      }
                    >

                      <strong>
                        {
                          jogadorA
                        }
                      </strong>

                      <span>
                        🚫
                      </span>

                      <strong>
                        {
                          jogadorB
                        }
                      </strong>

                      <button
                        type="button"
                        onClick={() =>
                          removerRestricao(
                            index
                          )
                        }
                        aria-label="Remover restrição"
                      >
                        ×
                      </button>

                    </div>
                  )
                )}

              </div>
            )}

          </section>

          {/* ========================================
              SORTEAR
          ======================================== */}

          <button
            type="button"
            className="botao-sortear"
            onClick={
              realizarSorteio
            }
          >
            🎲 Sortear times
          </button>

        </section>
      )}

      {/* ==========================================
          RESULTADO
      ========================================== */}

      {times.length > 0 && (
        <section
          className="times-resultado"
          ref={resultadoRef}
        >

          {/* ========================================
              CABEÇALHO
          ======================================== */}

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
                onClick={
                  copiarTimes
                }
              >
                📋 Copiar times
              </button>

              <button
                type="button"
                onClick={
                  realizarSorteio
                }
              >
                🔄 Sortear novamente
              </button>

            </div>

          </div>

          {/* ========================================
              PRIMEIRA PARTIDA
          ======================================== */}

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
                    {
                      primeiraPartida
                        .time1
                        .numero
                    }
                  </span>

                  <strong>
                    {
                      primeiraPartida
                        .time1
                        .nome
                    }
                  </strong>

                </div>

                <span className="versus">
                  ×
                </span>

                <div className="confronto-time">

                  <span className="numero-time">
                    {
                      primeiraPartida
                        .time2
                        .numero
                    }
                  </span>

                  <strong>
                    {
                      primeiraPartida
                        .time2
                        .nome
                    }
                  </strong>

                </div>

              </div>

              <p>
                O vencedor continua e
                enfrenta o próximo time
                da fila.
              </p>

            </div>
          )}

          {/* ========================================
              FILA
          ======================================== */}

          <div className="fila-times">

            <div className="fila-header">

              <span className="subtitle">
                ORDEM DA FILA
              </span>

              <p>
                Os números definem a
                ordem dos confrontos.
              </p>

            </div>

            <div className="fila-lista">

              {times.map(
                (
                  time,
                  index
                ) => (
                  <div
                    className={`fila-time ${
                      index < 2
                        ? "fila-primeiros"
                        : ""
                    }`}
                    key={
                      time.numero
                    }
                  >

                    <span className="numero-time">
                      {
                        time.numero
                      }
                    </span>

                    <strong>
                      {
                        time.nome
                      }
                    </strong>

                    {index < 2 ? (
                      <span className="fila-status">
                        ⚔️ Jogando
                      </span>
                    ) : (
                      <span className="fila-status">
                        🔒 Fila{" "}
                        {index - 1}
                      </span>
                    )}

                  </div>
                )
              )}

            </div>

          </div>

          {/* ========================================
              CARDS DOS TIMES
          ======================================== */}

          <div className="times-grid">

            {times.map(
              (time) => (
                <article
                  className={`time-card ${
                    time.jogadores
                      .length === 0
                      ? "time-vazio"
                      : ""
                  }`}
                  key={
                    time.numero
                  }
                >

                  {/* --------------------------------
                      CABEÇALHO
                  -------------------------------- */}

                  <div className="time-card-header">

                    <div className="time-identificacao">

                      <span className="numero-time-card">
                        {
                          time.numero
                        }
                      </span>

                      <h3>
                        🏆{" "}
                        {
                          time.nome
                        }
                      </h3>

                    </div>

                    <span>
                      Força:{" "}
                      {
                        time.forca
                      }
                    </span>

                  </div>

                  {/* --------------------------------
                      GOLEIRO
                  -------------------------------- */}

                  <div className="time-goleiro">

                    <span>
                      🧤
                    </span>

                    <strong>
                      {time.goleiro
                        ? time
                            .goleiro
                            .nome
                        : "Sem goleiro"}
                    </strong>

                  </div>

                  {/* --------------------------------
                      JOGADORES
                  -------------------------------- */}

                  <div className="time-jogadores">

                    {time.jogadores
                      .length >
                    0 ? (
                      time.jogadores.map(
                        (
                          jogador
                        ) => (
                          <div
                            className="time-jogador"
                            key={
                              jogador.id
                            }
                          >

                            <span>
                              {
                                jogador.nome
                              }

                              {jogador.temporario && (
                                <small
                                  style={{
                                    marginLeft:
                                      "6px",
                                    opacity:
                                      0.6,
                                  }}
                                >
                                  🆕
                                </small>
                              )}
                            </span>

                            <small>
                              {"⭐".repeat(
                                Number(
                                  jogador.estrelas
                                ) ||
                                  0
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
                          Aguardando
                          jogadores
                        </strong>

                        <small>
                          Time disponível
                          para jogadores
                          atrasados
                        </small>

                      </div>
                    )}

                  </div>

                </article>
              )
            )}

          </div>

        </section>
      )}

    </main>
  );
}

export default PeladaPage;