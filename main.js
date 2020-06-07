let cardNumberInput = document.getElementById("card-number-input");
let getBalanceButton = document.getElementById("get-balance");

async function getBalance() {
  if (someCard) {
    let cardNumber = cardNumberInput.value;
    let response = await fetch(
      `https://api.xor.cl/bip/new.php?n=${cardNumber}`
    );
    let data = await response.json();

    var rawBalance = data.saldo.toString();
    var formattedBalance = `$${rawBalance.replace(
      /(\d)(?=(\d\d\d)+(?!\d))/g,
      "$1."
    )}`;

    updateBalance(rawBalance, formattedBalance);
  }
}

function updateBalance(rawBalance, formattedBalance) {
  let resultParentElement = document.querySelector(".results");
  let visibleResultElement = document.querySelector(
    ".results .result-value .visible"
  );
  let accessibleResultElement = document.querySelector(
    ".results .result-value .accessible"
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
