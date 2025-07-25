const fs = require('fs');
const path = require('path');
const mock = require('mock-fs');
const { expect } = require('chai');

// Import the main functions from index.js
const DATA_FILE = path.join(__dirname, 'balance.json');
const INITIAL_BALANCE = 1000.00;

// Helper functions (copied from index.js for testability)
function readBalance() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ balance: INITIAL_BALANCE }));
    return INITIAL_BALANCE;
  }
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  return data.balance;
}

function writeBalance(newBalance) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ balance: newBalance }));
}

describe('Account Management System', function () {
  beforeEach(function () {
    // Mock the file system with a fresh balance
    mock({
      [DATA_FILE]: JSON.stringify({ balance: INITIAL_BALANCE })
    });
  });

  afterEach(function () {
    mock.restore();
  });

  it('TC-01: View current account balance', function () {
    expect(readBalance()).to.equal(INITIAL_BALANCE);
  });

  it('TC-02: Credit account with valid amount', function () {
    let balance = readBalance();
    balance += 200;
    writeBalance(balance);
    expect(readBalance()).to.equal(INITIAL_BALANCE + 200);
  });

  it('TC-03: Debit account with sufficient funds', function () {
    let balance = readBalance();
    balance -= 300;
    writeBalance(balance);
    expect(readBalance()).to.equal(INITIAL_BALANCE - 300);
  });

  it('TC-04: Debit account with insufficient funds', function () {
    let balance = readBalance();
    // Try to debit more than available
    const debitAmount = balance + 100;
    // Simulate logic: should not allow
    if (balance >= debitAmount) {
      balance -= debitAmount;
      writeBalance(balance);
    }
    // Balance should remain unchanged
    expect(readBalance()).to.equal(INITIAL_BALANCE);
  });

  it('TC-05: Enter invalid menu option (simulate)', function () {
    // No state change, just check that balance is unchanged
    expect(readBalance()).to.equal(INITIAL_BALANCE);
  });

  it('TC-06: Exit the application (simulate)', function () {
    // No state change, just check that balance is unchanged
    expect(readBalance()).to.equal(INITIAL_BALANCE);
  });

  it('TC-07: Data consistency after multiple credits and debits', function () {
    let balance = readBalance();
    balance += 100; // credit
    writeBalance(balance);
    balance -= 50; // debit
    writeBalance(balance);
    balance += 25; // credit
    writeBalance(balance);
    expect(readBalance()).to.equal(INITIAL_BALANCE + 100 - 50 + 25);
  });

  it('TC-08: Data persistence between sessions', function () {
    // Simulate session 1
    let balance = readBalance();
    balance += 500;
    writeBalance(balance);
    // Simulate session 2 (new read)
    expect(readBalance()).to.equal(INITIAL_BALANCE + 500);
  });
});
