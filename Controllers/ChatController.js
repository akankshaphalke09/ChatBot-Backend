// backend/Controllers/ChatController.js
import axios from "axios";

const conversations = new Map();

export const chatWithOpenRouter = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    const userId = token || req.ip || "anonymous";
    let history = conversations.get(userId) || [];
    history.push({ role: "user", content: message });
    // 4. (Optional) Limit history length so request doesn't get too big
    const MAX_MESSAGES = 20; // last 20 turns
    if (history.length > MAX_MESSAGES) {
      history = history.slice(history.length - MAX_MESSAGES);
    }

    const openRouterResponse = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini", // or whichever
        messages: [
          {
            role: "system",
            content: "You are a helpful and concise assistant.",
          },
          ...history,
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": process.env.FRONTEND_URL || "http://localhost:3000", // optional but recommended
          "X-Title": "My Chat App", // optional
        },
      }
    );

    const reply =
      openRouterResponse.data?.choices?.[0]?.message?.content ||
      "No response from model";
    history.push({ role: "assistant", content: reply });
    conversations.set(userId, history);
    return res.json({ reply });
  } catch (err) {
    console.error("OpenRouter error:", err.response?.data || err.message);
    return res.status(500).json({
      error: "Failed to get response from OpenRouter",
    });
  }
};

export const clearChatHistory = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    const userId = token || req.ip || "anonymous";

    // Clear the conversation history for this user
    conversations.delete(userId);

    return res.json({ success: true, message: "Chat history cleared" });
  } catch (err) {
    console.error("Clear chat error:", err.message);
    return res.status(500).json({
      error: "Failed to clear chat history",
    });
  }
};
