export function gerarListaJogadores(jogadores) {

  let texto = "";

  texto += "⚽ PELADA APP\n";
  texto += "📋 LISTA DE JOGADORES\n";
  texto += "━━━━━━━━━━━━━━━━━━━━\n\n";

  jogadores.forEach((jogador) => {

    const id = String(jogador.id).padStart(3, "0");

    const estrelas =
      Number(jogador.estrelas) || 0;

    const gols =
      Number(jogador.gols) || 0;

    const assistencias =
      Number(jogador.assistencias) || 0;

    const tipo =
      jogador.tipo?.trim()?.toUpperCase() || "LINHA";

    texto +=
      `👤 ${jogador.nome} | ` +
      `🆔 ${id} | ` +
      `⭐ ${estrelas} | ` +
      `${tipo} | ` +
      `⚽ ${gols} | ` +
      `🅰️ ${assistencias}\n`;
  });

  texto += "\n";
  texto += "━━━━━━━━━━━━━━━━━━━━\n";
  texto += "🔐 PELADA_APP_V1";

  return texto;
}