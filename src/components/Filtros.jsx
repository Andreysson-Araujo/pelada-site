import React from "react";

function Filtros({ pesquisa, setPesquisa, estrelas, setEstrelas, tipo, setTipo }) {
  return (
    <section className="filtros">
      <input
        type="text"
        placeholder="Pesquisar jogador..."
        value={pesquisa}
        onChange={(e) => setPesquisa(e.target.value)}
      />

      <select value={estrelas} onChange={(e) => setEstrelas(e.target.value)}>
        <option value="todas">Todas as estrelas</option>
        <option value="5">5 estrelas</option>
        <option value="4">4 estrelas</option>
        <option value="3">3 estrelas</option>
        <option value="2">2 estrelas</option>
        <option value="1">1 estrela</option>
      </select>

      <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
        <option value="todos">Todos os tipos</option>
        <option value="goleiro">Goleiros</option>
        <option value="jogador">Jogadores de linha</option>
      </select>
    </section>
  );
}

export default Filtros;