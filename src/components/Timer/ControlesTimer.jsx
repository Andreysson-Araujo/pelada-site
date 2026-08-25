import React from "react";

function ControlesTimer({
  rodando,
  iniciar,
  pausar,
  reiniciar,
}) {

  return (

    <div className="timer-controles">

      {!rodando ? (

        <button
          className="btn-iniciar"
          onClick={iniciar}
        >
          ▶ INICIAR
        </button>

      ) : (

        <button
          className="btn-pausar"
          onClick={pausar}
        >
          ⏸ PAUSAR
        </button>

      )}


      <button
        className="btn-reiniciar"
        onClick={reiniciar}
      >
        ↻ REINICIAR
      </button>

    </div>

  );
}

export default ControlesTimer;
