/* ============================================================
   CONFIGURAÇÃO
   ============================================================

   ALTERE SOMENTE ESTES 3 CAMPOS:

   productName = nome do produto

   amount = valor que aparecerá na tela

   pixCode = PIX COPIA E COLA completo

   ============================================================ */

const CONFIG = {

  productName: "Meu Produto",

  amount: "1.671,80",

  pixCode:
    "00020101021226820014br.gov.bcb.pix2560qrcode.a55scd.com.br/v1/763dcfd0-9af5-4fa4-863f-9e27224fab0c5204000053039865802BR5916PGPAGORECEBIVEIS6008SAOPAULO62070503***6304509A"

};


/* ============================================================
   ELEMENTOS
   ============================================================ */

const amountElement =
  document.getElementById("amount");

const qrElement =
  document.getElementById("qrcode");

const timerElement =
  document.getElementById("timer");

const copyButton =
  document.getElementById("copyButton");

const copyStatus =
  document.getElementById("copyStatus");


/* ============================================================
   TÍTULO
   ============================================================ */

document.title =
  CONFIG.productName || "Pagamento PIX";


/* ============================================================
   MOSTRAR VALOR
   ============================================================ */

function renderAmount() {

  amountElement.textContent =
    `Total a pagar: R$ ${CONFIG.amount}`;

}


/* ============================================================
   GERAR QR CODE
   ============================================================ */

function renderQrCode() {

  qrElement.innerHTML = "";

  const pixCode =
    CONFIG.pixCode.trim();


  if (!pixCode) {

    qrElement.textContent =
      "Código PIX não configurado.";

    return;

  }


  if (typeof qrcode !== "function") {

    qrElement.textContent =
      "Não foi possível carregar o QR Code.";

    return;

  }


  try {

    const qr =
      qrcode(0, "M");


    qr.addData(pixCode);

    qr.make();


    qrElement.innerHTML =
      qr.createSvgTag({

        cellSize: 5,

        margin: 0,

        scalable: true

      });


  } catch (error) {

    console.error(error);

    qrElement.textContent =
      "Código PIX inválido.";

  }

}


/* ============================================================
   CONTADOR — 10 MINUTOS
   ============================================================ */

const expirationTime =
  Date.now() + (10 * 60 * 1000);


function updateTimer() {

  const remainingMs =
    Math.max(
      0,
      expirationTime - Date.now()
    );


  const totalSeconds =
    Math.ceil(
      remainingMs / 1000
    );


  const minutes =
    Math.floor(
      totalSeconds / 60
    );


  const seconds =
    totalSeconds % 60;


  timerElement.textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;


  if (remainingMs <= 0) {

    timerElement.textContent =
      "00:00";

    copyButton.disabled =
      true;

    copyStatus.textContent =
      "";

    clearInterval(timerInterval);

  }

}


/* ============================================================
   COPIAR PIX
   ============================================================ */

async function copyPixCode() {

  if (
    Date.now() >= expirationTime
  ) {

    return;

  }


  const pixCode =
    CONFIG.pixCode.trim();


  try {

    /*
      iPhone / iPad / Android / Chrome / Safari
    */

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


    copyStatus.textContent =
      "Código PIX copiado.";


  } catch (error) {

    try {

      fallbackCopy(pixCode);

      copyStatus.textContent =
        "Código PIX copiado.";

    } catch (fallbackError) {

      copyStatus.textContent =
        "Não foi possível copiar automaticamente.";

    }

  }

}


/* ============================================================
   CÓPIA ALTERNATIVA
   ============================================================ */

function fallbackCopy(text) {

  const textarea =
    document.createElement("textarea");


  textarea.value =
    text;


  textarea.setAttribute(
    "readonly",
    ""
  );


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


  const success =
    document.execCommand("copy");


  textarea.remove();


  if (!success) {

    throw new Error(
      "Falha ao copiar"
    );

  }

}


/* ============================================================
   BOTÃO
   ============================================================ */

copyButton.addEventListener(
  "click",
  copyPixCode
);


/* ============================================================
   INICIAR
   ============================================================ */

renderAmount();

renderQrCode();

updateTimer();


const timerInterval =
  setInterval(
    updateTimer,
    250
  );
