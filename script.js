document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const judgmentAmountInput = document.getElementById("judgment-amount");
  const judgmentDateInput = document.getElementById("judgment-date");
  const interestRateInput = document.getElementById("interest-rate");
  const updatedAmountDisplay = document.getElementById("updated-amount");
  const accruedInterestDisplay = document.getElementById("accrued-interest");
  const totalPaymentsDisplay = document.getElementById("total-payments");

  const paymentDateInput = document.getElementById("payment-date");
  const checkNumberInput = document.getElementById("check-number");
  const paymentAmountInput = document.getElementById("payment-amount");
  const paymentNotesInput = document.getElementById("payment-notes");
  const addPaymentBtn = document.getElementById("add-payment-btn");
  const paymentList = document.getElementById("payment-list");

  let payments = JSON.parse(localStorage.getItem("payments")) || [];

  function saveJudgmentDetails() {
    const judgmentData = {
      amount: parseFloat(judgmentAmountInput.value) || 0,
      date: judgmentDateInput.value,
      interestRate: parseFloat(interestRateInput.value) || 0,
    };

    localStorage.setItem("judgmentData", JSON.stringify(judgmentData));
  }

  function loadJudgmentDetails() {
    const storedData = JSON.parse(localStorage.getItem("judgmentData"));

    if (storedData) {
      judgmentAmountInput.value = storedData.amount || "";
      judgmentDateInput.value = storedData.date || "";
      interestRateInput.value = storedData.interestRate || 10;
    }

    updatePaymentList();
    calculateJudgment();
  }

  function calculateJudgment() {
    const principal = parseFloat(judgmentAmountInput.value) || 0;
    const judgmentDate = new Date(judgmentDateInput.value);
    const annualRate = parseFloat(interestRateInput.value) / 100 || 0;
    const today = new Date();

    if (
      isNaN(principal) ||
      isNaN(annualRate) ||
      isNaN(judgmentDate.getTime())
    ) {
      return;
    }

    const daysElapsed = Math.floor(
      (today - judgmentDate) / (1000 * 60 * 60 * 24)
    );

    const dailyInterestRate = annualRate / 365;
    let accruedInterest = principal * dailyInterestRate * daysElapsed;

    let totalPayments = payments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );
    let totalAmount = principal + accruedInterest - totalPayments;
    totalAmount = totalAmount < 0 ? 0 : totalAmount;

    accruedInterestDisplay.textContent = `$${accruedInterest.toFixed(2)}`;
    updatedAmountDisplay.textContent = `$${totalAmount.toFixed(2)}`;
    totalPaymentsDisplay.textContent = `$${totalPayments.toFixed(2)}`;
  }

  function addPayment() {
    const date = paymentDateInput.value;
    const checkNumber = checkNumberInput.value;
    const amount = parseFloat(paymentAmountInput.value);
    const notes = paymentNotesInput.value.trim();

    if (!date || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid payment amount and date.");
      return;
    }

    const newPayment = {
      date,
      checkNumber: checkNumber || "N/A",
      amount,
      notes,
    };

    payments.push(newPayment);
    localStorage.setItem("payments", JSON.stringify(payments));

    updatePaymentList();
    calculateJudgment();

    paymentDateInput.value = "";
    checkNumberInput.value = "";
    paymentAmountInput.value = "";
    paymentNotesInput.value = "";
  }

  function updatePaymentList() {
    paymentList.innerHTML = "";
    let totalPayments = payments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );

    payments.forEach((payment, index) => {
      const li = document.createElement("li");
      li.classList.add(
        "list-group-item",
        "bg-dark",
        "text-light",
        "d-flex",
        "justify-content-between"
      );

      li.innerHTML = `
        <div>
          <strong>Paid $${payment.amount.toFixed(2)}</strong> on ${payment.date}
          <br><small>Check #: ${payment.checkNumber}</small>
          <br><small>Notes: ${payment.notes || "None"}</small>
        </div>
        <button class="btn btn-danger btn-sm" onclick="removePayment(${index})">X</button>
      `;

      paymentList.appendChild(li);
    });

    totalPaymentsDisplay.textContent = `$${totalPayments.toFixed(2)}`;
  }

  window.removePayment = function (index) {
    payments.splice(index, 1);
    localStorage.setItem("payments", JSON.stringify(payments));
    updatePaymentList();
    calculateJudgment();
  };

  judgmentAmountInput.addEventListener("input", saveJudgmentDetails);
  judgmentDateInput.addEventListener("input", saveJudgmentDetails);
  interestRateInput.addEventListener("input", saveJudgmentDetails);

  document
    .getElementById("calculate-btn")
    .addEventListener("click", calculateJudgment);
  addPaymentBtn.addEventListener("click", addPayment);

  loadJudgmentDetails();
});
