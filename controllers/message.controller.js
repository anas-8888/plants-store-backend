const { messageRepository } = require("../repositories/message.repository");

const messageController = {
  sendMessage: async (req, res) => {
    try {
      const { name, email, phone, message } = req.body;
      const result = await messageRepository.createMessage({ name, email, phone, message });
      res.status(201).json({ success: true, message: "Message sent successfully", data: result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Failed to send message" });
    }
  },

  findAllMessages: async (req, res) => {
    try {
      const messages = await messageRepository.getAllMessages();
      res.status(200).json({ success: true, data: messages });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Failed to retrieve messages" });
    }
  },

  findMessageById: async (req, res) => {
    try {
      const { id } = req.params;
      const message = await messageRepository.getMessageById(id);
      if (!message) {
        return res.status(404).json({ success: false, error: "Message not found" });
      }
      res.status(200).json({ success: true, data: message });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Failed to retrieve message" });
    }
  }
};

module.exports = { messageController };
