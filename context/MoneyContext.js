import React, { createContext, useState } from "react";

export const MoneyContext = createContext(
    {
        transaction: [],
        setTransaction: () => {},
        balance: 0,
        setBalance: () => {},
    }
);

export const MoneyProvider = ({ children }) => {
  const [transaction, setTransaction] = useState([]);
  const [balance, setBalance] = useState(10000);

  return (
    <MoneyContext.Provider
      value={{
        transaction,
        setTransaction,
        balance,
        setBalance,
      }}
    >
      {children}
    </MoneyContext.Provider>
  );
};
