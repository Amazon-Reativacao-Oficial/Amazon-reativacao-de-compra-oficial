/* ========================================================== COPIAR PIX - COMPLETO ========================================================== */
function iniciarCopiaPix() {
const copyButton = document.getElementById("copyButton");
if (!copyButton) { console.error("Botão copiar não encontrado."); return; }
copyButton.addEventListener("click", async function () {
// ALTERE AQUI SE QUISER COLOCAR O PIX DIRETAMENTE
const pix = String(CONFIG.pixCode || "").trim();

if (!pix) {
  console.error("Código PIX vazio.");
  return;
}

try {

  // Método principal
  if (
    navigator.clipboard &&
    window.isSecureContext
  ) {

    await navigator.clipboard.writeText(pix);

  } else {

    // Método alternativo para celular/navegador
    const textarea = document.createElement("textarea");

    textarea.value = pix;

    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "-9999px";
    textarea.style.opacity = "0";

    document.body.appendChild(textarea);

    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, pix.length);

    const sucesso = document.execCommand("copy");

    document.body.removeChild(textarea);

    if (!sucesso) {
      throw new Error("Não foi possível copiar o PIX.");
    }
  }

  // NÃO mostra mensagem "Código PIX copiado"
  // Apenas coloca uma borda preta no botão
  copyButton.style.border = "1px solid #000";
  copyButton.style.outline = "none";

  // Volta ao normal depois de 2 segundos
  setTimeout(function () {
    copyButton.style.border = "";
  }, 2000);

} catch (erro) {

  console.error("Erro ao copiar PIX:", erro);

}
});
}
/* ========================================================== INICIAR QUANDO A PÁGINA CARREGAR ========================================================== */
if (document.readyState === "loading") {
document.addEventListener( "DOMContentLoaded", iniciarCopiaPix );
} else {
iniciarCopiaPix();
}
