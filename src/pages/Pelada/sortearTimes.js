export function sortearTimes(
  jogadores,
  jogadoresPorTime,
  nomesTimes
) {
  const goleiros = jogadores.filter(
    (jogador) =>
      jogador.tipo
        ?.trim()
        .toUpperCase() === "GOLEIRO"
  );

  const jogadoresLinha = jogadores.filter(
    (jogador) =>
      jogador.tipo
        ?.trim()
        .toUpperCase() !== "GOLEIRO"
  );

  if (jogadoresLinha.length === 0) {
    return [];
  }

  /*
   * O limite de times vem diretamente
   * da quantidade de times cadastrados.
   */
  const quantidadeTimesCadastrados =
    nomesTimes.length;

  /*
   * Quantidade de times necessária para
   * os jogadores presentes.
   */
  const quantidadeTimesNecessarios =
    Math.ceil(
      jogadoresLinha.length /
        jogadoresPorTime
    );

  /*
   * Nunca ultrapassa a quantidade de
   * times cadastrados no banco.
   */
  const quantidadeTimes =
    Math.min(
      quantidadeTimesNecessarios,
      quantidadeTimesCadastrados
    );

  /*
   * Embaralha os nomes dos times cadastrados.
   */
  const nomesEmbaralhados = [
    ...nomesTimes
  ].sort(
    () => Math.random() - 0.5
  );

  /*
   * Cria os times necessários.
   */
  const times = Array.from(
    {
      length: quantidadeTimes,
    },
    (_, index) => ({
      numero: index + 1,

      nome:
        nomesEmbaralhados[index],

      goleiro: null,

      jogadores: [],

      forca: 0,

      reserva: false,
    })
  );

  /*
   * Embaralha jogadores.
   */
  const jogadoresEmbaralhados = [
    ...jogadoresLinha,
  ].sort(
    () => Math.random() - 0.5
  );

  /*
   * Coloca os jogadores mais fortes
   * primeiro para equilibrar os times.
   */
  jogadoresEmbaralhados.sort(
    (a, b) => {
      const estrelasA =
        Number(a.estrelas) || 0;

      const estrelasB =
        Number(b.estrelas) || 0;

      return estrelasB - estrelasA;
    }
  );

  /*
   * Distribui jogadores somente nos
   * times que realmente foram criados.
   */
  jogadoresEmbaralhados.forEach(
    (jogador) => {
      const timesDisponiveis =
        times.filter(
          (time) =>
            time.jogadores.length <
            jogadoresPorTime
        );

      if (
        timesDisponiveis.length === 0
      ) {
        return;
      }

      const menorForca =
        Math.min(
          ...timesDisponiveis.map(
            (time) => time.forca
          )
        );

      const timesMenorForca =
        timesDisponiveis.filter(
          (time) =>
            time.forca === menorForca
        );

      const timeEscolhido =
        timesMenorForca[
          Math.floor(
            Math.random() *
              timesMenorForca.length
          )
        ];

      timeEscolhido.jogadores.push(
        jogador
      );

      timeEscolhido.forca +=
        Number(jogador.estrelas) || 0;
    }
  );

  /*
   * Distribui os goleiros apenas nos
   * times que existem.
   */
  if (goleiros.length > 0) {
    times.forEach(
      (time, index) => {
        time.goleiro =
          goleiros[
            index % goleiros.length
          ];
      }
    );
  }

  /*
   * Embaralha os jogadores dentro
   * de cada time.
   */
  times.forEach(
    (time) => {
      time.jogadores.sort(
        () =>
          Math.random() - 0.5
      );
    }
  );

  /*
   * Adiciona os times cadastrados restantes
   * como vagas para atrasados.
   *
   * Exemplo:
   * Banco possui 10 times
   * Foram necessários 5
   *
   * Resultado:
   * 1-5 = times com jogadores
   * 6-10 = vagas
   */
  for (
    let numero = times.length + 1;
    numero <= quantidadeTimesCadastrados;
    numero++
  ) {
    times.push({
      numero,

      nome:
        nomesEmbaralhados[numero - 1],

      goleiro: null,

      jogadores: [],

      forca: 0,

      reserva: true,
    });
  }

  return times;
}