if (copyStatus) {

    copyStatus.textContent =
      "Código PIX copiado.";

  }


} catch (fallbackError) {

  if (copyStatus) {

    copyStatus.textContent =
      "Não foi possível copiar automaticamente.";

  }

}
}
}
/* ============================================================ MÉTODO ALTERNATIVO DE CÓPIA ============================================================ */
function fallbackCopy(text) {
const textarea = document
