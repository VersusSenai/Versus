import { useState } from "react";
import api from "../api";
import { toast } from "react-toastify";

export const useUpdateUser = () => {
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (data: { username: string; email: string }) => {
    setLoading(true);
    try {
      const response = await api.put("/user", data, { withCredentials: true });
      console.log("PUT /user response:", response.data);
      toast.success("Dados atualizados com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      toast.error("Erro ao atualizar usuário!");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdate, loading };
};
