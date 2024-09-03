"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axiosInstance';
import { Spinner } from "@nextui-org/spinner";

const statusOptions = [
  { value: 'OPEN', label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
];

const HelpRequestPage = ({ params }) => {
  const router = useRouter();
  const { id } = params;
  const [helpRequest, setHelpRequest] = useState(null);
  const [status, setStatus] = useState('OPEN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchHelpRequest();
    }
  }, [id]);

  const fetchHelpRequest = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/helper-request/${id}`);
      setHelpRequest(response.data.helpRequest);
      setStatus(response.data.helpRequest.status);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Unauthorized: Please log in.');
      } else {
        setError('Error fetching help request');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await axiosInstance.put(`/helper-request/${id}`, { status });
      fetchHelpRequest(); // Refresh data after update
    } catch (error) {
      setError('Error updating help request');
    } finally {
      setLoading(false);
    }
  };

 
  const handleDelete = async () => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/helper-request/${id}`);
      router.push('/success'); // Redirect after deletion
    } catch (error) {
      setError('Error deleting help request');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><Spinner size="lg" /></div>;
  if (error) return <div className="text-red-500 text-center mt-4">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
      <h1 className="text-2xl font-bold mb-6">Help Request Details</h1>
      {helpRequest ? (
        <div>
          <div className="mb-4">
            <p className="text-gray-700"><strong>Subject:</strong> {helpRequest.subject}</p>
            <p className="text-gray-700"><strong>Status:</strong> {helpRequest.status}</p>
            <p className="text-gray-700"><strong>Helper ID:</strong> {helpRequest.helperId || 'None'}</p>
          </div>

          <div className="relative mb-6">
            <label htmlFor="status" className="block text-gray-700 font-semibold mb-2">Update Status:</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-full cursor-pointer rounded-md bg-white py-2 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-300"
              >
                <span className="block truncate">{statusOptions.find(option => option.value === status)?.label || 'Select status'}</span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clipRule="evenodd" />
                  </svg>
                </span>
              </button>

              {isOpen && (
                <ul className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5">
                  {statusOptions.map((option) => (
                    <li
                      key={option.value}
                      onClick={() => {
                        setStatus(option.value);
                        setIsOpen(false);
                      }}
                      className={`relative cursor-pointer select-none py-2 pl-3 pr-9 text-gray-900 ${status === option.value ? 'bg-primary-300 text-white' : ''}`}
                    >
                      <div className="flex items-center">
                        <span className="ml-3 block truncate">{option.label}</span>
                      </div>
                      {status === option.value && (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-primary-300">
                          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              onClick={handleUpdate}
              className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
            >
              Update Status
            </button>
          </div>
          <button
            onClick={handleDelete}
            className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200"
          >
            Delete Request
          </button>
        </div>
      ) : (
        <p className="text-gray-500">Help request not found</p>
      )}
    </div>
  );
};

export default HelpRequestPage;
