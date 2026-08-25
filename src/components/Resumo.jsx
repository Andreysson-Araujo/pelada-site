import React from "react";

function ImportarLista({ onImportar }) {
  function selecionarArquivo(event) {
    const arquivo = event.target.files[0];

    if (!arquivo) return;

    const leitor = new FileReader();

    leitor.onload = (e) => {
      onImportar(e.target.result);
    };

    leitor.readAsText(arquivo, "UTF-8");

    event.target.value = "";
  }

  return (
    <label className="botao-importar">
      📂 Importar lista

      <input
        type="file"
        accept=".txt"
        onChange={selecionarArquivo}
        hidden
      />
    </label>
  );
}

export default ImportarLista;