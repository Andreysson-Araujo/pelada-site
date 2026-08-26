import React from "react";
import "./Header.css";



function Header({ total, pagina, setPagina }) {
  return (
    <header className="header">

      <div className="logo">
        <span>⚽</span>

        <div>
          <strong>PELADA</strong>
          <span>DOS MORTOS</span>
        </div>
      </div>

      <nav>

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

      <div className="header-info">
        {total} jogadores
      </div>

    </header>
  );
}

export default Header;