function normalizarNome(nome) {
  return String(nome || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/⁠/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export function sortearTimes(
  jogadores,
  jogadoresPorTime,
  nomesTimes,
  restricoes = []
) {
  // ================================================
  // SEPARAR GOLEIROS E JOGADORES DE LINHA
  // ================================================

  const goleiros = jogadores.filter(
    (jogador) =>
      jogador.tipo?.trim().toUpperCase() ===
      "GOLEIRO"
  );

  const jogadoresLinha = jogadores.filter(
    (jogador) =>
      jogador.tipo?.trim().toUpperCase() !==
      "GOLEIRO"
  );

  if (jogadoresLinha.length === 0) {
    return [];
  }

  if (!nomesTimes || nomesTimes.length === 0) {
    throw new Error(
      "Nenhum nome de time foi encontrado."
    );
  }

  // ================================================
  // QUANTIDADE DE TIMES
  // ================================================

  const quantidadeTimesNecessarios = Math.ceil(
    jogadoresLinha.length / jogadoresPorTime
  );

  const quantidadeTimes = Math.min(
    quantidadeTimesNecessarios,
    nomesTimes.length
  );

  // ================================================
  // EMBARALHAR NOMES DOS TIMES
  // ================================================

  const nomesEmbaralhados = [...nomesTimes].sort(
    () => Math.random() - 0.5
  );

  // ================================================
  // CRIAR TIMES
  // ================================================

  function criarTimes() {
    return Array.from(
      {
        length: quantidadeTimes,
      },
      (_, index) => ({
        numero: index + 1,
        nome: nomesEmbaralhados[index],
        goleiro: null,
        jogadores: [],
        forca: 0,
        reserva: false,
      })
    );
  }

  // ================================================
  // MONTAR RESTRIÇÕES
  // ================================================

  const mapaRestricoes = new Map();

  function adicionarRestricao(nomeA, nomeB) {
    const a = normalizarNome(nomeA);
    const b = normalizarNome(nomeB);

    if (!a || !b || a === b) {
      return;
    }

    if (!mapaRestricoes.has(a)) {
      mapaRestricoes.set(a, new Set());
    }

    if (!mapaRestricoes.has(b)) {
      mapaRestricoes.set(b, new Set());
    }

    mapaRestricoes.get(a).add(b);
    mapaRestricoes.get(b).add(a);
  }

  restricoes.forEach((restricao) => {
    if (
      Array.isArray(restricao) &&
      restricao.length >= 2
    ) {
      adicionarRestricao(
        restricao[0],
        restricao[1]
      );
    }
  });

  // ================================================
  // VERIFICAR RESTRIÇÃO
  // ================================================

  function podeEntrarNoTime(jogador, time) {
    const nomeJogador = normalizarNome(
      jogador.nome
    );

    const proibidos =
      mapaRestricoes.get(nomeJogador);

    if (!proibidos) {
      return true;
    }

    return !time.jogadores.some(
      (outroJogador) =>
        proibidos.has(
          normalizarNome(outroJogador.nome)
        )
    );
  }

  // ================================================
  // TENTAR UM SORTEIO
  // ================================================

  function tentarSorteio() {
    const times = criarTimes();

    // Embaralha primeiro
    const jogadoresEmbaralhados = [
      ...jogadoresLinha,
    ].sort(() => Math.random() - 0.5);

    // Depois coloca os mais fortes primeiro
    jogadoresEmbaralhados.sort((a, b) => {
      const estrelasA =
        Number(a.estrelas) || 0;

      const estrelasB =
        Number(b.estrelas) || 0;

      if (estrelasA !== estrelasB) {
        return estrelasB - estrelasA;
      }

      return Math.random() - 0.5;
    });

    // ==============================================
    // DISTRIBUIR JOGADORES
    // ==============================================

    for (const jogador of jogadoresEmbaralhados) {
      const disponiveis = times.filter(
        (time) =>
          time.jogadores.length <
            jogadoresPorTime &&
          podeEntrarNoTime(jogador, time)
      );

      if (disponiveis.length === 0) {
        return null;
      }

      // Menor força atual
      const menorForca = Math.min(
        ...disponiveis.map(
          (time) => time.forca
        )
      );

      const timesMenorForca =
        disponiveis.filter(
          (time) =>
            time.forca === menorForca
        );

      // Escolher aleatoriamente entre os empatados
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

    // ==============================================
    // DISTRIBUIR GOLEIROS
    // ==============================================

    if (goleiros.length > 0) {
      times.forEach((time, index) => {
        time.goleiro =
          goleiros[
            index % goleiros.length
          ];
      });
    }

    // ==============================================
    // EMBARALHAR POSIÇÃO DOS JOGADORES
    // ==============================================

    times.forEach((time) => {
      time.jogadores.sort(
        () => Math.random() - 0.5
      );
    });

    return times;
  }

  // ================================================
  // PROCURAR MELHOR RESULTADO
  // ================================================

  let melhorResultado = null;
  let melhorDiferenca = Infinity;

  const quantidadeTentativas =
    restricoes.length > 0
      ? 1000
      : 500;

  for (
    let tentativa = 0;
    tentativa < quantidadeTentativas;
    tentativa++
  ) {
    const resultado = tentarSorteio();

    if (!resultado) {
      continue;
    }

    const forcas = resultado.map(
      (time) => time.forca
    );

    const maiorForca = Math.max(...forcas);
    const menorForca = Math.min(...forcas);

    const diferenca =
      maiorForca - menorForca;

    if (diferenca < melhorDiferenca) {
      melhorDiferenca = diferenca;
      melhorResultado = resultado;
    }

    // Equilíbrio perfeito
    if (diferenca === 0) {
      break;
    }
  }

  // ================================================
  // NÃO FOI POSSÍVEL
  // ================================================

  if (!melhorResultado) {
    throw new Error(
      "Não foi possível montar os times respeitando todas as restrições. Tente remover alguma restrição."
    );
  }

  // ================================================
  // TIMES RESERVA
  // ================================================

  for (
    let numero = melhorResultado.length + 1;
    numero <= nomesTimes.length;
    numero++
  ) {
    melhorResultado.push({
      numero,
      nome: nomesEmbaralhados[numero - 1],
      goleiro: null,
      jogadores: [],
      forca: 0,
      reserva: true,
    });
  }

  return melhorResultado;
}