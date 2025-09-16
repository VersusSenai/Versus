import { useContext } from "react";
import { TeamsPageContext } from "./TeamsPageContext";


export const useTeamsPageContext = () => {
  const context = useContext(TeamsPageContext);
  if (!context) throw new Error('useTeamsPageContext must be used within a TeamsPageProvider');
  return context;
};