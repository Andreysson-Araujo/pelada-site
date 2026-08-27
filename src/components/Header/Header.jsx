import React from "react";

import "./Header.css";

function Header({ total, pagina, setPagina }) {
  return (
    <header className="header">

      {/* =========================
          LOGO
      ========================= */}

      <div className="logo">

        <span>⚽</span>

        <div>
          <strong>PELADA</strong>
          <span>DOS MORTOS</span>
        </div>

      </div>

      {/* =========================
          NAVEGAÇÃO
      ========================= */}

      <nav>

        {/* DASHBOARD */}

        <button
          className={
            pagina === "dashboard"
              ? "nav-active"
              : ""
          }
          onClick={() =>
            setPagina("dashboard")
          }
        >
          Dashboard
        </button>

        {/* JOGADORES */}

        <button
          className={
            pagina === "jogadores"
              ? "nav-active"
              : ""
          }
          onClick={() =>
            setPagina("jogadores")
          }
        >
          Jogadores
        </button>

        {/* RANKING */}

        <button
          className={
            pagina === "ranking"
              ? "nav-active"
              : ""
          }
          onClick={() =>
            setPagina("ranking")
          }
        >
          Ranking
        </button>

        {/* CARDS */}

        <button
          className={
            pagina === "cards"
              ? "nav-active"
              : ""
          }
          onClick={() =>
            setPagina("cards")
          }
        >
          🃏 Cards
        </button>

        {/* TEMPO */}

        <button
          className={
            pagina === "timer"
              ? "nav-active"
              : ""
          }
          onClick={() =>
            setPagina("timer")
          }
        >
          Tempo
        </button>

      </nav>

      {/* =========================
          INFORMAÇÕES
      ========================= */}

      <div className="header-info">
        {total} jogadores
      </div>

    </header>
  );
}

export default Header;