// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react"
import { FaRobot } from "react-icons/fa"
import { RxCross2 } from "react-icons/rx"
import { gsap } from "gsap"
import { Spinner } from "./loader"

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState("")
  const botRef = useRef(null)
  const [loading, setLoading] = useState(false)

  // Ref for the chat container to scroll to the latest message
  const messagesEndRef = useRef(null)

  // Scroll to the bottom when messages or loading state change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, loading])

  // Toggle chat window open/close
  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  // Function to send the message
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return // Do nothing if the input is empty

    // Add the user's message to the chat
    setMessages((prev) => [...prev, { sender: "user", content: inputMessage }])

    try {
      setLoading(true)
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/chat-bot`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: inputMessage,
          }),
        }
      )

      if (!response.ok) {
        setLoading(false)
        throw new Error("Failed to send message")
      }

      const data = await response.json()
      setLoading(false)

      // Add bot's response to the chat
      setMessages((prev) => [
        ...prev,
        { sender: "bot", content: formatBotResponse(data.message) },
      ])
    } catch (error) {
      setLoading(false)
      console.error("Error sending message:", error)
      setMessages((prev) => [
        ...prev,
        { sender: "bot", content: "Oops! Something went wrong. Try again." },
      ])
    } finally {
      setInputMessage("") // Clear the input field
    }
  }

  // Function to format bot response with HTML
  const formatBotResponse = (response) => {
    return (
      response
        // Bold text (e.g., **bold text**)
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        // Italics text (e.g., *italic text*)
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        // Headings (e.g., ## Heading)
        .replace(/## (.*?)\n/g, "<h2>$1</h2>")
        .replace(/# (.*?)\n/g, "<h1>$1</h1>")
        // Bullet point lists (e.g., * Item)
        .replace(/\n\* (.*?)(?=\n|$)/g, "<li>$1</li>")
        .replace(/(<li>.*<\/li>)/g, "<ul>$1</ul>") // Wrap in <ul> tags
        // Numbered lists (e.g., 1. Item)
        .replace(/\n\d+\. (.*?)(?=\n|$)/g, "<li>$1</li>")
        .replace(/(<li>.*<\/li>)/g, "<ol>$1</ol>") // Wrap in <ol> tags
        // Line breaks (convert newlines to <br>)
        .replace(/\n/g, "<br />")
    )
  }

  // GSAP bounce animation for the chatbot icon
  useEffect(() => {
    const bounceAnimation = (element) => {
      gsap.fromTo(
        element,
        { y: -8 },
        {
          y: 0,
          repeat: -1,
          yoyo: true,
          duration: 2,
          ease: "bounce.out",
        }
      )
    }

    if (botRef.current) bounceAnimation(botRef.current)
  }, [])

  return (
    <>
      <div className="fixed bottom-14 right-8 md:right-32 z-50">
        <button
          ref={botRef}
          onClick={toggleChat}
          className="bg-primary text-white p-4 rounded-full shadow-lg focus:outline-none"
        >
          <FaRobot className="w-9 h-9" />
        </button>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 right-4 md:bottom-32 md:right-8 w-full max-w-[90%] md:max-w-[40rem] h-[30rem] md:h-[40rem] bg-white rounded-lg shadow-lg p-4 z-50">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Chatbot</h2>
              <RxCross2
                onClick={toggleChat}
                className="w-5 h-5 text-red-500 focus:outline-none cursor-pointer"
              />
            </div>

            <div className="flex-1 overflow-y-auto">
              <p className="font-semibold text-secondary">
                Ask me, I can help you prepare your Recipe!
              </p>
              {messages.map((msg, index) => (
                <p
                  key={index}
                  className={`mb-2 ${
                    msg.sender === "bot"
                      ? "text-primary-dark"
                      : "text-black font-bold"
                  }`}
                  dangerouslySetInnerHTML={{ __html: msg.content }}
                />
              ))}

              {/* Reference for the last message */}
              <div ref={messagesEndRef} />

              {/* Display "Loading..." message when waiting for bot response */}
              {loading && (
                <div className="flex items-center gap-2">
                  <p className="text-primary">Generating</p>
                  <Spinner
                    width={"16px"}
                    height={"16px"}
                    backgroundColor={"#F3043A"}
                    padding={"2px"}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-4">
              <input
                type="text"
                placeholder="Type a message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="w-full p-3 border rounded focus:outline-none focus:border-primary text-sm"
                disabled={loading} // Disable input when loading
              />
              <button
                onClick={handleSendMessage}
                className="bg-primary p-3 rounded text-white hover:bg-primaryHover"
                disabled={loading} // Disable send button when loading
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatBot
