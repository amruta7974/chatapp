import { useEffect, useState } from "react";
import api from "../axios.js";

function useGetAllUsers() {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);

      try {
        const response = await api.get("/api/user/allusers", {
          withCredentials: true,
        });

        setAllUsers(response.data);
      } catch (error) {
        console.error("Error in useGetAllUsers:", error);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  return [allUsers, loading, setAllUsers];
}

export default useGetAllUsers;