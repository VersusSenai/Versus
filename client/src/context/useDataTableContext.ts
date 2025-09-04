import { useContext } from "react";
import { DataTableContext } from "./DataTableContext";

export const useDataTableContext = () => {
  const context = useContext(DataTableContext);
  if (!context) throw new Error('useDataTableContext must be used within a DataTableProvider');
  return context;
};