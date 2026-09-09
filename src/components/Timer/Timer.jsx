import React from "react";

import SeletorTempo from "./SeletorTempo";
import ControlesTimer from "./ControlesTimer";

import "./Timer.css";


function Timer({

  duracao,

  tempo,

  rodando,

  acrescimos,

  modoAcrescimo,

  selecionarDuracao,

  iniciar,

  pausar,

  reiniciar,

  adicionarAcrescimo,

}) {


  // ==================================================
  // FORMATAR TEMPO
  // ==================================================

  const minutos =
    Math.floor(tempo / 60);

  const segundos =
    tempo % 60;


  return (

    <div className="timer-container">


      <h1>
        Timer da Partida
      </h1>


      {/* ==========================================
          SELETOR DE TEMPO
      ========================================== */}

      {!modoAcrescimo && (

        <SeletorTempo

          duracao={duracao}

          selecionarDuracao={
            selecionarDuracao
          }

        />

      )}


      {/* ==========================================
          RELÓGIO
      ========================================== */}

      <div
        className={`
          timer-display
          ${modoAcrescimo ? "acrescimo" : ""}
        `}
      >

        {String(minutos).padStart(
          2,
          "0"
        )}

        :

        {String(segundos).padStart(
          2,
          "0"
        )}

      </div>


      {/* ==========================================
          ACRÉSCIMOS
      ========================================== */}

      {modoAcrescimo && (

        <div className="acrescimo-area">

          <span>
            ACRÉSCIMOS
          </span>


          {acrescimos > 0 && (

            <small>
              +{acrescimos} min
            </small>

          )}


          <div className="botoes-acrescimo">

            <button
              type="button"
              onClick={() =>
                adicionarAcrescimo(1)
              }
            >
              +1 MIN
            </button>


            <button
              type="button"
              onClick={() =>
                adicionarAcrescimo(2)
              }
            >
              +2 MIN
            </button>


            <button
              type="button"
              onClick={() =>
                adicionarAcrescimo(3)
              }
            >
              +3 MIN
            </button>

          </div>

        </div>

      )}


      {/* ==========================================
          CONTROLES
      ========================================== */}

      <ControlesTimer

        rodando={rodando}

        iniciar={iniciar}

        pausar={pausar}

        reiniciar={reiniciar}

      />

    </div>

  );

}


export default Timer;