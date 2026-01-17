"use client";
import { createContext, useContext, useState } from "react";

const DashboardContext = createContext();

export const useDashboardContext = () => {
  return useContext(DashboardContext);
};

export const DashBoardProvider = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <DashboardContext.Provider value={{ showSidebar, setShowSidebar }}>
      {children}
    </DashboardContext.Provider>
  );
};
