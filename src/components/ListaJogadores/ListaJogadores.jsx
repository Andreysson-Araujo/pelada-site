import React, { useState } from "react";

import "./ListaJogadores.css";

import {
  adicionarGol,
  removerGol,
  adicionarAssistencia,
  removerAssistencia,
  adicionarSalvamento,
  removerSalvamento,
} from "../../services/api";

function ListaJogadores({ jogadores, onAtualizarJogador }) {

  const [atualizando, setAtualizando] = useState({});

  // Modal de quantidade
  const [modalQuantidade, setModalQuantidade] = useState(null);

  // Modal de PIN
  const [modalPin, setModalPin] = useState(null);

  const [quantidade, setQuantidade] = useState("1");
  const [pin, setPin] = useState("");
  const [erroModal, setErroModal] = useState("");


  /*
   * =========================================================
   * ABRIR MODAL DE QUANTIDADE
   * =========================================================
   */

  function abrirAdicionar(jogador, tipo) {

    setQuantidade("1");
    setErroModal("");

    setModalQuantidade({
      jogador,
      tipo,
    });
  }


  /*
   * =========================================================
   * ABRIR MODAL DE PIN PARA REMOVER
   * =========================================================
   */

  function abrirRemover(jogador, tipo) {

    setPin("");
    setErroModal("");

    setModalPin({
      jogador,
      tipo,
      operacao: "remover",
      quantidade: 1,
    });
  }


  /*
   * =========================================================
   * CONFIRMAR QUANTIDADE
   * =========================================================
   */

  function confirmarQuantidade() {

    const numero = Number(quantidade);

    if (!Number.isInteger(numero) || numero < 1) {

      setErroModal(
        "Digite uma quantidade válida."
      );

      return;
    }

    if (numero > 10) {

      setErroModal(
        "A quantidade máxima é 10."
      );

      return;
    }

    setErroModal("");
    setPin("");

    setModalPin({
      jogador: modalQuantidade.jogador,
      tipo: modalQuantidade.tipo,
      operacao: "adicionar",
      quantidade: numero,
    });

    setModalQuantidade(null);
  }


  /*
   * =========================================================
   * CONFIRMAR PIN
   * =========================================================
   */

  async function confirmarPin() {

    if (pin.length !== 4) {

      setErroModal(
        "Digite o PIN de 4 dígitos."
      );

      return;
    }

    if (!modalPin) {
      return;
    }

    const {
      jogador,
      tipo,
      operacao,
      quantidade: quantidadeSelecionada,
    } = modalPin;

    const chave = `${jogador.id}-${tipo}`;

    if (atualizando[chave]) {
      return;
    }

    setAtualizando((estadoAnterior) => ({
      ...estadoAnterior,
      [chave]: true,
    }));

    try {

      let resultado;


      /*
       * =====================================================
       * GOLS
       * =====================================================
       */

      if (tipo === "gol") {

        if (operacao === "adicionar") {

          resultado = await adicionarGol(
            jogador.id,
            quantidadeSelecionada,
            pin
          );

        } else {

          resultado = await removerGol(
            jogador.id,
            pin
          );
        }
      }


      /*
       * =====================================================
       * ASSISTÊNCIAS
       * =====================================================
       */

      if (tipo === "assistencia") {

        if (operacao === "adicionar") {

          resultado = await adicionarAssistencia(
            jogador.id,
            quantidadeSelecionada,
            pin
          );

        } else {

          resultado = await removerAssistencia(
            jogador.id,
            pin
          );
        }
      }


      /*
       * =====================================================
       * SALVAMENTOS
       * =====================================================
       */

      if (tipo === "salvamento") {

        if (operacao === "adicionar") {

          resultado = await adicionarSalvamento(
            jogador.id,
            quantidadeSelecionada,
            pin
          );

        } else {

          resultado = await removerSalvamento(
            jogador.id,
            pin
          );
        }
      }


      /*
       * =====================================================
       * VALIDAR RESPOSTA
       * =====================================================
       */

      if (!resultado?.sucesso) {

        throw new Error(
          resultado?.erro ||
          "Não foi possível atualizar a estatística."
        );
      }


      /*
       * =====================================================
       * ATUALIZAR JOGADOR NA TELA
       * =====================================================
       */

      if (
        typeof onAtualizarJogador === "function"
      ) {

        onAtualizarJogador(resultado);
      }


      // Fecha o modal

      setModalPin(null);
      setPin("");
      setErroModal("");


    } catch (error) {

      console.error(
        "Erro ao atualizar estatística:",
        error
      );

      setErroModal(
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


  /*
   * =========================================================
   * FECHAR MODAIS
   * =========================================================
   */

  function fecharModais() {

    setModalQuantidade(null);
    setModalPin(null);

    setQuantidade("1");
    setPin("");

    setErroModal("");
  }


  /*
   * =========================================================
   * ALTERAR QUANTIDADE
   * =========================================================
   */

  function alterarQuantidade(valor) {

    const somenteNumeros = valor
      .replace(/\D/g, "")
      .slice(0, 2);

    if (somenteNumeros === "") {

      setQuantidade("");
      return;
    }

    const numero = Number(somenteNumeros);

    if (numero > 10) {

      setQuantidade("10");

    } else {

      setQuantidade(
        String(numero)
      );
    }

    setErroModal("");
  }


  /*
   * =========================================================
   * ALTERAR PIN
   * =========================================================
   */

  function alterarPin(valor) {

    const somenteNumeros = valor
      .replace(/\D/g, "")
      .slice(0, 4);

    setPin(somenteNumeros);
    setErroModal("");
  }


  /*
   * =========================================================
   * TELA VAZIA
   * =========================================================
   */

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

    <>

      <section className="lista-jogadores">

        <div className="lista-header">

          <span>JOGADOR</span>

          <span>AVALIAÇÃO</span>

          <span>POSIÇÃO</span>

          <span>GOLS</span>

          <span>ASSISTÊNCIAS</span>

          <span>SALVAMENTOS</span>

        </div>


        {jogadores.map((jogador) => {

          const inicial =
            jogador.nome?.charAt(0)?.toUpperCase() || "?";

          const isGoleiro =
            jogador.tipo?.trim()?.toUpperCase() ===
            "GOLEIRO";


          const gols =
            Number(jogador.gols) || 0;


          const assistencias =
            Number(jogador.assistencias) || 0;


          const salvamentos =
            Number(jogador.salvamentos) || 0;


          const carregandoGol =
            atualizando[
              `${jogador.id}-gol`
            ];


          const carregandoAssistencia =
            atualizando[
              `${jogador.id}-assistencia`
            ];


          const carregandoSalvamento =
            atualizando[
              `${jogador.id}-salvamento`
            ];


          return (

            <div
              className="jogador"
              key={jogador.id}
            >


              {/* =================================================
                  JOGADOR
                 ================================================= */}

              <div className="jogador-nome">

                <div className="avatar">
                  {inicial}
                </div>

                <div className="jogador-identidade">

                  <strong>
                    {jogador.nome}
                  </strong>

                  <span className="posicao-mobile">

                    {isGoleiro
                      ? "🧤 Goleiro"
                      : "⚽ Linha"}

                  </span>

                </div>

              </div>


              {/* =================================================
                  ESTRELAS
                 ================================================= */}

              <div className="estrelas">

                {"⭐".repeat(
                  Number(jogador.estrelas) || 0
                )}

              </div>


              {/* =================================================
                  POSIÇÃO
                 ================================================= */}

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


              {/* =================================================
                  GOLS
                 ================================================= */}

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

                <div className="estatistica-controles">

                  {/* ADICIONAR GOL */}

                  <button
                    type="button"
                    className="botao-estatistica adicionar"
                    disabled={carregandoGol}
                    onClick={() =>
                      abrirAdicionar(
                        jogador,
                        "gol"
                      )
                    }
                    title="Adicionar gol"
                  >
                    {carregandoGol
                      ? "..."
                      : "+"}
                  </button>


                  {/* REMOVER GOL */}

                  <button
                    type="button"
                    className="botao-estatistica remover"
                    disabled={
                      gols <= 0 ||
                      carregandoGol
                    }
                    onClick={() =>
                      abrirRemover(
                        jogador,
                        "gol"
                      )
                    }
                    title="Remover gol"
                  >
                    −
                  </button>

                </div>

              </div>


              {/* =================================================
                  ASSISTÊNCIAS
                 ================================================= */}

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

                <div className="estatistica-controles">

                  {/* ADICIONAR ASSISTÊNCIA */}

                  <button
                    type="button"
                    className="botao-estatistica adicionar"
                    disabled={
                      carregandoAssistencia
                    }
                    onClick={() =>
                      abrirAdicionar(
                        jogador,
                        "assistencia"
                      )
                    }
                    title="Adicionar assistência"
                  >
                    {carregandoAssistencia
                      ? "..."
                      : "+"}
                  </button>

                   {/* REMOVER ASSISTÊNCIA */}

                  <button
                    type="button"
                    className="botao-estatistica remover"
                    disabled={
                      assistencias <= 0 ||
                      carregandoAssistencia
                    }
                    onClick={() =>
                      abrirRemover(
                        jogador,
                        "assistencia"
                      )
                    }
                    title="Remover assistência"
                  >
                    −
                  </button>

                </div>

              </div>


              {/* =================================================
                  SALVAMENTOS
                 ================================================= */}

              <div className="estatistica jogador-salvamentos">

                <span className="estatistica-icone">
                  🛡️
                </span>

                <div className="estatistica-conteudo">

                  <strong>
                    {salvamentos}
                  </strong>

                  <small>
                    Salvamentos
                  </small>

                </div>

                <div className="estatistica-controles">

                  {/* ADICIONAR SALVAMENTO */}

                  <button
                    type="button"
                    className="botao-estatistica adicionar"
                    disabled={
                      carregandoSalvamento
                    }
                    onClick={() =>
                      abrirAdicionar(
                        jogador,
                        "salvamento"
                      )
                    }
                    title="Adicionar salvamento"
                  >
                    {carregandoSalvamento
                      ? "..."
                      : "+"}
                  </button>

                   {/* REMOVER SALVAMENTO */}

                  <button
                    type="button"
                    className="botao-estatistica remover"
                    disabled={
                      salvamentos <= 0 ||
                      carregandoSalvamento
                    }
                    onClick={() =>
                      abrirRemover(
                        jogador,
                        "salvamento"
                      )
                    }
                    title="Remover salvamento"
                  >
                    −
                  </button>

                </div>

              </div>

            </div>
          );
        })}

      </section>


      {/* =========================================================
          MODAL DE QUANTIDADE
         ========================================================= */}

      {modalQuantidade && (

        <div
          className="modal-pin-overlay"
          onClick={fecharModais}
        >

          <div
            className="modal-pin"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="modal-pin-icone">

              {modalQuantidade.tipo === "gol"
                ? "⚽"
                : modalQuantidade.tipo === "assistencia"
                ? "🅰️"
                : "🛡️"}

            </div>

            <h3>

              Adicionar{" "}

              {modalQuantidade.tipo === "gol"
                ? "gols"
                : modalQuantidade.tipo === "assistencia"
                ? "assistências"
                : "salvamentos"}

            </h3>

            <p>
              Quantos você deseja adicionar?
            </p>

            <input
              type="number"
              min="1"
              max="10"
              step="1"
              value={quantidade}
              onChange={(event) =>
                alterarQuantidade(
                  event.target.value
                )
              }
              onKeyDown={(event) => {

                if (event.key === "Enter") {
                  confirmarQuantidade();
                }

                if (event.key === "Escape") {
                  fecharModais();
                }

              }}
              autoFocus
            />

            <small>
              Máximo: 10
            </small>

            {erroModal && (

              <div className="modal-pin-erro">
                {erroModal}
              </div>

            )}

            <div className="modal-pin-botoes">

              <button
                type="button"
                className="modal-pin-cancelar"
                onClick={fecharModais}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="modal-pin-confirmar"
                onClick={confirmarQuantidade}
              >
                Continuar
              </button>

            </div>

          </div>

        </div>
      )}


      {/* =========================================================
          MODAL DE PIN
         ========================================================= */}

      {modalPin && (

        <div
          className="modal-pin-overlay"
          onClick={fecharModais}
        >

          <div
            className="modal-pin"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="modal-pin-icone">
              🔐
            </div>

            <h3>
              Confirmar alteração
            </h3>

            <p>

              {modalPin.operacao === "adicionar"

                ? `Adicionar ${modalPin.quantidade} ${
                    modalPin.tipo === "gol"
                      ? modalPin.quantidade === 1
                        ? "gol"
                        : "gols"

                      : modalPin.tipo === "assistencia"
                      ? modalPin.quantidade === 1
                        ? "assistência"
                        : "assistências"

                      : modalPin.quantidade === 1
                      ? "salvamento"
                      : "salvamentos"
                  } em ${
                    modalPin.jogador.nome
                  }`

                : `Remover ${
                    modalPin.tipo === "gol"
                      ? "1 gol"

                      : modalPin.tipo === "assistencia"
                      ? "1 assistência"

                      : "1 salvamento"
                  } de ${
                    modalPin.jogador.nome
                  }`
              }

            </p>

            <label className="modal-pin-label">
              Digite o PIN
            </label>

            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="••••"
              value={pin}
              onChange={(event) =>
                alterarPin(
                  event.target.value
                )
              }
              onKeyDown={(event) => {

                if (event.key === "Enter") {
                  confirmarPin();
                }

                if (event.key === "Escape") {
                  fecharModais();
                }

              }}
              autoFocus
            />

            {erroModal && (

              <div className="modal-pin-erro">
                {erroModal}
              </div>

            )}

            <div className="modal-pin-botoes">

              <button
                type="button"
                className="modal-pin-cancelar"
                onClick={fecharModais}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="modal-pin-confirmar"
                disabled={pin.length !== 4}
                onClick={confirmarPin}
              >
                Confirmar
              </button>

            </div>

          </div>

        </div>
      )}

    </>
  );
}

export default ListaJogadores;
