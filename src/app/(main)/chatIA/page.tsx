// "use client"; // Ajoutez cette ligne pour indiquer que c'est un Client Component

// import React, { useState } from 'react';
// import Sidebar from '../../../components/form/sidebar'; // Assurez-vous que votre Sidebar est bien importée
// import styles from './ChatPage.module.css';

// const ChatPage = () => {
//   const [messages, setMessages] = useState([]); // Stocke les messages
//   const [input, setInput] = useState(''); // Stocke la valeur de l'input

//   // Fonction pour gérer l'envoi du message
//   const handleSendMessage = () => {
//     if (input.trim() !== '') {
//       setMessages([...messages, input]); // Ajoute le nouveau message à la liste
//       setInput(''); // Réinitialise le champ d'entrée
//     }
//   };

//   return (
//     <div className={styles.container}>
//       {/* Sidebar sur la gauche */}
//       <Sidebar />

//       {/* Espace de chat */}
//       <div className={styles.chatArea}>
//         <div className={styles.chatBox}>
//           {/* Affiche la liste des messages */}
//           {messages.map((msg, index) => (
//             <div key={index} className={styles.message}>
//               {msg}
//             </div>
//           ))}
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
//           <button onClick={handleSendMessage} className={styles.sendButton}>
//             Envoyer
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

const ChatPage = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

  // Ajouter un message et sauvegarder l'historique
  const handleSendMessage = () => {
    if (input.trim() !== '') {
      const newMessages = [...messages, input];
      setMessages(newMessages);
      setInput('');

      // Sauvegarder l'historique dans le localStorage
      localStorage.setItem('chatHistory', JSON.stringify(newMessages));
    }
  };

  return (
    <div className={styles.container}>
      {/* Sidebar avec l'historique */}
      <Sidebar />

      {/* Espace de chat */}
      <div className={styles.chatArea}>
        <div className={styles.chatBox}>
          {/* Affiche la liste des messages */}
          {messages.map((msg, index) => (
            <div key={index} className={styles.message}>
              {msg}
            </div>
          ))}
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
          <button onClick={handleSendMessage} className={styles.sendButton}>
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
