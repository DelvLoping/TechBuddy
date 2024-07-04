// pages/help.js

import { useState } from 'react';

export default function Help() {
  const [selectedExample, setSelectedExample] = useState('');

  const handleSelectChange = (e) => {
    setSelectedExample(e.target.value);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Demande d'aide</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="example">
              Exemple de demande d'aide
            </label>
            <select
              id="example"
              value={selectedExample}
              onChange={handleSelectChange}
              className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="" disabled>Choisissez un exemple</option>
              <option value="Problème de connexion">Problème de connexion</option>
              <option value="Erreur de paiement">Erreur de paiement</option>
              <option value="Demande de remboursement">Demande de remboursement</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Envoyer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
