
// "use client";

// import React, { useState, useEffect } from 'react';
// import Sidebar from '../../../components/form/sidebar'; 
// import styles from './ChatPage.module.css';
// import axiosInstance from '@/lib/axiosInstance';

// const ChatPage = () => {
//   const [messages, setMessages] = useState([]); // Toujours initialiser avec un tableau vide
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Fonction pour récupérer les messages existants depuis l'API
//   const fetchMessages = async () => {
//     try {
//       const res = await axiosInstance.get("/ai-chat" );
//       setMessages(res.data.aiChats); // Mettre à jour les messages
//     } catch (error) {
//       console.error("Error fetching chat history:", error);
//     }
//   };

//   // Appeler cette fonction lorsque le composant est monté
//   useEffect(() => {
//     fetchMessages();
//   }, []);

//   // Fonction pour envoyer un message à l'API
//   const handleSendMessage = async () => {
//     return()
//     if (!input.trim()) return;

//     try {
//       setLoading(true);
//       const res = await axiosInstance.post("/ai-chat", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           question: input,
//           answer: "Réponse générée par l'IA", // Placeholder pour la réponse
//         }),
//       });

//       if (res.ok) {
//         const newMessage = await res.json();
//         setMessages((prev) => [...prev, newMessage.aiChat]);
//         setInput(''); // Réinitialiser l'input
//       }
//     } catch (error) {
//       console.error("Error sending message:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={styles.container}>
//       {/* Sidebar avec l'historique */}
//       <Sidebar />

//       {/* Espace de chat */}
//       <div className={styles.chatArea}>
//         <div className={styles.chatBox}>
//           {/* Vérification avant d'afficher la liste des messages */}
//           {Array.isArray(messages) && messages.length > 0 ? (
//             messages.map((msg, index) => (
//               <div key={index} className={styles.message}>
//                 <strong>Question:</strong> {msg.question}
//                 <br />
//                 <strong>Réponse:</strong> {msg.answer}
//               </div>
//             ))
//           ) : (
//             <p>Aucun message disponible</p> // Message alternatif si pas de messages
//           )}
//         </div>

//         {/* Champ d'entrée pour taper un message */}
//         <div className={styles.inputArea}>
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Tapez votre message ici..."
//             className={styles.chatInput}
//           />
//           <button onClick={handleSendMessage} className={styles.sendButton} disabled={loading}>
//             {loading ? "Envoi..." : "Envoyer"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatPage;


"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/form/sidebar'; 
import styles from './ChatPage.module.css';
import axiosInstance from '@/lib/axiosInstance';

const ChatPage = () => {
  const [messages, setMessages] = useState([]); // Toujours initialiser avec un tableau vide
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Fonction pour récupérer les messages existants depuis l'API
  const fetchMessages = async () => {
    try {
      const res = await axiosInstance.get("/ai-chat");
      setMessages(res.data.aiChats); // Mettre à jour les messages
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  // Appeler cette fonction lorsque le composant est monté
  useEffect(() => {
    fetchMessages();
  }, []);

  // Fonction pour envoyer un message à l'API
  const handleSendMessage = async () => {
    if (!input.trim()) return; // Vérifie que l'entrée n'est pas vide

    try {
      setLoading(true);
      const res = await axiosInstance.post("/ai-chat", {
        question: input,
        answer: "Réponse générée par l'IA", // Placeholder pour la réponse
      });

      // Mettre à jour l'état avec le nouveau message
      if (res.status === 201) {
        const newMessage = res.data.aiChat;
        setMessages((prev) => [...prev, newMessage]);
        setInput(''); // Réinitialiser l'input après l'envoi du message
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Sidebar avec l'historique */}
      <Sidebar />

      {/* Espace de chat */}
      <div className={styles.chatArea}>
        <div className={styles.chatBox}>
          {/* Vérification avant d'afficher la liste des messages */}
          {Array.isArray(messages) && messages.length > 0 ? (
            messages.map((msg, index) => (
              <div key={index} className={styles.message}>
                <strong>Question:</strong> {msg.question}
                <br />
                <strong>Réponse:</strong> {msg.answer}
              </div>
            ))
          ) : (
            <p>Aucun message disponible</p> // Message alternatif si pas de messages
          )}
        </div>

        {/* Champ d'entrée pour taper un message */}
        <div className={styles.inputArea}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tapez votre message ici..."
            className={styles.chatInput}
          />
          <button onClick={handleSendMessage} className={styles.sendButton} disabled={loading}>
            {loading ? "Envoi..." : "Envoyer"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
