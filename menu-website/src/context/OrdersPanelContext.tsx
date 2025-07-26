"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface OrdersPanelContextProps {
  isOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
}

const OrdersPanelContext = createContext<OrdersPanelContextProps | undefined>(
  undefined
);

export const OrdersPanelProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openPanel = () => setIsOpen(true);
  const closePanel = () => setIsOpen(false);

  return (
    <OrdersPanelContext.Provider value={{ isOpen, openPanel, closePanel }}>
      {children}
    </OrdersPanelContext.Provider>
  );
};

export const useOrdersPanel = () => {
  const context = useContext(OrdersPanelContext);
  if (!context) throw new Error("useOrdersPanel must be used within provider");
  return context;
};
