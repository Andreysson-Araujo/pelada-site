// =========================
// LIMITADOR
// =========================

export function limitar(valor, minimo = 0, maximo = 55) {
  return Math.min(
    maximo,
    Math.max(minimo, Math.round(valor))
  );
}

// =========================
// OVR JOGADOR DE LINHA
// =========================

export function calcularOVR(jogador) {
  const {
    ataque,
    defesa,
    velocidade,
    passe,
    drible,
  } = jogador.atributos;

  /*
   * Média dos 5 atributos
   */

  const media =
    (
      ataque +
      defesa +
      velocidade +
      passe +
      drible
    ) / 5;

  /*
   * Estrelas dão um pequeno bônus.
   *
   * ⭐ 1 = +0
   * ⭐ 2 = +1
   * ⭐ 3 = +2
   * ⭐ 4 = +3
   * ⭐ 5 = +4
   */

  const bonusEstrelas =
    Math.max(0, jogador.estrelas - 1);

  return limitar(
    media + bonusEstrelas
  );
}

// =========================
// OVR GOLEIRO
// =========================

export function calcularOVRGoleiro(jogador) {
  const {
    defesa,
    velocidade,
    passe,
  } = jogador.atributos;

  /*
   * Para goleiro:

   * Defesa tem mais peso.
   * Velocidade tem peso médio.
   * Passe ajuda na saída de bola.
   */

  const media =
    (
      defesa * 0.50 +
      velocidade * 0.25 +
      passe * 0.25
    );

  /*
   * Bônus pelas estrelas
   */

  const bonusEstrelas =
    Math.max(0, jogador.estrelas - 1);

  return limitar(
    media + bonusEstrelas
  );
}

// =========================
// OVR AUTOMÁTICO
// =========================

export function calcularOVRJogador(jogador) {
  const tipo =
    jogador.tipo
      ?.trim()
      .toUpperCase();

  if (tipo === "GOLEIRO") {
    return calcularOVRGoleiro(jogador);
  }

  return calcularOVR(jogador);
}