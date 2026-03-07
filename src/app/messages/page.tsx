"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/app/(mainlayout)/components/banner/components/Navbar";

interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
}

interface Message {
  _id: string;
  sender: User;
  content: string;
  createdAt: string;
  read: boolean;
}

interface Conversation {
  _id: string;
  participants: User[];
  lastMessage: Message;
  unreadCount: number;
  updatedAt: string;
}

const MessagesPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const messagesContainerRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Admin states
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);
  const [messageContent, setMessageContent] = useState("");

  const isAdmin = session?.user?.role === "admin";

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const { scrollHeight, clientHeight } = messagesContainerRef.current;
      messagesContainerRef.current.scrollTop = scrollHeight - clientHeight;
    }
  };

  useEffect(() => {
    // Add a slight delay to ensure DOM is updated before scrolling
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 50);
    return () => clearTimeout(timer);
  }, [messages, selectedConversation]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session) {
      fetchConversations();
      if (isAdmin) {
        fetchUsers();
      } else {
        const fetchAdminUser = async () => {
          try {
            const res = await fetch("/api/users?role=admin");
            if (res.ok) {
              const data = await res.json();
              if (data.users && data.users.length > 0) {
                setAdminUser(data.users[0]);
              }
            }
          } catch (e) {
            console.error("Failed to fetch admin user", e);
          }
        };
        fetchAdminUser();
        // For regular users, automatically open new message modal if no conversations
        if (conversations.length === 0 && !isNewMessageModalOpen) {
          setIsNewMessageModalOpen(true);
        }
      }
    }
  }, [session, status, router]);

  useEffect(() => {
    if (isAdmin && searchTerm.length > 1) {
      const delaySearch = setTimeout(() => {
        searchUsers();
      }, 300);
      return () => clearTimeout(delaySearch);
    }
  }, [searchTerm, isAdmin]);

  const fetchConversations = async () => {
    try {
      const response = await fetch("/api/messages");
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const searchUsers = async () => {
    try {
      const response = await fetch(
        `/api/users?search=${encodeURIComponent(searchTerm)}`
      );
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/messages/${conversationId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Send message as admin to any user
  const sendMessageAsAdmin = async () => {
    if (!selectedUser || !messageContent.trim()) {
      alert("Please select a user and enter a message");
      return;
    }

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiverId: selectedUser._id,
          content: messageContent,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessageContent("");
        setSelectedUser(null);
        setSearchTerm("");
        setIsNewMessageModalOpen(false);
        fetchConversations();

        if (data.conversation) {
          setSelectedConversation(data.conversation);
          fetchMessages(data.conversation._id);
        }

        alert("Message sent successfully!");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Error sending message. Please try again.");
    }
  };

  // Send message as regular user to admin (Imran)
  const sendMessageToAdmin = async () => {
    if (!messageContent.trim()) {
      alert("Please enter a message");
      return;
    }

    try {
      let targetAdmin = adminUser;
      if (!targetAdmin) {
        // Fallback to fetch admin user
        const usersResponse = await fetch("/api/users?role=admin");
        if (!usersResponse.ok) {
          throw new Error("Failed to fetch admin user");
        }

        const usersData = await usersResponse.json();
        const adminUsers = usersData.users || [];

        if (adminUsers.length === 0) {
          alert("Admin user not found. Please try again later.");
          return;
        }

        targetAdmin = adminUsers[0];
        setAdminUser(targetAdmin);
      }

      if (!targetAdmin) {
        alert("Admin user not found. Please try again later.");
        return;
      }

      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiverId: targetAdmin._id,
          content: messageContent,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessageContent("");
        setIsNewMessageModalOpen(false);
        fetchConversations();

        if (data.conversation) {
          setSelectedConversation(data.conversation);
          fetchMessages(data.conversation._id);
        }

        alert("Message sent to Imran successfully!");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Error sending message. Please try again.");
    }
  };

  const sendMessageInConversation = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const otherParticipant = selectedConversation.participants.find(
      (p) => p._id !== session?.user?.id
    );

    if (!otherParticipant) return;

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiverId: otherParticipant._id,
          content: newMessage,
          conversationId: selectedConversation._id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [...prev, data.message]);
        setNewMessage("");
        fetchConversations();
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-background pt-16">
        <div className="container mx-auto p-4">
          <div className="text-center">Loading messages...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:block relative z-50">
        <Navbar onSearchClick={() => { }} />
      </div>
      <div className="h-[100dvh] md:h-[calc(100dvh-5rem)] bg-background pt-4 md:pt-4 flex flex-col overflow-hidden">
        <div className="container mx-auto p-0 md:p-4 flex-1 h-full overflow-hidden">
          <div className="bg-card md:rounded-lg border-0 md:border border-border h-full flex flex-col md:flex-row overflow-hidden">
            {/* Conversations List */}
            <div className={`w-full md:w-1/3 border-b md:border-b-0 md:border-r border-border flex flex-col ${selectedConversation ? "hidden md:flex" : "flex"}`}>
              <div className="p-4 border-b border-border">
                <h2 className="text-xl font-bold text-foreground">
                  Messages {isAdmin && "(Admin)"}
                </h2>
                {isAdmin && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Logged in as {session?.user?.name || "Admin"}
                  </p>
                )}
              </div>

              {/* Admin: New Message Button */}
              {isAdmin && (
                <div className="p-4 border-b border-border">
                  <button
                    onClick={() => setIsNewMessageModalOpen(true)}
                    className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                  >
                    💬 New Message
                  </button>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Search and message any user
                  </p>
                </div>
              )}

              <div className="flex-1 overflow-y-auto">
                {conversations.map((conversation) => {
                  const otherUser = conversation.participants.find(
                    (p) => p._id !== session?.user?.id
                  );

                  if (!otherUser) return null;

                  const isUnread = conversation.unreadCount > 0;

                  return (
                    <div
                      key={conversation._id}
                      className={`p-3 border-b border-border cursor-pointer hover:bg-accent transition-colors ${selectedConversation?._id === conversation._id
                        ? "bg-accent"
                        : ""
                        }`}
                      onClick={() => {
                        setSelectedConversation(conversation);
                        fetchMessages(conversation._id);
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                            {otherUser.image ? (
                              <img
                                src={otherUser.image}
                                alt={otherUser.name}
                                className="w-10 h-10 rounded-full"
                              />
                            ) : (
                              <span className="text-primary-foreground font-semibold text-base">
                                {otherUser.name?.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          {isUnread && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-card"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-semibold text-sm text-foreground truncate">
                              {otherUser.name}
                              {otherUser.role === "admin" && (
                                <span className="ml-2 bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded">
                                  Admin
                                </span>
                              )}
                            </h3>
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                              {formatTime(conversation.updatedAt)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {conversation.lastMessage?.content ||
                              "No messages yet"}
                          </p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-[10px] text-muted-foreground">
                              {formatDate(conversation.updatedAt)}
                            </span>
                            {isUnread && (
                              <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                                New
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {conversations.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    <div className="mb-4">
                      <svg
                        className="w-16 h-16 mx-auto text-muted-foreground/50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </div>
                    <p className="text-lg font-medium mb-2">
                      {isAdmin ? "No conversations yet" : "No messages yet"}
                    </p>
                    <p className="text-sm">
                      {isAdmin
                        ? "Start a conversation with users"
                        : "Send a message to get started"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Messages Area */}
            <div className={`flex-1 flex flex-col ${!selectedConversation ? "hidden md:flex" : "flex"}`}>
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-3 border-b border-border bg-card z-10 sticky top-0 flex-shrink-0">
                    {(() => {
                      const otherUser = selectedConversation.participants.find(
                        (p) => p._id !== session?.user?.id
                      );
                      return otherUser ? (
                        <div className="flex items-center">
                          <button
                            onClick={() => setSelectedConversation(null)}
                            className="md:hidden mr-2 p-2 -ml-2 text-muted-foreground hover:bg-accent rounded-full transition-colors flex-shrink-0"
                            aria-label="Back to conversations"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                          </button>
                          <Link href="/" className="md:hidden mr-3 p-2 -ml-2 text-muted-foreground hover:bg-accent rounded-full transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-primary" aria-label="Go to Homepage">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                          </Link>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                              {otherUser.image ? (
                                <img
                                  src={otherUser.image}
                                  alt={otherUser.name}
                                  className="w-8 h-8 rounded-full"
                                />
                              ) : (
                                <span className="text-primary-foreground text-sm font-semibold">
                                  {otherUser.name?.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-sm text-foreground leading-tight">
                                {otherUser.name}
                                {otherUser.role === "admin" && (
                                  <span className="ml-2 bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.5 rounded">
                                    Admin
                                  </span>
                                )}
                              </h3>
                              <p className="text-xs text-muted-foreground leading-tight">
                                {otherUser.email}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </div>

                  {/* Messages */}
                  <div
                    ref={messagesContainerRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10 relative"
                  >
                    {messages.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        <svg
                          className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        <p>No messages yet. Start the conversation!</p>
                      </div>
                    ) : (
                      <>
                        {messages.map((message) => (
                          <div
                            key={message._id}
                            className={`flex ${message.sender._id === session?.user?.id
                              ? "justify-end"
                              : "justify-start"
                              }`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.sender._id === session?.user?.id
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-foreground"
                                }`}
                            >
                              <div className="text-sm whitespace-pre-wrap break-words">
                                {message.content
                                  .split(/(https?:\/\/[^\s]+)/g)
                                  .map((part, index) => {
                                    if (part.match(/^https?:\/\/[^\s]+$/)) {
                                      return (
                                        <a
                                          key={index}
                                          href={part}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className={`${message.sender._id === session?.user?.id ? "text-primary-foreground underline hover:text-white" : "text-blue-500 hover:text-blue-600 underline"} break-all`}
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          {part}
                                        </a>
                                      );
                                    }
                                    return part;
                                  })}
                              </div>
                              <p
                                className={`text-xs mt-1 ${message.sender._id === session?.user?.id
                                  ? "text-primary-foreground/70"
                                  : "text-muted-foreground"
                                  }`}
                              >
                                {formatTime(message.createdAt)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-border bg-card z-10 sticky bottom-0 flex-shrink-0">
                    <div className="flex space-x-2 items-end">
                      <textarea
                        ref={textareaRef}
                        value={newMessage}
                        onChange={(e) => {
                          setNewMessage(e.target.value);
                          // Auto-resize textarea height
                          e.target.style.height = 'auto';
                          e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            sendMessageInConversation();
                            // Reset height
                            if (textareaRef.current) textareaRef.current.style.height = 'auto';
                          }
                        }}
                        placeholder="Type a message..."
                        rows={1}
                        className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background resize-none overflow-y-auto"
                        style={{ minHeight: '40px', maxHeight: '150px' }}
                      />
                      <button
                        onClick={() => {
                          sendMessageInConversation();
                          // Reset textarea height query
                          if (textareaRef.current) textareaRef.current.style.height = 'auto';
                        }}
                        disabled={!newMessage.trim()}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors h-10"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <svg
                      className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                    <p className="text-lg font-medium mb-2">
                      No conversation selected
                    </p>
                    <p className="text-sm">
                      {isAdmin
                        ? "Select a conversation or start a new one"
                        : "Your messages with Imran will appear here"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* New Message Modal - Different for Admin vs User */}
        {isNewMessageModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card p-6 rounded-lg w-full max-w-md mx-auto border border-border shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  {isAdmin ? "New Message" : "Message Imran"}
                </h3>
                <button
                  onClick={() => {
                    setIsNewMessageModalOpen(false);
                    setMessageContent("");
                    setSelectedUser(null);
                    setSearchTerm("");
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  ✕
                </button>
              </div>

              {isAdmin ? (
                // Admin: Search and select user
                <>
                  {!selectedUser ? (
                    <>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Search users
                        </label>
                        <input
                          type="text"
                          placeholder="Type name or email..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                          autoFocus
                        />
                      </div>

                      <div className="max-h-60 overflow-y-auto border border-border rounded-lg mb-4">
                        {users.length > 0 ? (
                          users.map((user) => (
                            <div
                              key={user._id}
                              className="p-3 border-b border-border last:border-b-0 hover:bg-accent cursor-pointer transition-colors"
                              onClick={() => setSelectedUser(user)}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                                  {user.image ? (
                                    <img
                                      src={user.image}
                                      alt={user.name}
                                      className="w-10 h-10 rounded-full"
                                    />
                                  ) : (
                                    <span className="text-primary-foreground font-semibold text-sm">
                                      {user.name?.charAt(0).toUpperCase()}
                                    </span>
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-medium text-foreground truncate">
                                    {user.name}
                                  </p>
                                  <p className="text-sm text-muted-foreground truncate">
                                    {user.email}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-6 text-center text-muted-foreground">
                            {searchTerm
                              ? "No users found"
                              : "Start typing to search users"}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          To
                        </label>
                        <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                              {selectedUser.image ? (
                                <img
                                  src={selectedUser.image}
                                  alt={selectedUser.name}
                                  className="w-8 h-8 rounded-full"
                                />
                              ) : (
                                <span className="text-primary-foreground text-sm font-semibold">
                                  {selectedUser.name?.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-foreground">
                                {selectedUser.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {selectedUser.email}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => setSelectedUser(null)}
                            className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                          >
                            Change
                          </button>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Message
                        </label>
                        <textarea
                          placeholder="Type your message..."
                          value={messageContent}
                          onChange={(e) => setMessageContent(e.target.value)}
                          className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background resize-none"
                          rows={4}
                          autoFocus
                        />
                      </div>
                    </>
                  )}
                </>
              ) : (
                // User: Direct message to admin
                <>
                  <div className="mb-4 p-3 bg-accent rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        {adminUser?.image ? (
                          <img
                            src={adminUser.image}
                            alt={adminUser.name}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <span className="text-primary-foreground font-semibold text-lg">
                            {adminUser?.name?.charAt(0).toUpperCase() || "A"}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {adminUser?.name || "Admin"}
                        </p>
                        <p className="text-sm text-muted-foreground">Admin</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Your Message
                    </label>
                    <textarea
                      placeholder="Type your message to Imran..."
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background resize-none"
                      rows={4}
                      autoFocus
                    />
                  </div>
                </>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setIsNewMessageModalOpen(false);
                    setMessageContent("");
                    setSelectedUser(null);
                    setSearchTerm("");
                  }}
                  className="flex-1 py-3 px-4 border border-border rounded-lg hover:bg-accent transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={isAdmin ? sendMessageAsAdmin : sendMessageToAdmin}
                  disabled={!messageContent.trim() || (isAdmin && !selectedUser)}
                  className="flex-1 bg-primary text-primary-foreground py-3 px-4 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isAdmin ? "Send Message" : "Send to Imran"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MessagesPage;
