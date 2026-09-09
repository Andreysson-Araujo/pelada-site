const API_URL =
"https://script.google.com/macros/s/AKfycbz0BgTpsufbQAE-j4NOKX_gkMGWMVaSfIslmO_4QSWo1gl8U4RV_KZKvb6tZzVXaugd/exec";

export async function listarTimes() {

  const resposta = await fetch(
    `${API_URL}?acao=listar&t=${Date.now()}`
  );

  if (!resposta.ok) {
    throw new Error(
      "Erro ao carregar os times."
    );
  }

  const times = await resposta.json();

  console.log(
    "TIMES RECEBIDOS DA API:",
    times
  );

  return times.map((time) => ({

    ...time,

    id: String(time.id)
      .padStart(3, "0"),

    pontos:
      Number(time.pontos) || 0,

    vitorias:
      Number(time.vitorias) || 0,

    derrotas:
      Number(time.derrotas) || 0,

  }));

}


export async function registrarResultado(
  id,
  resultado
) {

  const url =
    `${API_URL}` +
    `?acao=registrarResultado` +
    `&id=${encodeURIComponent(id)}` +
    `&resultado=${encodeURIComponent(resultado)}` +
    `&t=${Date.now()}`;


  const resposta =
    await fetch(url);


  if (!resposta.ok) {

    throw new Error(
      "Erro ao registrar resultado."
    );

  }


  const dados =
    await resposta.json();


  if (!dados.sucesso) {

    throw new Error(
      dados.erro ||
      "Não foi possível registrar o resultado."
    );

  }


  return dados;

}