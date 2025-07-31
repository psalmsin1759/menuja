
export const getToken = async (): Promise<string | null> => {
    try {
      const response = await fetch("/api/getAssemblyToken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });
      const data = await response.json();
      return data.token ?? null;
    } catch (error) {
      console.error("Error fetching token:", error);
      return null;
    }
  };