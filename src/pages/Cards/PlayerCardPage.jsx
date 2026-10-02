import React from "react";

import "./PlayerCardPage.css";
import { calcularOVRJogador } from "./cardUtils";

function PlayerCardPage({ jogador, onVoltar }) {
  if (!jogador) {
    return (
      <div className="player-card-page">

        <div className="player-card-erro">

          <h2>
            Jogador não encontrado
          </h2>

          <button
            className="player-card-voltar"
            onClick={onVoltar}
          >
            ← VOLTAR PARA CARDS
          </button>

        </div>

      </div>
    );
  }

  const atributos =
    jogador.atributos || {};

  const id =
    jogador.id;

  const nome =
    jogador.nome ||
    "JOGADOR";

  const tipo =
    jogador.tipo ||
    "JOGADOR";

  const estrelas =
    Number(
      jogador.estrelas
    ) || 0;


  /* =========================================================
     OVR
  ========================================================= */

  const ovr = calcularOVRJogador(jogador);


  /* =========================================================
     ESTATÍSTICAS DA TEMPORADA
     
     Vêm diretamente da API / Google Sheets.
  ========================================================= */

  const golsTemporada =
    Number(
      jogador.gols
    ) || 0;

  const assistenciasTemporada =
    Number(
      jogador.assistencias
    ) || 0;

  const salvamentosTemporada =
    Number(
      jogador.salvamentos
    ) || 0;


  /* =========================================================
     ESTATÍSTICAS NO GERAL
     
     Vêm do cards.txt através do CardsPage.
  ========================================================= */

  const golsGeral =
    Number(
      jogador.golsGeral
    ) || 0;

  const assistenciasGeral =
    Number(
      jogador.assistenciasGeral
    ) || 0;

  const salvamentosGeral =
    Number(
      jogador.salvamentosGeral
    ) || 0;


  const ehGoleiro =
    String(tipo)
      .toUpperCase() ===
    "GOLEIRO";


  return (
    <div className="player-card-page">

      {/* =====================================================
          TOPO
      ====================================================== */}

      <div className="player-card-topo">

        <button
          className="player-card-voltar"
          onClick={onVoltar}
        >
          ← VOLTAR PARA CARDS
        </button>

      </div>


      {/* =====================================================
          FICHA
      ====================================================== */}

      <div className="player-card-ficha">

        <div className="player-card-foto-area">

          <img
            className="player-card-foto"
            src={`/fotos/${id}.png`}
            alt={nome}
            onError={(e) => {
              e.currentTarget.src =
                "/fotos/default.png";
            }}
          />

          <div className="player-card-ovr">
            {ovr}
          </div>

        </div>


        <div className="player-card-info">

          <span className="player-card-label">
            JOGADOR
          </span>

          <h1 className="player-card-nome">
            {nome}
          </h1>

          <div className="player-card-meta">

            <span>
              {tipo}
            </span>

            <span>
              {estrelas > 0
                ? "⭐".repeat(
                  estrelas
                )
                : "⭐"}
            </span>

          </div>

        </div>

      </div>


      {/* =====================================================
          ATRIBUTOS
      ====================================================== */}

      <div className="player-card-secao">

        <h2>
          ATRIBUTOS
        </h2>

        <div className="player-card-atributos">

          {/* ATAQUE / REF */}

          <div className="player-atributo">

            <div className="player-atributo-topo">

              <span>
                {ehGoleiro
                  ? "REFLEXOS"
                  : "ATAQUE"}
              </span>

              <strong>
                {
                  atributos.ataque ||
                  0
                }
              </strong>

            </div>

            <div className="player-atributo-barra">

              <div
                className="player-atributo-progresso"
                style={{
                  width: `${Math.min(
                    Number(
                      atributos.ataque
                    ) || 0,
                    100
                  )}%`
                }}
              />

            </div>

          </div>


          {/* DEFESA */}

          <div className="player-atributo">

            <div className="player-atributo-topo">

              <span>
                DEFESA
              </span>

              <strong>
                {
                  atributos.defesa ||
                  0
                }
              </strong>

            </div>

            <div className="player-atributo-barra">

              <div
                className="player-atributo-progresso"
                style={{
                  width: `${Math.min(
                    Number(
                      atributos.defesa
                    ) || 0,
                    100
                  )}%`
                }}
              />

            </div>

          </div>


          {/* VELOCIDADE / SAI */}

          <div className="player-atributo">

            <div className="player-atributo-topo">

              <span>
                {ehGoleiro
                  ? "SAÍDA DE BOLA"
                  : "VELOCIDADE"}
              </span>

              <strong>
                {
                  atributos.velocidade ||
                  0
                }
              </strong>

            </div>

            <div className="player-atributo-barra">

              <div
                className="player-atributo-progresso"
                style={{
                  width: `${Math.min(
                    Number(
                      atributos.velocidade
                    ) || 0,
                    100
                  )}%`
                }}
              />

            </div>

          </div>


          {/* PASSE */}

          <div className="player-atributo">

            <div className="player-atributo-topo">

              <span>
                PASSE
              </span>

              <strong>
                {
                  atributos.passe ||
                  0
                }
              </strong>

            </div>

            <div className="player-atributo-barra">

              <div
                className="player-atributo-progresso"
                style={{
                  width: `${Math.min(
                    Number(
                      atributos.passe
                    ) || 0,
                    100
                  )}%`
                }}
              />

            </div>

          </div>


          {/* DRIBLE / POS */}

          <div className="player-atributo">

            <div className="player-atributo-topo">

              <span>
                {ehGoleiro
                  ? "POSICIONAMENTO"
                  : "DRIBLE"}
              </span>

              <strong>
                {
                  atributos.drible ||
                  0
                }
              </strong>

            </div>

            <div className="player-atributo-barra">

              <div
                className="player-atributo-progresso"
                style={{
                  width: `${Math.min(
                    Number(
                      atributos.drible
                    ) || 0,
                    100
                  )}%`
                }}
              />

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
    TEMPORADA ATUAL
====================================================== */}

      <div className="player-card-secao">

        <h2>
          ESTATÍSTICAS DA TEMPORADA ATUAL
        </h2>
        <h5>
          Os gols, assistências e salvamentos da temporada atual são contabilizados no GERAL ao fim da Temporada.
        </h5>


        <div className="player-card-estatisticas">

          <div className="player-estatistica">

            <span>
              ⚽
            </span>

            <strong>
              {golsTemporada}
            </strong>

            <small>
              GOLS
            </small>

          </div>

          <div className="player-estatistica">

            <span>
              🅰️
            </span>

            <strong>
              {assistenciasTemporada}
            </strong>

            <small>
              ASSISTÊNCIAS
            </small>

          </div>

          <div className="player-estatistica">

            <span>
              🛡️
            </span>

            <strong>
              {salvamentosTemporada}
            </strong>

            <small>
              SALVAMENTOS
            </small>

          </div>

        </div>

      </div>


      {/* =====================================================
    GERAL
====================================================== */}

      <div className="player-card-secao">

        <h2>
          ESTATÍSTICAS NO GERAL
        </h2>

        <div className="player-card-estatisticas">

          <div className="player-estatistica">

            <span>
              ⚽
            </span>

            <strong>
              {golsGeral}
            </strong>

            <small>
              GOLS
            </small>

          </div>

          <div className="player-estatistica">

            <span>
              🅰️
            </span>

            <strong>
              {assistenciasGeral}
            </strong>

            <small>
              ASSISTÊNCIAS
            </small>

          </div>

          <div className="player-estatistica">

            <span>
              🛡️
            </span>

            <strong>
              {salvamentosGeral}
            </strong>

            <small>
              SALVAMENTOS
            </small>

          </div>

        </div>

      </div>


      {/* =====================================================
          VOLTAR
      ====================================================== */}

      <div className="player-card-final">

        <button
          className="player-card-voltar"
          onClick={onVoltar}
        >
          ← VOLTAR PARA CARDS
        </button>

      </div>

    </div>
  );
}

export default PlayerCardPage;

