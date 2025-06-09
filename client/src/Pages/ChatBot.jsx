// import bgImage from "../assets/AI-chatbot.webp";
// import React, { useState } from "react";
// import axios from "axios";
// import "../CSS/Chatbot.css"
// const ChatApp = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const userMessage = { sender: "user", text: input };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");

//     try {
//       const res = await axios.post("http://localhost:8080/c/chatbot", {
//         prompt: input,
//       });

//       const botMessage = { sender: "bot", text: res.data.reply };
//       setMessages((prev) => [...prev, botMessage]);
//     } catch (error) {
//       setMessages((prev) => [
//         ...prev,
//         { sender: "bot", text: "Error: Unable to get response" },
//       ]);
//     }
//   };

//   return (
//     <>
//       <div className="chat-box w-screen bg-[url('./assets/AI-chatbot.webp')] bg-no-repeat bg-cover bg-center max-h-screen "
//         // style={{ backgroundImage: `url('./assets/AI-chatbot.webp')` }}
//         >
//         {messages.map((msg, i) => (
//           <div key={i} className={`message ${msg.sender}`}>
//             {msg.sender === "user" ? "You" : "Bot"}: {msg.text}
//           </div>
//         ))}
//         <div className="input-area">
//           <input
//             type="text"
//             placeholder="Type something..."
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//           />
//           <button onClick={sendMessage}>Send</button>
//         </div>
//       </div>
      
//     </>
      
//   );
// };

// export default ChatApp;

import bgImage from "../assets/AI-chatbot.webp";
import React, { useState } from "react";
import axios from "axios";
import "../CSS/Chatbot.css";

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await axios.post("http://localhost:8080/c/chatbot", {
        prompt: input,
      });

      const botMessage = { sender: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error: Unable to get response" },
      ]);
    }
  };

  return (
    <div className="chat-box" style={{ 
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }}>
      <div className="messages-container">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>
            <strong>{msg.sender === "user" ? "You" : "Bot"}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          placeholder="Type something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatApp;