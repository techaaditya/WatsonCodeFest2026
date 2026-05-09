export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const api = {
  prediction: {
    async predict(data: any) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 45000);
        const response = await fetch(`${API_BASE_URL}/prediction/predict`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          signal: controller.signal,
        });
        clearTimeout(timeout);
        
        if (!response.ok) {
          throw new Error("Failed to fetch prediction results");
        }
        
        return await response.json();
      } catch (error) {
        console.error("API Error (prediction/predict):", error);
        if (error instanceof Error && error.name === "AbortError") {
          throw new Error("Prediction request timed out. Please try again.");
        }
        throw error;
      }
    },
    
    async predictSickleCell(data: any) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 45000);
        const response = await fetch(`${API_BASE_URL}/prediction/predict/sickle-cell`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          signal: controller.signal,
        });
        clearTimeout(timeout);
        
        if (!response.ok) {
          throw new Error("Failed to fetch prediction results");
        }
        
        return await response.json();
      } catch (error) {
        console.error("API Error (prediction/predict/sickle-cell):", error);
        if (error instanceof Error && error.name === "AbortError") {
          throw new Error("Prediction request timed out. Please try again.");
        }
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
    async chat(message: string, mode: string = "general", attachment?: File | null) {
      const form = new FormData();
      form.append("message", message);
      form.append("mode", mode);
      if (attachment) form.append("attachment", attachment);

      const response = await fetch(`${API_BASE_URL}/genoguide/chat`, {
        method: "POST",
        body: form,
      });
      if (!response.ok) throw new Error("Chat failed");
      return await response.json();
    },

    async chatStream(message: string, mode: string = "general", attachment?: File | null) {
      const form = new FormData();
      form.append("message", message);
      form.append("mode", mode);
      if (attachment) form.append("attachment", attachment);

      const response = await fetch(`${API_BASE_URL}/genoguide/chat/stream`, {
        method: "POST",
        body: form,
      });
      if (!response.ok || !response.body) throw new Error("Streaming chat failed");
      return response;
    }
  }
};
