
import React, { useEffect, useState } from "react";

import SeletorTempo from "./SeletorTempo";
import ControlesTimer from "./ControlesTimer";

import "./Timer.css";

function Timer() {

  const [duracao, setDuracao] = useState(10);

  const [tempo, setTempo] = useState(10 * 60);

  const [rodando, setRodando] = useState(false);

  const [acrescimos, setAcrescimos] = useState(0);

  const [modoAcrescimo, setModoAcrescimo] = useState(false);


  /* =========================
     CRONÔMETRO
  ========================= */

  useEffect(() => {

    if (!rodando) {
      return;
    }

    const intervalo = setInterval(() => {

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


  /* =========================
     SELECIONAR DURAÇÃO
  ========================= */

  function selecionarDuracao(minutos) {

    setDuracao(minutos);

    setTempo(minutos * 60);

    setRodando(false);

    setModoAcrescimo(false);

    setAcrescimos(0);
  }


  /* =========================
     INICIAR
  ========================= */

  function iniciar() {

    setRodando(true);

  }


  /* =========================
     PAUSAR
  ========================= */

  function pausar() {

    setRodando(false);

  }


  /* =========================
     REINICIAR
  ========================= */

  function reiniciar() {

    setTempo(duracao * 60);

    setRodando(false);

    setModoAcrescimo(false);

    setAcrescimos(0);

  }


  /* =========================
     ADICIONAR ACRÉSCIMO
  ========================= */

  function adicionarAcrescimo(minutos) {

    setAcrescimos(
      (atual) => atual + minutos
    );

    setTempo(
      (atual) => atual + minutos * 60
    );

    setModoAcrescimo(true);

    setRodando(true);

  }


  /* =========================
     FORMATAR TEMPO
  ========================= */

  const minutos = Math.floor(tempo / 60);

  const segundos = tempo % 60;


  /* =========================
     TELA
  ========================= */

  return (

    <div className="timer-container">

      <h1>
        Timer da Partida
      </h1>


      {/* SELETOR DE TEMPO */}

      {!modoAcrescimo && (

        <SeletorTempo
          duracao={duracao}
          selecionarDuracao={selecionarDuracao}
        />

      )}


      {/* RELÓGIO */}

      <div
        className={`timer-display ${
          modoAcrescimo ? "acrescimo" : ""
        }`}
      >

        {String(minutos).padStart(2, "0")}

        :

        {String(segundos).padStart(2, "0")}

      </div>


      {/* ACRÉSCIMOS */}

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
              onClick={() => adicionarAcrescimo(1)}
            >
              +1 MIN
            </button>

            <button
              onClick={() => adicionarAcrescimo(2)}
            >
              +2 MIN
            </button>

            <button
              onClick={() => adicionarAcrescimo(3)}
            >
              +3 MIN
            </button>

          </div>

        </div>

      )}


      {/* CONTROLES */}

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

