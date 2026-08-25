import React from "react";

function ListaJogadores({ jogadores }) {
  if (jogadores.length === 0) {
    return (
      <div className="vazio">
        <span>😵</span>
        <h2>Nenhum jogador encontrado</h2>
        <p>Tente alterar os filtros.</p>
      </div>
    );
  }

  return (
    <section className="lista-jogadores">
      <div className="lista-header">
        <span>JOGADOR</span>
        <span>AVALIAÇÃO</span>
        <span>POSIÇÃO</span>
        <span>GOLS</span>
        <span>ASSISTÊNCIAS</span>
      </div>

      {jogadores.map((jogador) => (
        <div className="jogador" key={jogador.id}>
          <div className="jogador-nome">
            <div className="avatar">
              {jogador.nome.charAt(0).toUpperCase()}
            </div>

            <strong>{jogador.nome}</strong>
          </div>

          <div className="estrelas">
            {"⭐".repeat(jogador.estrelas)}
          </div>

          <div>
            {jogador.goleiro ? (
              <span className="badge goleiro">
                🧤 Goleiro
              </span>
            ) : (
              <span className="badge linha">
                ⚽ Linha
              </span>
            )}
          </div>

          <strong>{jogador.gols}</strong>

          <strong>{jogador.assistencias}</strong>
        </div>
      ))}
    </section>
  );
}

export default ListaJogadores;