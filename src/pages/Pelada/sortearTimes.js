export function sortearTimes(
  jogadores,
  jogadoresPorTime,
  nomesTimes
) {

  // ==================================================
  // SEPARAR GOLEIROS E JOGADORES DE LINHA
  // ==================================================

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


  // ==================================================
  // VERIFICAR SE EXISTEM JOGADORES
  // ==================================================

  if (jogadoresLinha.length === 0) {
    return [];
  }


  // ==================================================
  // CALCULAR QUANTIDADE DE TIMES
  // ==================================================

  const quantidadeTimes =
    Math.ceil(
      jogadoresLinha.length /
      jogadoresPorTime
    );


  // ==================================================
  // SORTEAR NOMES DOS TIMES
  // ==================================================

  const nomesEmbaralhados = [
    ...nomesTimes
  ].sort(
    () => Math.random() - 0.5
  );


  // ==================================================
  // CRIAR TIMES
  // ==================================================

  const times = Array.from(
    {
      length: quantidadeTimes
    },
    (_, index) => ({

      nome:
        nomesEmbaralhados[index] ||
        `Time ${index + 1}`,

      goleiro: null,

      jogadores: [],

      forca: 0,

    })
  );


  // ==================================================
  // EMBARALHAR JOGADORES
  // ==================================================

  const jogadoresEmbaralhados = [
    ...jogadoresLinha
  ].sort(
    () => Math.random() - 0.5
  );


  // ==================================================
  // ORDENAR POR ESTRELAS
  //
  // Os melhores jogadores são distribuídos
  // primeiro para tentar equilibrar os times.
  // ==================================================

  jogadoresEmbaralhados.sort(
    (a, b) => {

      const estrelasA =
        Number(a.estrelas) || 0;

      const estrelasB =
        Number(b.estrelas) || 0;

      return estrelasB - estrelasA;

    }
  );


  // ==================================================
  // DISTRIBUIR JOGADORES
  //
  // Sempre coloca o próximo jogador no time
  // que possui a menor força naquele momento.
  // ==================================================

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


      // Encontrar o time com menor força

      const menorForca =
        Math.min(
          ...timesDisponiveis.map(
            (time) => time.forca
          )
        );


      const timesMenorForca =
        timesDisponiveis.filter(
          (time) =>
            time.forca ===
            menorForca
        );


      // Se houver empate entre times,
      // escolhe aleatoriamente.

      const timeEscolhido =
        timesMenorForca[
          Math.floor(
            Math.random() *
            timesMenorForca.length
          )
        ];


      // Adicionar jogador

      timeEscolhido.jogadores.push(
        jogador
      );


      // Atualizar força

      timeEscolhido.forca +=
        Number(jogador.estrelas) || 0;

    }
  );


  // ==================================================
  // DISTRIBUIR GOLEIROS
  //
  // O goleiro pode aparecer em mais de um time.
  // ==================================================

  if (goleiros.length > 0) {

    times.forEach(
      (time, index) => {

        time.goleiro =
          goleiros[
            index %
            goleiros.length
          ];

      }
    );

  }


  // ==================================================
  // EMBARALHAR OS JOGADORES DENTRO DE CADA TIME
  //
  // Isso evita que os jogadores apareçam sempre
  // na mesma ordem.
  // ==================================================

  times.forEach(
    (time) => {

      time.jogadores.sort(
        () => Math.random() - 0.5
      );

    }
  );


  // ==================================================
  // RETORNAR RESULTADO
  // ==================================================

  return times;

}