/* ============================================================
   CONFIGURAÇÃO
   ============================================================ */

const CONFIG = {
  productName: "Meu Produto",

  amount: 1815.00,

  pixCode: "00020101021226780014br.gov.bcb.pix2556pix.ebanx.com/qr/v2/7F6460D85C970AFB4E45BBB74357CB3435E35204000053039865802BR5905EBANX6008CURITIBA62070503***63041774"
};


/* ============================================================
   INICIAR QUANDO A PÁGINA ESTIVER PRONTA
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

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

  function renderAmount() {

    if (!amountElement) {
      return;
    }

    const valor = Number(CONFIG.amount);

    const valorFormatado = valor.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    amountElement.textContent =
      "Total a pagar: R$ " + valorFormatado;
  }


  /* ==========================================================
     QR CODE
     ========================================================== */

  function renderQrCode() {

    if (!qrElement) {
      console.error("Elemento #qrcode não encontrado.");
      return;
    }

    qrElement.innerHTML = "";

    const pixCode =
      String(CONFIG.pixCode || "").trim();


    if (!pixCode) {

      qrElement.textContent =
        "Código PIX não configurado.";

      return;
    }


    /* Verifica se a biblioteca foi carregada */

    if (typeof qrcode !== "function") {

      qrElement.textContent =
        "Gerador de QR Code não carregado.";

      console.error(
        "A biblioteca qrcode-generator não foi carregada."
      );

      return;
    }


    try {

      /*
        L = menor correção,
        permitindo um QR mais compacto.
      */

      const qr = qrcode(0, "L");

      qr.addData(pixCode);

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

        svg.style.width = "320px";

        svg.style.height = "320px";

        svg.style.maxWidth = "100%";

        svg.style.maxHeight = "100%";

      }


    } catch (error) {

      console.error(
        "Erro ao gerar QR Code:",
        error
      );

      qrElement.textContent =
        "Não foi possível gerar o QR Code.";

    }

  }


  /* ==========================================================
     CRONÔMETRO
     ========================================================== */

  let tempoRestante = 10 * 60;

  let timerInterval = null;


  function updateTimer() {

    if (!timerElement) {
      return;
    }


    const minutos =
      Math.floor(tempoRestante / 60);


    const segundos =
      tempoRestante % 60;


    timerElement.textContent =
      String(minutos).padStart(2, "0") +
      ":" +
      String(segundos).padStart(2, "0");


    if (tempoRestante <= 0) {

      timerElement.textContent =
        "00:00";


      if (copyButton) {
        copyButton.disabled = true;
      }


      if (timerInterval) {
        clearInterval(timerInterval);
      }


      return;
    }


    tempoRestante--;

  }


  /* ==========================================================
     COPIAR PIX
     ========================================================== */

  async function copyPixCode() {

    const pixCode =
      String(CONFIG.pixCode || "").trim();


    if (!pixCode) {
      return;
    }


    try {

      if (
        navigator.clipboard &&
        window.isSecureContext
      ) {

        await navigator.clipboard.writeText(
          pixCode
        );

      } else {

        fallbackCopy(pixCode);

      }


      if (copyStatus) {

        copyStatus.textContent =
          "Código PIX copiado.";

      }


    } catch (error) {

      try {

        fallbackCopy(pixCode);


        if (copyStatus) {

          copyStatus.textContent =
            "Código PIX copiado.";

        }


      } catch (error2) {

        if (copyStatus) {

          copyStatus.textContent =
            "Não foi possível copiar.";

        }

      }

    }

  }


  /* ==========================================================
     CÓPIA ALTERNATIVA
     ========================================================== */

  function fallbackCopy(text) {

    const textarea =
      document.createElement("textarea");


    textarea.value = text;

    textarea.style.position = "fixed";

    textarea.style.left = "-9999px";

    textarea.style.top = "0";

    textarea.style.opacity = "0";


    document.body.appendChild(
      textarea
    );


    textarea.focus();

    textarea.select();

    textarea.setSelectionRange(
      0,
      textarea.value.length
    );


    const resultado =
      document.execCommand("copy");


    textarea.remove();


    if (!resultado) {

      throw new Error(
        "Falha ao copiar"
      );

    }

  }


  /* ==========================================================
     BOTÃO
     ========================================================== */

  if (copyButton) {

    copyButton.addEventListener(
      "click",
      copyPixCode
    );

  }


  /* ==========================================================
     INICIALIZAR TUDO
     ========================================================== */

  renderAmount();

  renderQrCode();


  /*
    Mostra imediatamente 10:00
  */

  updateTimer();


  /*
    Depois atualiza a cada segundo
  */

  timerInterval =
    setInterval(
      updateTimer,
      1000
    );

});
