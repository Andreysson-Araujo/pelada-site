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

export async function adicionarGol(
  id,
  quantidade,
  pin
) {

  const parametros = new URLSearchParams({
    acao: "adicionarGol",
    id: id,
    quantidade: quantidade,
    pin: pin,
  });

  const resposta = await fetch(
    `${API_URL}?${parametros.toString()}`
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

export async function removerGol(
  id,
  pin
) {

  const parametros = new URLSearchParams({
    acao: "removerGol",
    id: id,
    pin: pin,
  });

  const resposta = await fetch(
    `${API_URL}?${parametros.toString()}`
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

export async function adicionarAssistencia(
  id,
  quantidade,
  pin
) {

  const parametros = new URLSearchParams({
    acao: "adicionarAssistencia",
    id: id,
    quantidade: quantidade,
    pin: pin,
  });

  const resposta = await fetch(
    `${API_URL}?${parametros.toString()}`
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

export async function removerAssistencia(
  id,
  pin
) {

  const parametros = new URLSearchParams({
    acao: "removerAssistencia",
    id: id,
    pin: pin,
  });

  const resposta = await fetch(
    `${API_URL}?${parametros.toString()}`
  );

  if (!resposta.ok) {
    throw new Error(
      "Erro ao remover assistência."
    );
  }

  return await resposta.json();
}


// ========================================
// ADICIONAR SALVAMENTO
// ========================================

export async function adicionarSalvamento(
  id,
  quantidade,
  pin
) {

  const parametros = new URLSearchParams({
    acao: "adicionarSalvamento",
    id: id,
    quantidade: quantidade,
    pin: pin,
  });

  const resposta = await fetch(
    `${API_URL}?${parametros.toString()}`
  );

  if (!resposta.ok) {
    throw new Error(
      "Erro ao adicionar salvamento."
    );
  }

  return await resposta.json();
}


// ========================================
// REMOVER SALVAMENTO
// ========================================

export async function removerSalvamento(
  id,
  pin
) {

  const parametros = new URLSearchParams({
    acao: "removerSalvamento",
    id: id,
    pin: pin,
  });

  const resposta = await fetch(
    `${API_URL}?${parametros.toString()}`
  );

  if (!resposta.ok) {
    throw new Error(
      "Erro ao remover salvamento."
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

  const parametros = new URLSearchParams({
    acao: "registrarResultado",
    id: id,
    resultado: resultado,
    pin: pin,
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