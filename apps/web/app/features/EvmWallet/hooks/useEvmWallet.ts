import { useContext } from "react";

import { EvmWalletContext, EvmWalletContextProps } from "../contexts/EvmWalletContext";

export const useEvmWallet = (): EvmWalletContextProps => {
  const context = useContext(EvmWalletContext);
  if (!context) {
    throw new Error("useEvmWallet must be used within EvmWalletProvider");
  }
  return context;
};