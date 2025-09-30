import React , {useState, createContext} from "react";

const initialTransactions = [
    { name: "Sarah Miller", type: "paid", amount: "-₹150", status: "success" },
    { name: "Jane Doe", type: "received", amount: "+₹500", status: "success" },
    { name: "Mohan S.", type: "paid", amount: "-₹200", status: "failed" },
    { name: "Coffee Shop", type: "paid", amount: "-₹120", status: "success" },
    { name: "Lekha M.", type: "paid", amount: "-₹180", status: "failed" },
    { name: "Roopesh K.", type: "received", amount: "+₹750", status: "success" },
];



export const TransactionContext = createContext();

export const TransactionProvider = ({children}) =>
{
    const [transaction,setTransaction] = useState(initialTransactions);


    const addTransaction = (newTransaction) => 
    {
            setTransaction((prevTransactions)=>[newTransaction, ...prevTransactions]);
    }

    return(
        <TransactionContext.Provider value={{transaction, addTransaction}}>
            {children}
        </TransactionContext.Provider>
    )
};