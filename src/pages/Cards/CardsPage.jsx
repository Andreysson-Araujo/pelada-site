import React, { useEffect, useState } from "react";

import "./CardsPage.css";

import {
  calcularOVRJogador
} from "./cardUtils";

function CardsPage({ jogadores }) {
  const [cards, setCards] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  /* =========================
     CARREGAR CARDS.TXT
  ========================= */

  useEffect(() => {
    async function carregarCards() {
      try {
        const resposta = await fetch("/cards.txt");

        if (!resposta.ok) {
          throw new Error(
            "Não foi possível carregar cards.txt"
          );
        }

        const texto = await resposta.text();

        /* =========================
           VALIDAR ARQUIVO
        ========================= */

        if (!texto.includes("PELADA_CARDS_V1")) {
          throw new Error(
            "Arquivo cards.txt inválido."
          );
        }

        const linhas = texto.split("\n");

        const cardsLidos = [];

        /* =========================
           LER CARDS
        ========================= */

        linhas.forEach((linha) => {
          const textoLinha = linha.trim();

          // Ignora títulos e linhas vazias
          if (!textoLinha.startsWith("🆔")) {
            return;
          }

          const partes = textoLinha
            .split("|")
            .map((parte) => parte.trim());

          /*
           * Formato esperado:
           *
           * 🆔 001 | ATA 20 | DEF 20 |
           * VEL 20 | PAS 20 | DRI 20
           */

          if (partes.length < 6) {
            console.warn(
              "Linha de card inválida:",
              textoLinha
            );

            return;
          }

          /* =========================
             ID
          ========================= */

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

          /* =========================
             ATAQUE
          ========================= */

          const ataque =
            Number(
              partes[1]
                .replace("ATA", "")
                .trim()
            ) || 0;

          /* =========================
             DEFESA
          ========================= */

          const defesa =
            Number(
              partes[2]
                .replace("DEF", "")
                .trim()
            ) || 0;

          /* =========================
             VELOCIDADE
          ========================= */

          const velocidade =
            Number(
              partes[3]
                .replace("VEL", "")
                .trim()
            ) || 0;

          /* =========================
             PASSE
          ========================= */

          const passe =
            Number(
              partes[4]
                .replace("PAS", "")
                .trim()
            ) || 0;

          /* =========================
             DRIBLE
          ========================= */

          const drible =
            Number(
              partes[5]
                .replace("DRI", "")
                .trim()
            ) || 0;

          /* =========================
             SALVAR CARD
          ========================= */

          cardsLidos.push({
            id,
            ataque,
            defesa,
            velocidade,
            passe,
            drible,
          });
        });

        console.log(
          "CARDS LIDOS:",
          cardsLidos
        );

        /* =========================
           VINCULAR COM JOGADORES
        ========================= */

        const jogadoresComCards =
          jogadores.map((jogador) => {

            const card =
              cardsLidos.find(
                (item) =>
                  item.id === jogador.id
              );

            /*
             * Se o jogador possui card,
             * usa os atributos cadastrados.
             *
             * Caso contrário, cria atributos
             * zerados para evitar erro.
             */

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
            };
          });

        console.log(
          "JOGADORES + CARDS:",
          jogadoresComCards
        );

        setCards(jogadoresComCards);

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

  }, [jogadores]);

  /* =========================
     CARREGANDO
  ========================= */

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

  /* =========================
     ERRO
  ========================= */

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

  /* =========================
     PÁGINA DE CARDS
  ========================= */

  return (
    <main className="cards-page">

      {/* =========================
          CABEÇALHO
      ========================= */}

      <div className="cards-header">

        <div>

          <span className="cards-subtitle">
            PELADA APP
          </span>

          <h1>
            🃏 Cards dos Jogadores
          </h1>

          <p>
            {cards.length} cards cadastrados
          </p>

        </div>

        <div className="cards-arquivo">
          📄 cards.txt
        </div>

      </div>

      {/* =========================
          GRID
      ========================= */}

      <div className="cards-grid">

        {cards.map((jogador) => {

          /* =========================
             CALCULAR OVR
          ========================= */

          const ovr =
            calcularOVRJogador(
              jogador
            );

          return (
            <div
              className="card-jogador"
              key={jogador.id}
            >

              {/* =========================
                  TOPO DO CARD
              ========================= */}

              <div className="card-topo">

                <span className="card-id">
                  ID {jogador.id}
                </span>

                {/* =========================
                    OVR
                ========================= */}

                <div className="card-ovr">

                  <span>
                    OVR
                  </span>

                  <strong>
                    {ovr}
                  </strong>

                </div>

              </div>

              {/* =========================
                  NOME
              ========================= */}

              <div className="card-nome">
                {jogador.nome}
              </div>

              {/* =========================
                  POSIÇÃO
              ========================= */}

              <div className="card-tipo">
                {jogador.tipo}
              </div>

              {/* =========================
                  ESTRELAS
              ========================= */}

              <div className="card-estrelas">

                {"⭐".repeat(
                  Math.max(
                    0,
                    jogador.estrelas
                  )
                )}

              </div>

              {/* =========================
                  ATRIBUTOS
              ========================= */}

              <div className="card-atributos">

                <div className="atributo">
                  <span>ATA</span>

                  <strong>
                    {jogador.atributos.ataque}
                  </strong>
                </div>

                <div className="atributo">
                  <span>DEF</span>

                  <strong>
                    {jogador.atributos.defesa}
                  </strong>
                </div>

                <div className="atributo">
                  <span>VEL</span>

                  <strong>
                    {jogador.atributos.velocidade}
                  </strong>
                </div>

                <div className="atributo">
                  <span>PAS</span>

                  <strong>
                    {jogador.atributos.passe}
                  </strong>
                </div>

                <div className="atributo">
                  <span>DRI</span>

                  <strong>
                    {jogador.atributos.drible}
                  </strong>
                </div>

              </div>

            </div>
          );
        })}

      </div>

    </main>
  );
}

export default CardsPage;