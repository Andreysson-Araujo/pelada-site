import React from "react";

function SeletorTempo({ duracao, selecionarDuracao }) {
  return (
    <div className="timer-duracoes">

      <div className="timer-label">
        DURAÇÃO DA PARTIDA
      </div>

      <div className="timer-opcoes">

        <button
          className={duracao === 8 ? "ativo" : ""}
          onClick={() => selecionarDuracao(8)}
        >
          <strong>8</strong>
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
