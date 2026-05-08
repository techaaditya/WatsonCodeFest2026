export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const api = {
  prediction: {
    async predict(data: any) {
      try {
        const response = await fetch(`${API_BASE_URL}/prediction/predict`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch prediction results");
        }
        
        return await response.json();
      } catch (error) {
        console.error("API Error (prediction/predict):", error);
        throw error;
      }
    },
    
    async getDiseases() {
      const response = await fetch(`${API_BASE_URL}/prediction/diseases`);
      if (!response.ok) throw new Error("Failed to fetch diseases");
      return await response.json();
    }
  },
  
  genoguide: {
    async chat(message: string, mode: string = "general") {
      const response = await fetch(`${API_BASE_URL}/genoguide/chat?mode=${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (!response.ok) throw new Error("Chat failed");
      return await response.json();
    }
  }
};
