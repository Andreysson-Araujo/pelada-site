import React from "react";


function TimerFlutuante({

  tempo,

  rodando,

  modoAcrescimo,

  setPagina,

  pausar,

  iniciar,

}) {


  // Não mostrar nada quando o timer
  // estiver parado.

  if (!rodando) {
    return null;
  }


  const minutos =
    Math.floor(tempo / 60);

  const segundos =
    tempo % 60;


  function abrirTimer() {

    setPagina("timer");

  }


  return (

    <div
      className={
        `timer-flutuante ${
          modoAcrescimo
            ? "timer-flutuante-acrescimo"
            : ""
        }`
      }
    >


      {/* ==========================================
          TEMPO
      ========================================== */}

      <button
        type="button"
        className="timer-flutuante-tempo"
        onClick={abrirTimer}
        title="Abrir timer"
      >

        <span className="timer-flutuante-icone">
          ⚽
        </span>


        <span className="timer-flutuante-relogio">

          {String(minutos).padStart(
            2,
            "0"
          )}

          :

          {String(segundos).padStart(
            2,
            "0"
          )}

        </span>

      </button>


      {/* ==========================================
          CONTROLE
      ========================================== */}

      <button
        type="button"
        className="timer-flutuante-controle"
        onClick={pausar}
        title="Pausar timer"
      >
        ⏸
      </button>


    </div>

  );

}


export default TimerFlutuante;