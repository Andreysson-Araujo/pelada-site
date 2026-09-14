const API_URL =
  "https://script.google.com/macros/s/AKfycbzO76J75S8U3AyUAFQkNTjJ8KyThOAJ369SmiFAfruPyBDIBE1t46tdlMGs9U8L63qaDA/exec";


// ========================================
// JOGADORES
// ========================================

export async function listarJogadores() {

  const resposta = await fetch(
    `${API_URL}?acao=listarJogadores`
  );

  if (!resposta.ok) {

    throw new Error(
      "Erro ao buscar jogadores."
    );

  }

  return await resposta.json();

}


// ========================================
// ADICIONAR GOL
// ========================================

export async function adicionarGol(id) {

  const resposta = await fetch(
    `${API_URL}?acao=adicionarGol&id=${encodeURIComponent(id)}`
  );

  if (!resposta.ok) {

    throw new Error(
      "Erro ao adicionar gol."
    );

  }

  return await resposta.json();

}


// ========================================
// REMOVER GOL
// ========================================

export async function removerGol(id) {

  const resposta = await fetch(
    `${API_URL}?acao=removerGol&id=${encodeURIComponent(id)}`
  );

  if (!resposta.ok) {

    throw new Error(
      "Erro ao remover gol."
    );

  }

  return await resposta.json();

}


// ========================================
// ADICIONAR ASSISTÊNCIA
// ========================================

export async function adicionarAssistencia(id) {

  const resposta = await fetch(
    `${API_URL}?acao=adicionarAssistencia&id=${encodeURIComponent(id)}`
  );

  if (!resposta.ok) {

    throw new Error(
      "Erro ao adicionar assistência."
    );

  }

  return await resposta.json();

}


// ========================================
// REMOVER ASSISTÊNCIA
// ========================================

export async function removerAssistencia(id) {

  const resposta = await fetch(
    `${API_URL}?acao=removerAssistencia&id=${encodeURIComponent(id)}`
  );

  if (!resposta.ok) {

    throw new Error(
      "Erro ao remover assistência."
    );

  }

  return await resposta.json();

}


// ========================================
// TIMES
// ========================================

export async function listarTimes() {

  const resposta = await fetch(
    `${API_URL}?acao=listarTimes`
  );

  if (!resposta.ok) {

    throw new Error(
      "Erro ao buscar times."
    );

  }

  return await resposta.json();

}


// ========================================
// REGISTRAR RESULTADO
// ========================================

export async function registrarResultado(
  id,
  resultado,
  pin
) {

  const parametros =
    new URLSearchParams({

      acao: "registrarResultado",

      id: id,

      resultado: resultado,

      pin: pin

    });


  const resposta = await fetch(
    `${API_URL}?${parametros.toString()}`
  );


  if (!resposta.ok) {

    throw new Error(
      "Erro ao registrar resultado."
    );

  }


  return await resposta.json();

}