import { FaHome, FaUser, FaCog } from 'react-icons/fa';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.iconContainer}>
        <FaHome size={30} />
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
