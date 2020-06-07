let cardNumberInput = document.getElementById("card-number-input");
let getBalanceButton = document.getElementById("get-balance");

function loading(bool) {
  let loadingIndicator = document.querySelector(".loader");
  bool === true
    ? loadingIndicator.classList.add("loading")
    : loadingIndicator.classList.remove("loading");
}

function showError() {
  let errorEmojis = ["💔", "😭", "😥", "🥺", "😣"];
  let randomEmoji = errorEmojis[Math.floor(Math.random() * errorEmojis.length)];
  let resultParentElement = document.querySelector(".results");
  let visibleResultElement = document.querySelector(".result-value .visible");
  let resultsTitle = document.querySelector(".results .result-title");

  resultParentElement.setAttribute("data-has-results", "true");
  resultParentElement.setAttribute("aria-hidden", "false");
  resultParentElement.setAttribute("aria-busy", "false");
  resultsTitle.innerText = "Error";

  visibleResultElement.innerText = randomEmoji;
  loading(false);
}

function getBalance() {
  loading(true);
  let cardNumber = cardNumberInput.value;

  fetch(`https://api.xor.cl/bip/new.php?n=${cardNumber}`)
    .then((response) => response.json())
    .then((response) => {
      if (response.valida === true) {
        let rawBalance = response.saldo.toString();
        let formattedBalance = `$${rawBalance.replace(
          /(\d)(?=(\d\d\d)+(?!\d))/g,
          "$1."
        )}`;

        loading(false);
        updateBalance(rawBalance, formattedBalance);
      } else {
        showError();
      }
    });
}

function updateBalance(rawBalance, formattedBalance) {
  let resultParentElement = document.querySelector(".results");
  let visibleResultElement = document.querySelector(".result-value .visible");
  let accessibleResultElement = document.querySelector(
    ".result-value .accessible"
  );

  resultParentElement.setAttribute("data-has-results", "true");
  resultParentElement.setAttribute("aria-hidden", "false");
  resultParentElement.setAttribute("aria-busy", "false");
  visibleResultElement.innerText = formattedBalance;
  accessibleResultElement.innerText = rawBalance;
}

function someCard() {
  cardNumberInput.value.length > 0
    ? (getBalanceButton.disabled = false)
    : (getBalanceButton.disabled = true);
  return cardNumberInput.value.length > 0;
}

cardNumberInput.addEventListener("input", someCard);
getBalanceButton.addEventListener("click", getBalance);
cardNumberInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && someCard) {
    getBalance();
  }
});

someCard();
