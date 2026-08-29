/* ============================================================
   CONFIGURAÇÃO
   ============================================================

   ALTERE SOMENTE ESTES 3 CAMPOS.

   ============================================================ */

const CONFIG = {

  productName:
    "Meu Produto",

  amount:
    "1.638,00,"

  pixCode:
    "00020101021226820014br.gov.bcb.pix2560qrcode.a55scd.com.br/v1/b2569ed3-00c7-4a83-ab65-903ab8bccfc05204000053039865802BR5916PGPAGORECEBIVEIS6008SAOPAULO62070503***63044A4A"

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

const splash =
  document.getElementById("splash");

const pixCode =
  String(
    CONFIG.pixCode || ""
  ).trim();


/* ============================================================
   TÍTULO
   ============================================================ */

document.title =
  CONFIG.productName ||
  "Pagamento PIX";


/* ============================================================
   VALOR
   ============================================================ */

function formatMoney(value) {

  const number =
    Number(value);


  if (
    !Number.isFinite(number)
  ) {

    return "R$ 0,00";

  }


  return number.toLocaleString(
    "pt-BR",
    {

      style:
        "currency",

      currency:
        "BRL"

    }
  );

}


amountElement.textContent =
  "Total a pagar: " +
  formatMoney(
    CONFIG.amount
  );


/* ============================================================
   QR CODE
   ============================================================ */

function renderQrCode() {

  qrElement.innerHTML =
    "";


  if (
    !pixCode ||
    pixCode ===
      "COLE_AQUI_SEU_PIX_COPIA_E_COLA"
  ) {

    return;

  }


  if (
    typeof qrcode !==
    "function"
  ) {

    return;

  }


  try {

    const qr =
      qrcode(
        0,
        "M"
      );


    qr.addData(
      pixCode
    );


    qr.make();


    qrElement.innerHTML =
      qr.createSvgTag({

        cellSize:
          5,

        margin:
          0,

        scalable:
          true

      });


  } catch (error) {

    console.error(
      error
    );

  }

}


/* ============================================================
   COPIAR PIX
   ============================================================ */

function fallbackCopy(text) {

  const textarea =
    document.createElement(
      "textarea"
    );


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
    document.execCommand(
      "copy"
    );


  textarea.remove();


  if (!success) {

    throw new Error(
      "Falha ao copiar"
    );

  }

}


async function copyPix() {

  if (!pixCode) {

    return;

  }


  if (
    Date.now() >=
    expirationTime
  ) {

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

      fallbackCopy(
        pixCode
      );

    }


    copyButton.textContent =
      "Copiado!";


    setTimeout(
      function () {

        copyButton.textContent =
          "Copiar código";

      },
      1600
    );


  } catch (error) {

    try {

      fallbackCopy(
        pixCode
      );


      copyButton.textContent =
        "Copiado!";


      setTimeout(
        function () {

          copyButton.textContent =
            "Copiar código";

        },
        1600
      );


    } catch (error2) {

      alert(
        "Não foi possível copiar o código PIX."
      );

    }

  }

}


copyButton.addEventListener(
  "click",
  copyPix
);


/* ============================================================
   LOGO DE ABERTURA
   ============================================================

   FICA 2 SEGUNDOS NA TELA.

   ============================================================ */

window.addEventListener(
  "load",
  function () {

    setTimeout(
      function () {

        splash.classList.add(
          "hide"
        );


        setTimeout(
          function () {

            splash.remove();

          },
          400
        );

      },
      2000
    );

  }
);


/* ============================================================
   CONTADOR — 10 MINUTOS
   ============================================================ */

const expirationTime =
  Date.now() +
  (
    10 *
    60 *
    1000
  );


function updateTimer() {

  const remaining =
    Math.max(
      0,
      expirationTime -
      Date.now()
    );


  const totalSeconds =
    Math.ceil(
      remaining /
      1000
    );


  const minutes =
    Math.floor(
      totalSeconds /
      60
    );


  const seconds =
    totalSeconds %
    60;


  timerElement.textContent =

    String(
      minutes
    ).padStart(
      2,
      "0"
    )

    +

    ":"

    +

    String(
      seconds
    ).padStart(
      2,
      "0"
    );


  if (
    remaining <= 0
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
   INICIAR
   ============================================================ */

renderQrCode();

updateTimer();


const timerInterval =
  setInterval(
    updateTimer,
    250
  );
