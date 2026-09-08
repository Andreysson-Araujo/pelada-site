import React, { useState } from "react";

import "./ListaJogadores.css";

import {
  adicionarGol,
  removerGol,
  adicionarAssistencia,
  removerAssistencia,
} from "../../services/jogadoresApi";


function ListaJogadores({ jogadores }) {

  /*
    Guarda quais jogadores estão sendo atualizados.

    Exemplo:
    {
      "001-gol": true,
      "003-assistencia": true
    }
  */
  const [atualizando, setAtualizando] = useState({});


  /*
    Atualiza a estatística do jogador
  */
  async function alterarEstatistica(
    jogador,
    tipo,
    operacao
  ) {

    const chave =
      `${jogador.id}-${tipo}`;

    /*
      Impede vários cliques enquanto
      a alteração ainda está acontecendo.
    */
    if (atualizando[chave]) {
      return;
    }


    setAtualizando((estadoAnterior) => ({
      ...estadoAnterior,
      [chave]: true,
    }));


    try {

      let resultado;


      /* =========================
         GOLS
      ========================= */

      if (tipo === "gol") {

        if (operacao === "adicionar") {

          resultado = await adicionarGol(
            jogador.id
          );

        } else {

          resultado = await removerGol(
            jogador.id
          );

        }

      }


      /* =========================
         ASSISTÊNCIAS
      ========================= */

      if (tipo === "assistencia") {

        if (operacao === "adicionar") {

          resultado =
            await adicionarAssistencia(
              jogador.id
            );

        } else {

          resultado =
            await removerAssistencia(
              jogador.id
            );

        }

      }


      /*
        Verifica se o Apps Script
        retornou sucesso.
      */
      if (!resultado?.sucesso) {

        throw new Error(
          resultado?.erro ||
          "Não foi possível atualizar a estatística."
        );

      }

      window.location.reload();


      /*
        Atualiza o jogador localmente.

        Isso faz o número mudar imediatamente
        sem precisar recarregar a página.
      */
      if (typeof jogador.onAtualizar === "function") {

        jogador.onAtualizar(resultado);

      }


    } catch (error) {

      console.error(
        "Erro ao atualizar estatística:",
        error
      );

      alert(
        error.message ||
        "Não foi possível atualizar a estatística."
      );

    } finally {

      setAtualizando((estadoAnterior) => ({
        ...estadoAnterior,
        [chave]: false,
      }));

    }

  }


  /* =========================
     LISTA VAZIA
  ========================= */

  if (jogadores.length === 0) {

    return (

      <div className="vazio">

        <span>😵</span>

        <h2>
          Nenhum jogador encontrado
        </h2>

        <p>
          Tente alterar os filtros.
        </p>

      </div>

    );

  }


  return (

    <section className="lista-jogadores">


      {/* =========================
          CABEÇALHO DESKTOP
      ========================= */}

      <div className="lista-header">

        <span>
          JOGADOR
        </span>

        <span>
          AVALIAÇÃO
        </span>

        <span>
          POSIÇÃO
        </span>

        <span>
          GOLS
        </span>

        <span>
          ASSISTÊNCIAS
        </span>

      </div>


      {/* =========================
          JOGADORES
      ========================= */}

      {jogadores.map((jogador) => {

        const inicial =
          jogador.nome
            ?.charAt(0)
            ?.toUpperCase() || "?";


        const isGoleiro =
          jogador.tipo
            ?.toUpperCase() === "GOLEIRO";


        const gols =
          jogador.gols || 0;


        const assistencias =
          jogador.assistencias || 0;


        const carregandoGol =
          atualizando[
            `${jogador.id}-gol`
          ];


        const carregandoAssistencia =
          atualizando[
            `${jogador.id}-assistencia`
          ];


        return (

          <div
            className="jogador"
            key={jogador.id}
          >


            {/* =========================
                JOGADOR
            ========================= */}

            <div className="jogador-nome">

              <div className="avatar">

                {inicial}

              </div>


              <div className="jogador-identidade">

                <strong>
                  {jogador.nome}
                </strong>


                {/* MOSTRADO NO CELULAR */}

                <span className="posicao-mobile">

                  {isGoleiro
                    ? "🧤 Goleiro"
                    : "⚽ Linha"}

                </span>

              </div>

            </div>


            {/* =========================
                ESTRELAS
            ========================= */}

            <div className="estrelas">

              {"⭐".repeat(
                jogador.estrelas || 0
              )}

            </div>


            {/* =========================
                POSIÇÃO DESKTOP
            ========================= */}

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


            {/* =========================
                GOLS
            ========================= */}

            <div className="estatistica jogador-gols">

              <span className="estatistica-icone">
                ⚽
              </span>


              <div className="estatistica-conteudo">

                <strong>
                  {gols}
                </strong>

                <small>
                  Gols
                </small>

              </div>


              {/* CONTROLES */}

              <div className="estatistica-controles">

                <button
                  type="button"
                  className="botao-estatistica remover"
                  disabled={
                    gols <= 0 ||
                    carregandoGol
                  }
                  onClick={() =>
                    alterarEstatistica(
                      jogador,
                      "gol",
                      "remover"
                    )
                  }
                  title="Remover gol"
                >

                  −

                </button>


                <button
                  type="button"
                  className="botao-estatistica adicionar"
                  disabled={carregandoGol}
                  onClick={() =>
                    alterarEstatistica(
                      jogador,
                      "gol",
                      "adicionar"
                    )
                  }
                  title="Adicionar gol"
                >

                  {carregandoGol
                    ? "..."
                    : "+"}

                </button>

              </div>

            </div>


            {/* =========================
                ASSISTÊNCIAS
            ========================= */}

            <div className="estatistica jogador-assistencias">

              <span className="estatistica-icone">
                🅰️
              </span>


              <div className="estatistica-conteudo">

                <strong>
                  {assistencias}
                </strong>

                <small>
                  Assistências
                </small>

              </div>


              {/* CONTROLES */}

              <div className="estatistica-controles">

                <button
                  type="button"
                  className="botao-estatistica remover"
                  disabled={
                    assistencias <= 0 ||
                    carregandoAssistencia
                  }
                  onClick={() =>
                    alterarEstatistica(
                      jogador,
                      "assistencia",
                      "remover"
                    )
                  }
                  title="Remover assistência"
                >

                  −

                </button>


                <button
                  type="button"
                  className="botao-estatistica adicionar"
                  disabled={carregandoAssistencia}
                  onClick={() =>
                    alterarEstatistica(
                      jogador,
                      "assistencia",
                      "adicionar"
                    )
                  }
                  title="Adicionar assistência"
                >

                  {carregandoAssistencia
                    ? "..."
                    : "+"}

                </button>

              </div>

            </div>

          </div>

        );

      })}

    </section>

  );

}


export default ListaJogadores;