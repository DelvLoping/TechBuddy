// import { FaHome, FaUser, FaCog } from 'react-icons/fa';
// import { useEffect, useState } from 'react';
// import styles from './Sidebar.module.css'; // Utiliser CSS module pour les styles

// const Sidebar = () => {
//   const [chatHistory, setChatHistory] = useState<string[]>([]);

//   // Récupérer l'historique des discussions depuis le localStorage
//   useEffect(() => {
//     const storedHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
//     setChatHistory(storedHistory);
//   }, []);

//   return (
//     <div className={styles.sidebar}>
//       <div className={styles.iconContainer}>
//         <FaHome size={30} />
//       </div>
      
//       {/* Historique des discussions */}
//       <div className={styles.historyContainer}>
//         <h4>Historique des discussions</h4>
//         <ul className={styles.historyList}>
//           {chatHistory.map((historyItem, index) => (
//             <li key={index} className={styles.historyItem}>
//               <a href="#" onClick={() => alert(`Charger la discussion : ${historyItem}`)}>
//                 {historyItem}
//               </a>
//             </li>
//           ))}
//         </ul>
//       </div>

//       <ul className={styles.menu}>
//         <li>
//           <a href="#">
//             <FaUser className={styles.icon} /> Profile
//           </a>
//         </li>
//         <li>
//           <a href="#">
//             <FaCog className={styles.icon} /> Settings
//           </a>
//         </li>
//       </ul>
//     </div>
//   );
// };

// export default Sidebar;


import { FaHome, FaUser, FaCog } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const [chatHistory, setChatHistory] = useState<string[]>([]);

  // Récupérer l'historique des discussions depuis localStorage
  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    setChatHistory(storedHistory);
  }, []);

  return (
    <div className={styles.sidebar}>
      <div className={styles.iconContainer}>
        <FaHome size={30} />
      </div>

      {/* Historique des discussions */}
      <div className={styles.historyContainer}>
        <h4>Historique des discussions</h4>
        <ul className={styles.historyList}>
          {chatHistory.map((historyItem, index) => (
            <li key={index} className={styles.historyItem}>
              <a href="#">
                {historyItem}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <ul className={styles.menu}>
        <li>
          <a href="#">
            <FaUser className={styles.icon} /> Profile
          </a>
        </li>
        <li>
          <a href="#">
            <FaCog className={styles.icon} /> Settings
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
