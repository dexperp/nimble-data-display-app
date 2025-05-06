
import { createContext, useState, useEffect, useContext } from "react";
import { toast } from "@/components/ui/sonner";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing user session on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function - in real app this would call an API
  const login = async (email, password) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock validation
      if (email === "user@example.com" && password === "password") {
        const userData = {
          id: "user123",
          name: "John Doe",
          email,
          role: "user"
        };
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        toast.success("Logged in successfully!");
        return true;
      } else {
        toast.error("Invalid credentials");
        return false;
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    toast.info("You've been logged out");
  };

  // Register function - in real app this would call an API
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        id: "user" + Math.floor(Math.random() * 1000),
        name,
        email,
        role: "user"
      };
      
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      toast.success("Account created successfully!");
      return true;
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
