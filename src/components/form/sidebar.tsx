import { useEffect, useState } from 'react';
import styles from './Sidebar.module.css';
import axiosInstance from '@/lib/axiosInstance'; // Importation de l'instance Axios

const Sidebar = () => {
  const [chatHistory, setChatHistory] = useState([]); // Toujours initialiser avec un tableau vide

  // Récupérer l'historique des messages depuis l'API
  const fetchChatHistory = async () => {
    try {
      const res = await axiosInstance.get("/ai-chat");
      setChatHistory(res.data.aiChats || []); // Assurez-vous de toujours avoir un tableau
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, []);

  return (
    <div className={styles.sidebar}>
      <div className={styles.iconContainer}>
        <h4>Historique des discussions</h4>
        <ul className={styles.historyList}>
          {/* Vérification avant d'utiliser .map() */}
          {Array.isArray(chatHistory) && chatHistory.length > 0 ? (
            chatHistory.map((chat, index) => (
              <li key={index} className={styles.historyItem}>
                <a href="#">Question: {chat.question}</a>
              </li>
            ))
          ) : (
            <p>Aucun historique disponible</p> // Message alternatif si pas d'historique
          )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;


