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
// BÔNUS DAS ESTRELAS
// =========================

function calcularBonusEstrelas(jogador) {
  return Math.max(
    0,
    (jogador.estrelas || 1) - 1
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
   * Jogador de linha:
   *
   * ATA = 25%
   * DEF = 20%
   * VEL = 20%
   * PAS = 20%
   * DRI = 15%
   */

  const media =
    ataque * 0.25 +
    defesa * 0.20 +
    velocidade * 0.20 +
    passe * 0.20 +
    drible * 0.15;

  const bonusEstrelas =
    calcularBonusEstrelas(jogador);

  return limitar(
    media + bonusEstrelas
  );
}

// =========================
// OVR GOLEIRO
// =========================

export function calcularOVRGoleiro(jogador) {

  const {
    ataque,
    defesa,
    velocidade,
    passe,
    drible,
  } = jogador.atributos;

  /*
   * Para goleiro, os atributos do cards.txt
   * são interpretados assim:
   *
   * ATA → REFLEXO
   * DEF → DEFESA
   * VEL → SAÍDA
   * PAS → PASSE
   * DRI → POSICIONAMENTO
   *
   * Pesos:
   *
   * REF = 30%
   * DEF = 35%
   * SAI = 10%
   * PAS = 20%
   * POS = 5%
   */

  const media =
    ataque * 0.30 +
    defesa * 0.35 +
    velocidade * 0.10 +
    passe * 0.20 +
    drible * 0.05;

  const bonusEstrelas =
    calcularBonusEstrelas(jogador);

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