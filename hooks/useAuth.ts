import { useState, useEffect } from "react";

interface UserData {
  fullName: string;
  _id?: string;
  email?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user_info");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Auth error:", error);
      }
    }
    setLoading(false);
  }, []);

  return { user, isLoggedIn: !!user, loading };
};
