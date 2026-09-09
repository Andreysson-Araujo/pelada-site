import React, { useEffect, useState } from "react";

import { listarTimes } from "../../services/TimesApi";

import TimeCard from "./TimeCard";
import TabelaTimes from "./TabelaTimes";

import "./Dashboard.css";


function Dashboard() {

  const [times, setTimes] = useState([]);

  const [carregando, setCarregando] =
    useState(true);

  const [erro, setErro] =
    useState("");


  useEffect(() => {

    carregarTimes();

  }, []);


  async function carregarTimes() {

    try {

      setCarregando(true);

      setErro("");


      const dados =
        await listarTimes();


      // Ordena os times pelos pontos
      // do maior para o menor
      const timesOrdenados =
        [...dados].sort(
          (a, b) => {

            // Primeiro: pontos
            if (b.pontos !== a.pontos) {
              return b.pontos - a.pontos;
            }

            // Desempate: vitórias
            if (b.vitorias !== a.vitorias) {
              return b.vitorias - a.vitorias;
            }

            // Segundo desempate: menos derrotas
            return a.derrotas - b.derrotas;

          }
        );


      setTimes(timesOrdenados);


    } catch (error) {

      console.error(
        "Erro ao carregar times:",
        error
      );


      setErro(
        "Não foi possível carregar a classificação."
      );


    } finally {

      setCarregando(false);

    }

  }


  // =========================
  // CARREGANDO
  // =========================

  if (carregando) {

    return (

      <main className="dashboard-times">

        <div className="dashboard-times-loading">

          <div className="loading-icon">
            ⚽
          </div>

          <p>
            Carregando classificação...
          </p>

        </div>

      </main>

    );

  }


  // =========================
  // ERRO
  // =========================

  if (erro) {

    return (

      <main className="dashboard-times">

        <div className="dashboard-times-erro">

          <span>
            ⚠️
          </span>

          <p>
            {erro}
          </p>

          <button
            type="button"
            onClick={carregarTimes}
          >
            Tentar novamente
          </button>

        </div>

      </main>

    );

  }


  // =========================
  // TOP 3
  // =========================

  const top3 =
    times.slice(0, 3);


  return (

    <main className="dashboard-times">

      {/* =========================
          CABEÇALHO
      ========================= */}

      <header className="dashboard-times-header">

        <div className="dashboard-times-titulo">

          <span className="dashboard-times-icon">
            🏆
          </span>

          <div>

            <h1>
              CLASSIFICAÇÃO
            </h1>

            <p>
              Pelada dos Mortos
            </p>

          </div>

        </div>


        <div className="dashboard-times-total">

          <strong>
            {times.length}
          </strong>

          <span>
            {times.length === 1
              ? "time"
              : "times"}
          </span>

        </div>

      </header>


      {/* =========================
          TOP 3
      ========================= */}

      {top3.length > 0 && (

        <section className="top-times">

          <div className="section-titulo">

            <h2>
              🏆 Melhores Times
            </h2>

            <p>
              Os três primeiros colocados
            </p>

          </div>


          <div className="top-times-grid">

            {top3.map((time, index) => (

              <TimeCard
                key={time.id}
                time={time}
                posicao={index + 1}
              />

            ))}

          </div>

        </section>

      )}


      {/* =========================
          TABELA DE CLASSIFICAÇÃO
      ========================= */}

      <section className="classificacao">

        <div className="classificacao-header">

          <div>

            <h2>
              📊 Tabela de Pontuação
            </h2>

            <p>
              Clique em um time para registrar o resultado
            </p>

          </div>

        </div>


        {times.length > 0 ? (

          <TabelaTimes
            times={times}
            onAtualizar={carregarTimes}
          />

        ) : (

          <div className="times-vazio">

            <span>
              ⚽
            </span>

            <p>
              Nenhum time cadastrado ainda.
            </p>

          </div>

        )}

      </section>

    </main>

  );

}


export default Dashboard;

