import React from "react";

function SeletorTempo({ duracao, selecionarDuracao }) {
  return (
    <div className="timer-duracoes">

      <div className="timer-label">
        DURAÇÃO DA PARTIDA
      </div>

      <div className="timer-opcoes">

        <button
          className={duracao === 7 ? "ativo" : ""}
          onClick={() => selecionarDuracao(7)}
        >
          <strong>7</strong>
          <span>MIN</span>
        </button>

        <button
          className={duracao === 10 ? "ativo" : ""}
          onClick={() => selecionarDuracao(10)}
        >
          <strong>10</strong>
          <span>MIN</span>
        </button>

        <button
          className={duracao === 15 ? "ativo" : ""}
          onClick={() => selecionarDuracao(15)}
        >
          <strong>15</strong>
          <span>MIN</span>
        </button>

      </div>

    </div>
  );
}

export default SeletorTempo;
