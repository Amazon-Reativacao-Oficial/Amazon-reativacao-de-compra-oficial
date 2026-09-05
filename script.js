/* ============================================================
   CONFIGURAÇÃO
   ============================================================ */

const CONFIG = {
  productName: "Meu Produto",

  amount: 1776.09,

  pixCode: "00020101021226770014BR.GOV.BCB.PIX2555api.itau/pix/qr/v2/8663d8b8-e6a5-4a92-ae04-fe236080e35a5204000053039865802BR5913AMAZON COM BR6009SAO PAULO62070503***6304BE61"
};


/* ============================================================
   INICIAR PÁGINA
   ============================================================ */

function iniciarPagamento() {

  const amountElement = document.getElementById("amount");
  const qrElement = document.getElementById("qrcode");
  const timerElement = document.getElementById("timer");
  const copyButton = document.getElementById("copyButton");
  const copyStatus = document.getElementById("copyStatus");


  /* ==========================================================
     TÍTULO
     ========================================================== */

  document.title =
    CONFIG.productName || "Pagamento PIX";


  /* ==========================================================
     VALOR
     ========================================================== */

  if (amountElement) {

    const valorFormatado =
      Number(CONFIG.amount).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });

    amountElement.textContent =
      "Total a pagar: R$ " + valorFormatado;
  }


  /* ==========================================================
     GERAR QR CODE
     ========================================================== */

  function gerarQRCode() {

    if (!qrElement) {
      console.error("Elemento qrcode não encontrado.");
      return;
    }

    const pix =
      String(CONFIG.pixCode || "").trim();

    qrElement.innerHTML = "";


    if (!pix) {

      qrElement.textContent =
        "Código PIX não configurado.";

      return;
    }


    if (typeof window.qrcode !== "function") {

      qrElement.textContent =
        "Carregando QR Code...";

      setTimeout(
        gerarQRCode,
        500
      );

      return;
    }


    try {

      const qr =
        window.qrcode(0, "M");


      qr.addData(pix);

      qr.make();


      qrElement.innerHTML =
        qr.createSvgTag({
          cellSize: 4,
          margin: 0,
          scalable: true
        });


      const svg =
        qrElement.querySelector("svg");


      if (svg) {

        svg.style.display = "block";

        svg.style.width =
          "min(300px, 72vw)";

        svg.style.height =
          "auto";

        svg.style.maxWidth =
          "100%";

        svg.style.margin =
          "0 auto";

      }


    } catch (erro) {

      console.error(
        "Erro ao gerar QR Code:",
        erro
      );

      qrElement.innerHTML =
        "Não foi possível gerar o QR Code.";

    }

  }


  gerarQRCode();


  /* ==========================================================
     CRONÔMETRO — 10 MINUTOS
     ========================================================== */

  let segundosRestantes = 10 * 60;

  let intervalo = null;


  function atualizarCronometro() {

    if (!timerElement) {
      return;
    }


    const minutos =
      Math.floor(
        segundosRestantes / 60
      );


    const segundos =
      segundosRestantes % 60;


    timerElement.textContent =
      String(minutos).padStart(2, "0") +
      ":" +
      String(segundos).padStart(2, "0");


    if (segundosRestantes <= 0) {

      timerElement.textContent =
        "00:00";


      if (copyButton) {
        copyButton.disabled = true;
      }


      if (intervalo) {
        clearInterval(intervalo);
      }

      return;
    }


    segundosRestantes--;

  }


  atualizarCronometro();


  intervalo =
    setInterval(
      atualizarCronometro,
      1000
    );


  /* ==========================================================
     COPIAR PIX
     ========================================================== */

  async function copiarPIX() {

    if (segundosRestantes <= 0) {
      return;
    }


    const pix =
      String(CONFIG.pixCode || "").trim();


    if (!pix) {
      return;
    }


    try {

      if (
        navigator.clipboard &&
        window.isSecureContext
      ) {

        await navigator.clipboard.writeText(pix);

      } else {

        copiarAlternativo(pix);

      }


      mostrarCopiado();


    } catch (erro) {

      try {

        copiarAlternativo(pix);

        mostrarCopiado();

      } catch (erro2) {

        console.error(
          "Erro ao copiar PIX:",
          erro2
        );

      }

    }

  }


  /* ==========================================================
     CÓPIA ALTERNATIVA
     ========================================================== */

  function copiarAlternativo(texto) {

    const textarea =
      document.createElement("textarea");


    textarea.value =
      texto;


    textarea.style.position =
      "fixed";

    textarea.style.left =
      "-9999px";

    textarea.style.top =
      "0";

    textarea.style.opacity =
      "0";


    document.body.appendChild(
      textarea
    );


    textarea.focus();

    textarea.select();

    textarea.setSelectionRange(
      0,
      textarea.value.length
    );


    const sucesso =
      document.execCommand("copy");


    textarea.remove();


    if (!sucesso) {

      throw new Error(
        "Não foi possível copiar."
      );

    }

  }


  /* ==========================================================
     MENSAGEM
     ========================================================== */

  function mostrarCopiado() {

    if (!copyStatus) {
      return;
    }


    copyStatus.textContent =
      "Código PIX copiado.";


    setTimeout(
      function () {

        copyStatus.textContent =
          "";

      },
      2000
    );

  }


  /* ==========================================================
     BOTÃO COPIAR
     ========================================================== */

  if (copyButton) {

    copyButton.addEventListener(
      "click",
      copiarPIX
    );

  }

}


/* ============================================================
   ESPERAR HTML CARREGAR
   ============================================================ */

if (
  document.readyState === "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    iniciarPagamento
  );

} else {

  iniciarPagamento();

}
