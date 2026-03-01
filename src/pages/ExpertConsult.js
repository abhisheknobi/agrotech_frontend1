import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../styles/ExpertConsult.css"; // Import custom CSS
import { BACKEND_URL } from '../config';

const ExpertConsult = () => {
  const [adminUsers, setAdminUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState(""); // State for the message input
  const [selectedFile, setSelectedFile] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchAdminUsers = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/auth/getAllAdminUsers`);
        setAdminUsers(response.data);
      } catch (error) {
        console.error("Error fetching admin users:", error);
      }
    };

    fetchAdminUsers();
  }, []);

  useEffect(() => {
    // Auto-scroll to the bottom when messages update
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleUserSelect = async (user) => {
    setSelectedUser(user);

    try {
      const response = await axios.get(`${BACKEND_URL}/api/auth/messages/${user._id}`);
      setMessages(response.data);

      await axios.post(`${BACKEND_URL}/api/auth/markMessagesAsSeen/${user._id}`);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]); // Reset messages if there's an error
    }
  };

  const handleSendMessage = async () => {
    if (!selectedUser || (!newMessage.trim() && !selectedFile)) return;
    let imageUrl = null;
    console.log(selectedFile);
    if (selectedFile) {
      imageUrl = await uploadImage(); // Upload and get the image URL
      if (!imageUrl) return; // Stop if upload failed
    }
    if (imageUrl != null) {
      try {
        const response = await axios.post(
          `${BACKEND_URL}/api/auth/sendMessage/${selectedUser._id}`,
          { receiverId: selectedUser._id, text: imageUrl, isImage: 1 }, // Correct payload
          { headers: { "Content-Type": "application/json" } }
        );

        setMessages((prevMessages) => [...prevMessages, response.data]); // Append new message
        setNewMessage(""); // Clear input
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
    else {
      try {
        const response = await axios.post(
          `${BACKEND_URL}/api/auth/sendMessage/${selectedUser._id}`,
          { receiverId: selectedUser._id, text: newMessage, isImage: 0 }, // Correct payload
          { headers: { "Content-Type": "application/json" } }
        );

        setMessages((prevMessages) => [...prevMessages, response.data]); // Append new message
        setNewMessage(""); // Clear input
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const uploadImage = async () => {
    if (!selectedFile) return null; // No file selected

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post("https://blob.yeka.pro/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        console.log(response.data.path);
        return response.data.path; // Return uploaded image URL
      } else {
        console.error("Image upload failed:", response.data.message);
        return null;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };


  return (
    <div className="chat-container">
      {/* Left Sidebar */}
      <div className="sidebar">
        {/* Search Bar */}
        <div className="search-bar">
          <input type="text" placeholder="Search" />
        </div>

        {/* Chat List */}
        <div className="chat-list">
          {adminUsers.length > 0 ? (
            adminUsers.map((user) => (
              <div
                key={user._id}
                className={`chat-item ${selectedUser?._id === user._id ? "active" : ""}`}
                onClick={() => handleUserSelect(user)}
              >
                <img src={require("../img/user.png")} alt="User" />
                <div className="chat-info">
                  <h4>{user.name}</h4>
                  <p>{user.email}</p>
                </div>
                {user.unseenCount > 0 && (
                  <span className="badge">{user.unseenCount}</span> // Display badge if unseen messages exist
                )}
              </div>
            ))
          ) : (
            <p>No admin users found</p>
          )}
        </div>
      </div>

      {/* Right Chat Window */}
      <div className="chat-window-wrapper">
      <div className="chat-window">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="chat-header">
             
              <h4>{selectedUser.name}</h4>
            </div>

            {/* Chat Messages */}
            <div className="chat-messages">
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`message ${msg.ReceivedBy === selectedUser._id ? "received" : "sent"}`}
                  >
                    {msg.isImage === 1 ? (
                      <img src={msg.meassage} alt="Uploaded" className="chat-image" />
                    ) : (
                      msg.meassage
                    )}
                  </div>
                ))
              ) : (
                <p>No messages yet</p>
              )}
              <div ref={messagesEndRef} />
            </div>



            {/* Message Input */}
            <div className="message-input">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />

              <button onClick={handleSendMessage}>Send</button>
            </div>
          </>
        ) : (
          <p className="no-chat-selected">Select a user to start chatting</p>
        )}
      </div>
      </div>
    </div>
  );
};

export default ExpertConsult;
