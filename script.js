const translations = {
  en: {
    brandKicker: "sugiro.ai",
    lead: "Create QR codes instantly: no signup, no expiration, 100% free.",
    formTitle: "Build your QR code",
    textLabel: "Enter URL or text",
    textPlaceholder: "https://example.com",
    sizeLabel: "QR code size",
    sizeSmall: "Small (128x128 px)",
    sizeMedium: "Medium (256x256 px)",
    sizeLarge: "Large (512x512 px)",
    sizeXL: "Extra Large (1024x1024 px)",
    errorLabel: "Error correction level",
    errorLow: "Low",
    errorMedium: "Medium",
    errorHigh: "High",
    errorVeryHigh: "Very High",
    errorInfo:
      "A higher error correction level makes the QR code more reliable if it gets dirty, damaged, or partially covered, but it also makes the code more complex with more modules.",
    colorLabelDesktop: "QR code color (click the bar below)",
    colorLabelMobile: "QR code color (tap the bar below)",
    generate: "Generate QR Code",
    previewTitle: "Preview and download",
    download: "Download QR Code",
    tipTitle: "Test before sharing!",
    tipLabel: "IMPORTANT",
    tipBody:
      "It is always a good idea to test the QR code before sending it to someone, printing it, or using it anywhere else. Scan it with your smartphone camera and open it in the browser or relevant app to confirm the text or URL is correct.",
    featuresTitle: "Features",
    feature1: "Never expires",
    feature2: "No account required",
    feature3: "Customize size and color",
    feature4: "Adjust error correction",
    feature5: "No watermark",
    footerBody:
      "Works entirely in your browser. Your data never leaves your device.",
    footerCreditPrefix: "by lula rocha",
    emptyAlert: "Please enter a URL or text",
    pageTitle: "QR Code Generator",
  },
  pt: {
    brandKicker: "sugiro.ai",
    lead: "Crie QR codes instantaneamente: sem cadastro, não expira, 100% gratuito.",
    formTitle: "Crie seu QR code",
    textLabel: "digite URL ou texto:",
    textPlaceholder: "https://example.com",
    sizeLabel: "tamanho do QR code:",
    sizeSmall: "Pequeno (128x128 px)",
    sizeMedium: "Médio (256x256 px)",
    sizeLarge: "Grande (512x512 px)",
    sizeXL: "Extra Grande (1024x1024 px)",
    errorLabel: "nível de correção de erro:",
    errorLow: "Baixo",
    errorMedium: "Médio",
    errorHigh: "Alto",
    errorVeryHigh: "Muito Alto",
    errorInfo:
      "Um nível de correção de erro mais alto torna o código QR mais confiável se ele ficar sujo, danificado ou parcialmente coberto, mas também torna o próprio código QR mais complexo, com mais quadrados.",
    colorLabelDesktop: "cor do QR code (clique na barra abaixo):",
    colorLabelMobile: "cor do QR code (toque na barra abaixo):",
    generate: "Gerar QR Code",
    previewTitle: "Visualize e baixe",
    download: "Baixar QR Code",
    tipTitle: "Teste antes de compartilhar!",
    tipLabel: "IMPORTANTE",
    tipBody:
      "É sempre bom testar o QR code antes de enviar para alguém, imprimir ou usar em qualquer outro lugar. Para isso basta escanear com a câmera do smartphone e abrir no navegador ou app correspondente para confirmar se o texto ou endereço (URL) que você digitou está correto.",
    featuresTitle: "Características",
    feature1: "Nunca expira",
    feature2: "Não precisa criar conta",
    feature3: "Personaliza tamanho e cor",
    feature4: "Ajuste de Correção de Erro",
    feature5: "Sem marca d'água",
    footerBody:
      "Funciona inteiramente no seu navegador. Seus dados nunca saem do seu dispositivo.",
    footerCreditPrefix: "por lula rocha",
    emptyAlert: "Digite uma URL ou texto",
    pageTitle: "Gerador de QR Code Grátis",
  },
};

