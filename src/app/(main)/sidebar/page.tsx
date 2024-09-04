import Sidebar from '../../../components/form/sidebar';

const HomePage = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '250px', padding: '20px', width: '100%' }}>
        <h1 style={{color: 'Red', padding: '20px'}}>Contenu principal</h1>
        <p>Ceci est le contenu principal de la page.</p>
      </div>
    </div>
  );
};

export default HomePage;
