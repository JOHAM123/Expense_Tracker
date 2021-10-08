const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const category = document.getElementById('category');
const table = document.querySelector("table");
const exp_date = document.getElementById('exp_date');
const categories = ["Income","Utilities", "Groceries", "Entertainments", "Mortage"];
const expHeader = [ "Date", "Category", "Description", "Income", "Debits", "Balance"];

const localStorageTransactions = JSON.parse(
  localStorage.getItem('transactions')
);

let transactions =
  localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Add transaction
function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Please add a description and amount');
  } else {
    const income = category.value == 0 ? amount.value : 0
    const debit = category.value != 0 ? amount.value : 0
    let amounts = transactions.slice(-1).pop() || 0;
    if(amounts != 0)
        amounts = amounts.amount;

    let total = category.value != 0 ? (amounts - debit) : (amounts + income);
    total = total > 0 ? +total : -total;

    const transaction = {
      exp_date: exp_date.value,
      category: categories[category.value],
      desc: text.value,
      income: +income,
      debit: +debit,
      amount: total,
    };

    transactions.push(transaction);
    updateValues();

    updateLocalStorage();

    text.value = '';
    amount.value = '';
  }
}

// Update the balance, income and expense
function updateValues() {
  table.innerHTML = "";
  generateTableHead(table);
  generateTable(table, transactions);

  let amounts = transactions.slice(-1).pop() || 0;
  if(amounts != 0)
      amounts = amounts.amount;


  const income = transactions
    .filter(item => item.income != 0)
    .map(transaction => transaction.income)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  const expense = (
    transactions.filter(item => item.debit != 0)
    .map(transaction => transaction.debit)
    .reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2);

  balance.innerText = `${amounts} JPY`;
  money_plus.innerText = `${income} JPY`;
  money_minus.innerText = `${expense} JPY`;
}

// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);

  updateLocalStorage();

  init();
}

// Update local storage transactions
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Init app
function init() {
  updateValues();
}

init();

form.addEventListener('submit', addTransaction);


  function generateTableHead(table) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of expHeader) {
      let th = document.createElement("th");
      let text = document.createTextNode(key);
      th.appendChild(text);
      row.appendChild(th);
    }
  }
  
  function generateTable(table, data) {
    for (let element of data) {
      let row = table.insertRow();
      for (key in element) {
        let cell = row.insertCell();
        let text = document.createTextNode(element[key]);
        cell.appendChild(text);
      }
    }
  }
  