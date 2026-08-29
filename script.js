/* ============================================================
   CONFIGURAÇÃO
   ============================================================

   ALTERE SOMENTE:

   productName = nome do produto

   pixCode = código PIX COPIA E COLA completo
   ============================================================ */


const CONFIG = {

  productName: "Meu Produto",

  pixCode: "COLE_AQUI_SEU_PIX_COPIA_E_COLA"

};


/* ============================================================
   NÃO ALTERE ABAIXO
   ============================================================ */


const pixCode = CONFIG.pixCode.trim();


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
   NOME DA PÁGINA
   ============================================================ */

document.title =
  CONFIG.productName || "Pagamento PIX";



/* ============================================================
   LER CAMPOS DO PIX
   ============================================================ */

function parsePixFields(payload) {

  const fields = {};

  let position = 0;


  while (position + 4 <= payload.length) {

    const id =
      payload.slice(position, position + 2);


    const length =
      Number(
        payload.slice(
          position + 2,
          position + 4
        )
      );


    if (!Number.isFinite(length)) {

      break;

    }


    const start =
      position + 4;


    const end =
      start + length;


    if (end > payload.length) {

      break;

    }


    fields[id] =
      payload.slice(start, end);


    position = end;

  }


  return fields;

}



/* ============================================================
   FORMATAR DINHEIRO
   ============================================================ */

function formatBrazilianMoney(value) {

  const number = Number(value);


  if (!Number.isFinite(number)) {

    return "R$ 0,00";

  }


  return number.toLocaleString(
    "pt-BR",
    {

      style: "currency",

      currency: "BRL"

    }
  );

}



/* ============================================================
   PEGAR VALOR DO PIX
   ============================================================ */

function getPixAmount(payload) {

  const fields =
    parsePixFields(payload);


  /*
    Campo 54:

    Transaction Amount
  */

  const amount =
    fields["54"];


  if (!amount) {

    return null;

  }


  const number =
    Number(amount);


  if (!Number.isFinite(number)) {

    return null;

  }


  return formatBrazilianMoney(number);

}



/* ============================================================
   MOSTRAR VALOR
   ============================================================ */

function renderAmount() {

  const amount =
    getPixAmount(pixCode);


  amountElement.textContent =
    `Total a pagar: ${amount || "R$ 0,00"}`;

}



/* ============================================================
   GERAR QR CODE
   ============================================================ */

function renderQrCode() {

  qrElement.innerHTML = "";


  /*
    Se ainda não colocou o PIX.
  */

  if (
    !pixCode ||
    pixCode ===
      "COLE_AQUI_SEU_PIX_COPIA_E_COLA"
  ) {

    qrElement.textContent =
      "Insira o código PIX no script.js";


    qrElement.style.fontSize =
      "16px";


    return;

  }



  /*
    Verificar biblioteca.
  */

  if (typeof qrcode !== "function") {

    qrElement.textContent =
      "Não foi possível carregar o gerador do QR Code.";

    return;

  }



  try {

    /*
      Criar QR Code.

      M = nível de correção.
    */

    const qr =
      qrcode(0, "M");


    /*
      Coloca o PIX dentro do QR Code.
    */

    qr.addData(pixCode);


    /*
      Gera o QR.
    */

    qr.make();


    /*
      Coloca o SVG na página.
    */

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
   COPIAR PIX
   ============================================================ */

async function copyPixCode() {


  /*
    Não permite copiar depois que o
    contador terminar.
  */

  if (
    Date.now() >= expirationTime
  ) {

    return;

  }



  try {


    /*
      Método moderno:

      iPhone
      Android
      Chrome
      Safari
      etc.
    */

    if (
      navigator.clipboard &&
      window.isSecureContext
    ) {


      await navigator.clipboard.writeText(
        pixCode
      );


    } else {


      /*
        Método alternativo.
      */

      fallbackCopy(pixCode);

    }



    copyStatus.textContent =
      "Código PIX copiado.";


  } catch (error) {


    /*
      Se o primeiro método falhar,
      tenta novamente pelo método
      alternativo.
    */

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
   MÉTODO ALTERNATIVO DE CÓPIA
   ============================================================ */

function fallbackCopy(text) {


  const textarea =
    document.createElement("textarea");


  textarea.value = text;


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


  const ok =
    document.execCommand("copy");


  textarea.remove();


  if (!ok) {

    throw new Error(
      "Falha ao copiar."
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
   CONTADOR
   ============================================================

   10 MINUTOS
   ============================================================ */

const expirationTime =
  Date.now() + (
    10 * 60 * 1000
  );



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



  /*
    Quando chegar a zero.
  */

  if (
    remainingMs <= 0
  ) {

    timerElement.textContent =
      "00:00";


    copyButton.disabled =
      true;


    clearInterval(
      timerInterval
    );

  }

}



/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */

renderAmount();

renderQrCode();

updateTimer();



const timerInterval =
  setInterval(
    updateTimer,
    250
  );
