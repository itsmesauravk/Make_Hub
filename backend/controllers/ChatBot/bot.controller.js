const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.BOT_API_KEY ;

const chatbot = async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) {
      return res.status(400).json({ error: "Message not provided" });
    }

    const genAI = new GoogleGenerativeAI(API_KEY); // Use environment variable
    const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Consider using gemini-pro for more complex interactions

    const systemPrompt = "Only respond to questions about food, recipes, drinks, and fruits. If the question is outside these topics, reply: 'I can only discuss food-related topics.'"

    const result = await model.generateContent([systemPrompt, userMessage]);
    const botReply = await result.response.text();

    return res.status(200).json({ 
      message: botReply || 'Sorry, I could not generate a response.' 
    });
  } catch (error) {
    console.error("Chatbot error:", error);
    return res.status(500).json({ error: "Failed to generate content" });
  }
};

module.exports = chatbot;
