"use client";
import React, { useState, useEffect, useRef } from "react";
import { X, Sparkles, Send, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import { ChatMessage } from "../types";
import { getStylingAdvice } from "../services/geminiService";

interface AiStylistModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const initialTimestamp = Date.now();
export const AiStylistModal: React.FC<AiStylistModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      text: "Hello! I am your AI assistant at Jia Pixel. Ask me anything about our web development, SEO, digital marketing services, pricing, or how we can help your business grow.\n\n[MESSAGE_BUTTON:Ready to start your project? Send us a message]",
      timestamp: initialTimestamp,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSendMessageToAdmin = () => {
    onClose(); // Close the modal
    router.push("/messages"); // Navigate to messages page
  };

  const renderMessageWithButton = (text: string) => {
    const buttonMatch = text.match(/\[MESSAGE_BUTTON:(.*?)\]/);

    if (buttonMatch) {
      const messageText = text.replace(/\[MESSAGE_BUTTON:.*?\]/, "").trim();
      const buttonText = buttonMatch[1];

      return (
        <div>
          <div className="mb-3">{messageText}</div>
          <button
            onClick={handleSendMessageToAdmin}
            className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-purple-600 to-blue-500 text-white rounded-full text-sm font-medium hover:from-purple-700 hover:to-blue-600 transition-all duration-300 shadow-lg"
          >
            <MessageCircle size={16} />
            {buttonText}
          </button>
        </div>
      );
    }

    return text;
  };

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      role: "user",
      text: input,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const responseText = await getStylingAdvice(input);

    const modelMsg: ChatMessage = {
      role: "model",
      text: responseText,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, modelMsg]);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-[#111] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-[#161616]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-tr from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-serif text-xl text-white">
                Jia Pixel AI Assistant
              </h3>
              <p className="text-xs text-gray-400">
                Expert in Web Development & Digital Marketing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#0a0a0a]">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-white text-black rounded-tr-none"
                    : "bg-[#1c1c1c] text-gray-200 rounded-tl-none border border-gray-800"
                }`}
              >
                {msg.role === "model"
                  ? renderMessageWithButton(msg.text)
                  : msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#1c1c1c] p-4 rounded-2xl rounded-tl-none border border-gray-800 flex gap-1">
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                <span
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></span>
                <span
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-800 bg-[#161616]">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about web development, SEO, pricing, or our services..."
              className="w-full bg-[#0a0a0a] text-white border border-gray-700 rounded-full pl-6 pr-14 py-4 focus:outline-none focus:border-gray-500 transition-colors placeholder-gray-600"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send size={18} className="text-black ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
