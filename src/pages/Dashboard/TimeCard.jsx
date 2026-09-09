import React from "react";
import "./TimeCard.css";

function TimeCard({ time, posicao }) {

  const medalhas = {
    1: "🥇",
    2: "🥈",
    3: "🥉",
  };

  return (
    <div className={`time-card posicao-${posicao}`}>

      <div className="time-card-posicao">
        {medalhas[posicao]}
      </div>

      <img
        src={`/escudos/${time.escudo}`}
        alt={`Escudo ${time.nome}`}
        className="time-card-escudo"
      />

      <h3>{time.nome}</h3>

      <div className="time-card-pontos">
        <strong>{time.pontos}</strong>
        <span>pontos</span>
      </div>

      <div className="time-card-estatisticas">

        <span>
          <strong>{time.vitorias}</strong>
          <small>VITÓRIAS</small>
        </span>

        <span>
          <strong>{time.derrotas}</strong>
          <small>DERROTAS</small>
        </span>

      </div>

    </div>
  );
}

export default TimeCard;