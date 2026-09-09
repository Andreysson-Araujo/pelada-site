import React, { useState } from "react";

import {
  registrarResultado
} from "../../services/TimesApi";

import "./TabelaTimes.css";


function TabelaTimes({ times, onAtualizar }) {

  const [timeSelecionado, setTimeSelecionado] =
    useState(null);

  const [salvando, setSalvando] =
    useState(false);


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


  async function registrar(time, resultado) {

    try {

      setSalvando(true);

      await registrarResultado(
        time.id,
        resultado
      );

      setTimeSelecionado(null);

      if (onAtualizar) {
        await onAtualizar();
      }

    } catch (error) {

      console.error(
        "Erro ao registrar resultado:",
        error
      );

      alert(
        error.message ||
        "Não foi possível registrar o resultado."
      );

    } finally {

      setSalvando(false);

    }

  }


  return (

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

              <React.Fragment key={time.id}>

                {/* LINHA DO TIME */}

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


                {/* ÁREA DE RESULTADO */}

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

                              registrar(
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

                              registrar(
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


                        {salvando && (

                          <div className="resultado-salvando">

                            <span>
                              ⏳
                            </span>

                            Registrando resultado...

                          </div>

                        )}

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

  );

}


export default TabelaTimes;

