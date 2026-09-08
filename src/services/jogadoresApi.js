const API_URL =
  "https://script.google.com/macros/s/AKfycbyQJWzQeGAh2QwjF1Whvbmv3hRMMnDHzXdPAD-PaFKuj009KEZdQ2z84o674VCl5RMd5A/exec";

export async function listarJogadores() {
  const resposta = await fetch(API_URL);

  if (!resposta.ok) {
    throw new Error("Não foi possível carregar os jogadores.");
  }

  const jogadores = await resposta.json();

  return jogadores.map((jogador, index) => ({
    ...jogador,

    // Garante que 001 continue sendo 001
    id: String(jogador.id).padStart(3, "0"),

    ordemCadastro: index,
  }));
}


export async function adicionarGol(id) {
  return alterarEstatistica(id, "adicionar_gol");
}


export async function removerGol(id) {
  return alterarEstatistica(id, "remover_gol");
}


export async function adicionarAssistencia(id) {
  return alterarEstatistica(id, "adicionar_assistencia");
}


export async function removerAssistencia(id) {
  return alterarEstatistica(id, "remover_assistencia");
}


async function alterarEstatistica(id, acao) {
  const resposta = await fetch(API_URL, {
    method: "POST",

    body: new URLSearchParams({
      id: String(id).padStart(3, "0"),
      acao,
      pin: "1234",
    }),
  });

  if (!resposta.ok) {
    throw new Error("Não foi possível alterar a estatística.");
  }

  return await resposta.json();
}