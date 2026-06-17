import { createContext, useContext, useState } from "react";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [actualtext, setactualText] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        actualtext,
        setactualText,
        loading,
        setLoading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);
