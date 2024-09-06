// "use client";

// import React, { useState, useEffect } from 'react';
// import Sidebar from '../../../components/form/sidebar'; 
// import styles from './ChatPage.module.css';
// import axiosInstance from '@/lib/axiosInstance';

// const ChatPage = () => {
//   const [messages, setMessages] = useState([]); // Stocke les messages
//   const [input, setInput] = useState(''); // Stocke l'entrée de l'utilisateur
//   const [loading, setLoading] = useState(false); // Gère l'état de chargement
//   const userId = 1; // ID de l'utilisateur, à adapter en fonction de la logique de votre app

//   // Fonction pour récupérer les chats et leurs messages associés
//   const fetchMessages = async () => {
//     try {
//       // Récupérer la liste des chats de l'utilisateur
//       const resChats = await axiosInstance.get(`/ai-chat`);
//       const aiChats = resChats.data.aiChats;
      
//       let allMessages = [];

//       // Récupérer les messages pour chaque chat
//       for (const chat of aiChats) {
//         const resMessages = await axiosInstance.get(`/ai-chat/${chat.id}/messages`);
//         const chatMessages = resMessages.data.messages;

//         // Ajouter les messages de ce chat dans la liste complète des messages
//         allMessages.push(...chatMessages);
//       }

//       // Mettre à jour l'état avec tous les messages récupérés
//       setMessages(allMessages);
//     } catch (error) {
//       console.error("Erreur lors de la récupération des messages :", error);
//     }
//   };

//   // Appeler cette fonction lorsque le composant est monté
//   useEffect(() => {
//     fetchMessages();
//   }, []);

//   // Fonction pour envoyer un message à l'API
//   const handleSendMessage = async () => {
//     if (!input.trim()) return; // Ne pas envoyer de message vide

//     try {
//       setLoading(true);

//       // Envoyer la question et la réponse simulée à l'API
//       const res = await axiosInstance.post("/ai-chat", {
//         question: input,
//         answer: "Réponse générée par l'IA", // Placeholder pour la réponse IA
//       });

//       const newMessage = {
//         sender: 'USER',
//         content: input,
//       };

//       const aiResponseMessage = {
//         sender: 'AI',
//         content: "Réponse générée par l'IA", // Placeholder pour la réponse
//       };

//       // Met à jour l'état avec les nouveaux messages (utilisateur et IA)
//       setMessages((prev) => [...prev, newMessage, aiResponseMessage]);

//       setInput(''); // Réinitialiser l'input après l'envoi
//     } catch (error) {
//       console.error("Erreur lors de l'envoi du message :", error);
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
//                 <strong>{msg.sender === 'USER' ? 'Vous' : 'IA'} :</strong> {msg.content}
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
  const [messages, setMessages] = useState([]); // Stocke les messages
  const [input, setInput] = useState(''); // Stocke l'entrée de l'utilisateur
  const [loading, setLoading] = useState(false); // Gère l'état de chargement
  const userId = 1; // ID de l'utilisateur, à adapter en fonction de la logique de votre app

  // Fonction pour récupérer les chats et leurs messages associés
  const fetchMessages = async () => {
    try {
      // Récupérer la liste des chats de l'utilisateur
      const resChats = await axiosInstance.get(`/ai-chat`);
      const aiChats = resChats.data.aiChats;
      
      let allMessages = [];

      // Récupérer les messages pour chaque chat
      for (const chat of aiChats) {
        const resMessages = await axiosInstance.get(`/ai-chat/${chat.id}/messages`);
        const chatMessages = resMessages.data.messages;

        // Ajouter les messages de ce chat dans la liste complète des messages
        allMessages.push(...chatMessages);
      }

      // Mettre à jour l'état avec tous les messages récupérés
      setMessages(allMessages);
    } catch (error) {
      console.error("Erreur lors de la récupération des messages :", error);
    }
  };

  // Appeler cette fonction lorsque le composant est monté
  useEffect(() => {
    fetchMessages();
  }, []);

  // Fonction pour envoyer un message à l'API
  const handleSendMessage = async () => {
    if (!input.trim()) return; // Ne pas envoyer de message vide

    try {
      setLoading(true);

      // Envoyer la question et la réponse simulée à l'API
      const res = await axiosInstance.post("/ai-chat", {
        question: input,
        answer: "Réponse générée par l'IA", // Placeholder pour la réponse IA
      });

      const newMessage = {
        sender: 'USER',
        content: input,
      };

      const aiResponseMessage = {
        sender: 'AI',
        content: "Réponse générée par l'IA", // Placeholder pour la réponse
      };

      // Met à jour l'état avec les nouveaux messages (utilisateur et IA)
      setMessages((prev) => [...prev, newMessage, aiResponseMessage]);

      setInput(''); // Réinitialiser l'input après l'envoi
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
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
              <div
                key={index}
                className={`${styles.message} ${msg.sender === 'USER' ? styles.user : styles.ai}`}
              >
                <strong>{msg.sender === 'USER' ? 'Vous' : 'IA'} :</strong> {msg.content}
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

