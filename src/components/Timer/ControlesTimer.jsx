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
          type="button"
          className="btn-iniciar"
          onClick={iniciar}
        >
          ▶ INICIAR
        </button>

      ) : (

        <button
          type="button"
          className="btn-pausar"
          onClick={pausar}
        >
          ⏸ PAUSAR
        </button>

      )}


      <button
        type="button"
        className="btn-reiniciar"
        onClick={reiniciar}
      >
        ↻ REINICIAR
      </button>


    </div>

  );

}


export default ControlesTimer;