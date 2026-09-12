/* ============================================================
   CONFIGURAÇÃO
   ============================================================ */

const CONFIG = {
  productName: "Meu Produto",

  amount: 2078,40

  pixCode: "00020101021226820014br.gov.bcb.pix2560qrcode.a55scd.com.br/v1/ef0f5890-584c-4cce-9ba3-d5f9f3a94eec5204000053039865802BR5915VVVALLEDEBARROS6008SAOPAULO62070503***6304A034"
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

    if (segundosRestantes
