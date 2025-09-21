import { useEffect, useState, useRef } from "react";
import api from "../api/axiosConfig";

export default function ChatBox({ project }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  const fetchMessages = async () => {
    if (!project) return;
    try {
      const res = await api.get(`/messages/${project._id}`);
      setMessages(res.data);
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  const sendMessage = async () => {
    if (!input || !project) return;

    const userMessage = { role: "user", text: input, createdAt: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await api.post(`/projects/${project._id}/chat`, {
        message: input,
      });
      const assistantMessage = {
        role: "assistant",
        text: res.data.message,
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Error sending message",
          createdAt: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [project]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 flex flex-col bg-gray-50 rounded-lg shadow-md">
      {/* Header */}
      <div className="p-4 bg-gray-100 border-b font-semibold text-gray-700 text-center sm:text-left">
        {project?.name || "Select a project"}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 flex flex-col gap-2 min-h-[200px]">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`p-3 rounded break-words ${
              m.role === "user"
                ? "bg-blue-100 self-end text-right sm:max-w-[75%] max-w-[90%]"
                : "bg-gray-200 self-start text-left sm:max-w-[75%] max-w-[90%]"
            }`}
          >
            <div>{m.text}</div>
            <div className="text-xs text-gray-400 mt-1 whitespace-nowrap">
              {new Date(m.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="p-3 rounded max-w-[60%] bg-gray-200 self-start italic text-gray-600">
            Assistant is typing...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="flex flex-col sm:flex-row gap-2 p-4 border-t bg-white">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded transition-colors w-full sm:w-auto"
        >
          Send
        </button>
      </div>
    </div>
  );
}
