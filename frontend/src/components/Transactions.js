import React, { useEffect, useState } from "react";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [sortType, setSortType] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetch("http://127.0.0.1:5000/transactions")
      .then((response) => response.json())
      .then((data) => setTransactions(data))
      .catch((error) => console.error("Error fetching transactions:", error));
  }, []);

  // Filtering transactions based on type (all, deposits, withdrawals)
  const filteredTransactions = transactions.filter(
    (tx) =>
      filterType === "all" ||
      (filterType === "deposit" ? tx.amount > 0 : tx.amount < 0)
  );

  // Sorting transactions based on date or amount
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortType === "newest") return new Date(b.date) - new Date(a.date);
    if (sortType === "oldest") return new Date(a.date) - new Date(b.date);
    if (sortType === "highest") return b.amount - a.amount;
    return a.amount - b.amount;
  });

  // Searching transactions by note or amount
  const searchedTransactions = sortedTransactions.filter(
    (tx) =>
      tx.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.amount.toString().includes(searchQuery)
  );

  // Paginate the transactions
  const totalPages = Math.ceil(searchedTransactions.length / itemsPerPage);
  const paginatedTransactions = searchedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate the current balance
  const currentBalance = transactions.reduce(
    (balance, tx) => balance + tx.amount,
    0
  ).toFixed(2);

  return (
    <div className="transactions-container">
      <h2>Transaction History</h2>

      {/* Current Balance Display */}
      <div className="balance-display">
        <h3>Current Balance: ${currentBalance}</h3>
      </div>

      {/* Search, Filter & Sort Controls */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search transactions..."
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />

        <select onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">All Transactions</option>
          <option value="deposit">Deposits</option>
          <option value="withdrawal">Withdrawals</option>
        </select>

        <select onChange={(e) => setSortType(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest">Highest Amount</option>
          <option value="lowest">Lowest Amount</option>
        </select>
      </div>

      {/* Transaction List */}
      <ul className="transaction-list">
        {paginatedTransactions.length > 0 ? (
          paginatedTransactions.map((tx) => (
            <li key={tx.id} className="transaction-card">
              <span className={`transaction-amount ${tx.amount >= 0 ? "positive" : "negative"}`}>
                ${tx.amount.toFixed(2)}
              </span>
              <span className="transaction-note">{tx.note}</span>
              <small className="transaction-date">{new Date(tx.date).toLocaleString()}</small>
            </li>
          ))
        ) : (
          <p>No transactions found.</p>
        )}
      </ul>

      {/* Pagination Controls */}
      <div className="pagination">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
          ← Prev
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
          Next →
        </button>
      </div>
    </div>
  );
}

export default Transactions;
