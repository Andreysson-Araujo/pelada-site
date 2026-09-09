const API_URL =
  "https://script.google.com/macros/s/AKfycbx5h_QQPmHkK39kp0XMZhRcg9hdQemT-eAuNKFXJm7nAWaoi3ewsqySm10_f8hPdL2zGQ/exec";

export async function listarJogadores() {
  const url =
    `${API_URL}?acao=listar&t=${Date.now()}`;

  const resposta = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  if (!resposta.ok) {
    throw new Error(
      "Não foi possível carregar os jogadores."
    );
  }

  const jogadores = await resposta.json();

  console.log(
    "JOGADORES RECEBIDOS DA API:",
    jogadores
  );

  return jogadores.map((jogador, index) => ({
    ...jogador,

    // Garante que 001 continue sendo 001
    id: String(jogador.id).padStart(3, "0"),

    ordemCadastro: index,
  }));
}


export async function adicionarGol(id) {
  return alterarEstatistica(
    id,
    "adicionar_gol"
  );
}


export async function removerGol(id) {
  return alterarEstatistica(
    id,
    "remover_gol"
  );
}


export async function adicionarAssistencia(id) {
  return alterarEstatistica(
    id,
    "adicionar_assistencia"
  );
}


export async function removerAssistencia(id) {
  return alterarEstatistica(
    id,
    "remover_assistencia"
  );
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
    throw new Error(
      "Não foi possível alterar a estatística."
    );
  }

  const resultado = await resposta.json();

  if (!resultado.sucesso) {
    throw new Error(
      resultado.erro ||
      "Não foi possível alterar a estatística."
    );
  }

  return resultado;
}

export async function listarTimes() {

  const url = `${API_URL}?acao=listar_times&t=${Date.now()}`;

  const resposta = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  if (!resposta.ok) {
    throw new Error(
      "Não foi possível carregar os times."
    );
  }

  const times = await resposta.json();

  console.log(
    "TIMES RECEBIDOS DA API:",
    times
  );

  return times.map((time) => ({
    ...time,

    id: String(time.id),

    pontos: Number(time.pontos) || 0,

    vitorias: Number(time.vitorias) || 0,

    derrotas: Number(time.derrotas) || 0,
  }));
}