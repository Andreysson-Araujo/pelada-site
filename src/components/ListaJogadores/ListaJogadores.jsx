import React from "react";
import "./ListaJogadores.css";

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

      {/* CABEÇALHO DESKTOP */}
      <div className="lista-header">
        <span>JOGADOR</span>
        <span>AVALIAÇÃO</span>
        <span>POSIÇÃO</span>
        <span>GOLS</span>
        <span>ASSISTÊNCIAS</span>
      </div>

      {jogadores.map((jogador) => {

        const inicial =
          jogador.nome?.charAt(0)?.toUpperCase() || "?";

        const isGoleiro =
          jogador.tipo?.toUpperCase() === "GOLEIRO";

        return (
          <div className="jogador" key={jogador.id}>

            {/* JOGADOR */}
            <div className="jogador-nome">

              <div className="avatar">
                {inicial}
              </div>

              <div className="jogador-identidade">
                <strong>{jogador.nome}</strong>

                {/* MOSTRADO NO CELULAR */}
                <span className="posicao-mobile">
                  {isGoleiro ? "🧤 Goleiro" : "⚽ Linha"}
                </span>
              </div>

            </div>

            {/* ESTRELAS */}
            <div className="estrelas">
              {"⭐".repeat(jogador.estrelas || 0)}
            </div>

            {/* POSIÇÃO DESKTOP */}
            <div className="posicao-desktop">

              {isGoleiro ? (
                <span className="badge goleiro">
                  🧤 Goleiro
                </span>
              ) : (
                <span className="badge linha">
                  ⚽ Linha
                </span>
              )}

            </div>

            {/* GOLS */}
            <div className="estatistica jogador-gols">

              <span className="estatistica-icone">
                ⚽
              </span>

              <div>
                <strong>
                  {jogador.gols || 0}
                </strong>

                <small>
                  Gols
                </small>
              </div>

            </div>

            {/* ASSISTÊNCIAS */}
            <div className="estatistica jogador-assistencias">

              <span className="estatistica-icone">
                🅰️
              </span>

              <div>
                <strong>
                  {jogador.assistencias || 0}
                </strong>

                <small>
                  Assistências
                </small>
              </div>

            </div>

          </div>
        );
      })}

    </section>
  );
}

export default ListaJogadores;