import React from "react";
import "./Filtros.css";

function Filtros({
  pesquisa,
  setPesquisa,
  estrelas,
  setEstrelas,
  tipo,
  setTipo,
  ordem,
  setOrdem,
}) {
  return (
    <section className="filtros">

      {/* PESQUISA */}
      <input
        type="text"
        placeholder="Pesquisar jogador..."
        value={pesquisa}
        onChange={(e) => setPesquisa(e.target.value)}
      />

      {/* ESTRELAS */}
      <select
        value={estrelas}
        onChange={(e) => setEstrelas(e.target.value)}
      >
        <option value="todas">
          Todas as estrelas
        </option>

        <option value="5">
          5 estrelas
        </option>

        <option value="4">
          4 estrelas
        </option>

        <option value="3">
          3 estrelas
        </option>

        <option value="2">
          2 estrelas
        </option>

        <option value="1">
          1 estrela
        </option>
      </select>

      {/* TIPO */}
      <select
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
      >
        <option value="todos">
          Todos os tipos
        </option>

        <option value="GOLEIRO">
          Goleiros
        </option>

        <option value="LINHA">
          Jogadores de linha
        </option>
      </select>

      {/* ORDEM */}
      <select
        value={ordem}
        onChange={(e) => setOrdem(e.target.value)}
      >
        <option value="recentes">
          Últimos cadastrados
        </option>

        <option value="antigos">
          Primeiros cadastrados
        </option>

        <option value="az">
          Nome: A → Z
        </option>

        <option value="za">
          Nome: Z → A
        </option>
      </select>

    </section>
  );
}

export default Filtros;