const form = document.querySelector("#qr-form");
const textInput = document.querySelector("#text-input");
const sizeInput = document.querySelector("#size");
const colorInput = document.querySelector("#color");
const errorCorrectionInput = document.querySelector("#error-correction");
const qrCodeElement = document.querySelector("#qrcode");
const downloadButton = document.querySelector("#download-btn");
const localeButtons = document.querySelectorAll("[data-lang]");
const colorLabel = document.querySelector("#color-label");
const backToTopButton = document.querySelector(".back-to-top");

let currentLocale = getInitialLocale();

function getStorage() {
  try {
    return window.localStorage;
  } catch (error) {
    return null;
  }
}

function getInitialLocale() {
  const storage = getStorage();
  const storedLocale = storage ? storage.getItem("qr-language") : null;
  return storedLocale === "pt" ? "pt" : "en";
}

function getColorLabelKey() {
  return window.innerWidth <= 960 ? "colorLabelMobile" : "colorLabelDesktop";
}

function applyTranslations(locale) {
  const copy = translations[locale];

  document.documentElement.lang = locale;
  document.title = copy.pageTitle;
  textInput.placeholder = copy.textPlaceholder;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (!key || !copy[key]) {
      return;
    }

    element.textContent = copy[key];
  });

  colorLabel.textContent = copy[getColorLabelKey()];

  localeButtons.forEach((button) => {
    const isActive = button.dataset.lang === locale;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function generateQR() {
  const text = textInput.value.trim();
  const size = Number.parseInt(sizeInput.value, 10);
  const color = colorInput.value;
  const errorCorrectionLevel = errorCorrectionInput.value;

  if (!text) {
    window.alert(translations[currentLocale].emptyAlert);
    return;
  }

  qrCodeElement.innerHTML = "";

  new QRCode(qrCodeElement, {
    text,
    width: size,
    height: size,
    colorDark: color,
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel[errorCorrectionLevel],
  });

  downloadButton.classList.remove("hidden");
}

function downloadQR() {
  const canvas = qrCodeElement.querySelector("canvas");
  const image = qrCodeElement.querySelector("img");

  if (!canvas && !image) {
    return;
  }

  const link = document.createElement("a");
  link.download = "qrcode.png";
  link.href = canvas ? canvas.toDataURL("image/png") : image.src;
  link.click();
}

function setLocale(locale) {
  currentLocale = locale;
  const storage = getStorage();
  if (storage) {
    storage.setItem("qr-language", locale);
  }
  applyTranslations(locale);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  generateQR();
});

downloadButton.addEventListener("click", downloadQR);

localeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setLocale(button.dataset.lang === "pt" ? "pt" : "en");
  });
});

window.addEventListener("resize", () => {
  colorLabel.textContent = translations[currentLocale][getColorLabelKey()];
});

document.addEventListener("click", (event) => {
  document.querySelectorAll(".info-popover[open]").forEach((popover) => {
    if (!popover.contains(event.target)) {
      popover.removeAttribute("open");
    }
  });
});

if (backToTopButton) {
  const toggleBackToTop = () => {
    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const threshold =
      window.innerWidth <= 960
        ? scrollableHeight * 0.5
        : scrollableHeight * 0.25;
    const shouldShow = scrollableHeight > 0 && window.scrollY >= threshold;

    backToTopButton.classList.toggle("is-visible", shouldShow);
  };

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", toggleBackToTop, { passive: true });
  toggleBackToTop();
}

applyTranslations(currentLocale);
generateQR();

/* --------------------------------------------------------------------------
   Theme Toggle
   -------------------------------------------------------------------------- */
const themeToggle = document.querySelector(".theme-toggle");

function getTheme() {
  const storage = getStorage();
  const stored = storage ? storage.getItem("qr-theme") : null;
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function applyTheme(theme) {
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}

function setTheme(theme) {
  applyTheme(theme);
  const storage = getStorage();
  if (storage) {
    storage.setItem("qr-theme", theme);
  }
}

if (themeToggle) {
  applyTheme(getTheme());

  themeToggle.addEventListener("click", () => {
    const current = getTheme();
    setTheme(current === "dark" ? "light" : "dark");
  });

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      const storage = getStorage();
      const stored = storage ? storage.getItem("qr-theme") : null;
      if (!stored) {
        applyTheme(e.matches ? "dark" : "light");
      }
    });
}
