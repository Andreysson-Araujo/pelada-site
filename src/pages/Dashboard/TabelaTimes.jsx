
import React, { useState } from "react";

import {
  registrarResultado
} from "../../services/TimesApi";

import "./TabelaTimes.css";


function TabelaTimes({ times, onAtualizar }) {

  const [timeSelecionado, setTimeSelecionado] =
    useState(null);


  const [resultadoSelecionado, setResultadoSelecionado] =
    useState(null);


  const [pin, setPin] =
    useState("");


  const [salvando, setSalvando] =
    useState(false);


  const [erroPin, setErroPin] =
    useState("");


  /*
  ========================================
  SELECIONAR TIME
  ========================================
  */

  function selecionarTime(id) {

    if (salvando) {
      return;
    }


    setTimeSelecionado(
      timeSelecionado === id
        ? null
        : id
    );

  }


  /*
  ========================================
  ABRIR MODAL DO PIN
  ========================================
  */

  function abrirConfirmacao(
    time,
    resultado
  ) {

    setTimeSelecionado(null);

    setResultadoSelecionado({
      time,
      resultado
    });

    setPin("");

    setErroPin("");

  }


  /*
  ========================================
  FECHAR MODAL
  ========================================
  */

  function fecharConfirmacao() {

    if (salvando) {
      return;
    }


    setResultadoSelecionado(null);

    setPin("");

    setErroPin("");

  }


  /*
  ========================================
  REGISTRAR RESULTADO
  ========================================
  */

  async function confirmarResultado() {

    if (!resultadoSelecionado) {
      return;
    }


    if (pin.length !== 4) {

      setErroPin(
        "Digite o PIN de 4 dígitos."
      );

      return;

    }


    try {

      setSalvando(true);

      setErroPin("");


      await registrarResultado(

        resultadoSelecionado.time.id,

        resultadoSelecionado.resultado,

        pin

      );


      setResultadoSelecionado(null);

      setPin("");


      if (onAtualizar) {

        await onAtualizar();

      }


    } catch (error) {

      console.error(
        "Erro ao registrar resultado:",
        error
      );


      setErroPin(
        error.message ||
        "Não foi possível registrar o resultado."
      );

    } finally {

      setSalvando(false);

    }

  }


  /*
  ========================================
  TECLADO DO PIN
  ========================================
  */

  function alterarPin(event) {

    const valor =
      event.target.value
        .replace(/\D/g, "")
        .slice(0, 4);


    setPin(valor);

    setErroPin("");

  }


  /*
  ========================================
  RENDER
  ========================================
  */

  return (

    <>

      <div className="tabela-times-container">

        <table className="tabela-times">

          <thead>

            <tr>

              <th>#</th>

              <th>TIME</th>

              <th>P</th>

              <th>V</th>

              <th>D</th>

            </tr>

          </thead>


          <tbody>

            {times.map((time, index) => {

              const selecionado =
                timeSelecionado === time.id;


              return (

                <React.Fragment
                  key={time.id}
                >

                  <tr

                    className={`linha-time ${
                      selecionado
                        ? "linha-time-selecionada"
                        : ""
                    }`}

                    onClick={() =>
                      selecionarTime(time.id)
                    }

                  >

                    <td className="tabela-posicao">

                      <span>
                        {index + 1}
                      </span>

                    </td>


                    <td className="tabela-time">

                      <img

                        src={`/escudos/${time.escudo}`}

                        alt={`Escudo ${time.nome}`}

                      />


                      <span>
                        {time.nome}
                      </span>


                      <span className="icone-adicionar">

                        {selecionado
                          ? "⌃"
                          : "＋"}

                      </span>

                    </td>


                    <td className="tabela-pontos">

                      {time.pontos}

                    </td>


                    <td>

                      <span className="numero-vitorias">

                        {time.vitorias}

                      </span>

                    </td>


                    <td>

                      <span className="numero-derrotas">

                        {time.derrotas}

                      </span>

                    </td>

                  </tr>


                  {selecionado && (

                    <tr className="linha-acoes">

                      <td colSpan="5">

                        <div className="acoes-resultado">


                          <div className="acoes-titulo">

                            <span className="acoes-icone">
                              ⚽
                            </span>


                            <div>

                              <strong>
                                Registrar resultado
                              </strong>

                              <small>
                                {time.nome}
                              </small>

                            </div>

                          </div>


                          <div className="acoes-botoes">


                            <button

                              type="button"

                              className="botao-resultado botao-vitoria"

                              disabled={salvando}

                              onClick={(event) => {

                                event.stopPropagation();

                                abrirConfirmacao(
                                  time,
                                  "vitoria"
                                );

                              }}

                            >

                              <span className="botao-resultado-icone">
                                ✓
                              </span>


                              <span className="botao-resultado-texto">

                                <strong>
                                  Vitória
                                </strong>

                                <small>
                                  +3 pontos
                                </small>

                              </span>

                            </button>


                            <button

                              type="button"

                              className="botao-resultado botao-derrota"

                              disabled={salvando}

                              onClick={(event) => {

                                event.stopPropagation();

                                abrirConfirmacao(
                                  time,
                                  "derrota"
                                );

                              }}

                            >

                              <span className="botao-resultado-icone">
                                ✕
                              </span>


                              <span className="botao-resultado-texto">

                                <strong>
                                  Derrota
                                </strong>

                                <small>
                                  0 pontos
                                </small>

                              </span>

                            </button>


                          </div>


                        </div>

                      </td>

                    </tr>

                  )}

                </React.Fragment>

              );

            })}

          </tbody>

        </table>

      </div>


      {/* ========================================
          MODAL DO PIN
      ======================================== */}

      {resultadoSelecionado && (

        <div
          className="modal-pin-overlay"
          onClick={fecharConfirmacao}
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
              Confirmar resultado
            </h3>


            <p>

              Registrar{" "}

              <strong>

                {resultadoSelecionado.resultado ===
                "vitoria"
                  ? "VITÓRIA"
                  : "DERROTA"}

              </strong>

              {" "}para

            </p>


            <div className="modal-pin-time">

              <img

                src={`/escudos/${resultadoSelecionado.time.escudo}`}

                alt=""

              />

              <strong>
                {resultadoSelecionado.time.nome}
              </strong>

            </div>


            <label className="modal-pin-label">

              PIN

              <input

                type="password"

                inputMode="numeric"

                maxLength="4"

                value={pin}

                onChange={alterarPin}

                onKeyDown={(event) => {

                  if (
                    event.key === "Enter"
                  ) {

                    confirmarResultado();

                  }

                  if (
                    event.key === "Escape"
                  ) {

                    fecharConfirmacao();

                  }

                }}

                autoFocus

                placeholder="••••"

              />

            </label>


            {erroPin && (

              <div className="modal-pin-erro">

                ⚠️ {erroPin}

              </div>

            )}


            <div className="modal-pin-botoes">

              <button

                type="button"

                className="modal-pin-cancelar"

                onClick={fecharConfirmacao}

                disabled={salvando}

              >

                Cancelar

              </button>


              <button

                type="button"

                className="modal-pin-confirmar"

                onClick={confirmarResultado}

                disabled={
                  salvando ||
                  pin.length !== 4
                }

              >

                {salvando
                  ? "Registrando..."
                  : "Confirmar"}

              </button>

            </div>


          </div>

        </div>

      )}

    </>

  );

}


export default TabelaTimes;

