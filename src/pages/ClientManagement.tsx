import React from 'react';
import { useAppState } from '../store/useAppState';
import { Users, Plus, Send } from 'lucide-react';

const ClientManagement: React.FC = () => {
  const { clients } = useAppState();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
            <Users className="h-8 w-8 text-primary-accent" />
            <span class="px-4"> Client Management</span>
        </h1>
        <button className="py-2 px-4 rounded-lg bg-primary-accent hover:bg-blue-600 text-white font-semibold transition-colors flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Add New Client</span>
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Client List ({clients.length})</h2>
          <div className="space-y-3">
              {clients.map(client => (
                  <div key={client.id} className="p-4 border border-gray-200 dark:border-zinc-700 rounded-lg flex justify-between items-center">
                      <div>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">{client.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{client.email} | {client.phone}</p>
                          
                          {client.telegram && (
                            <div className="flex items-center space-x-1 mt-1 text-sm text-primary-accent">
                                <Send className="h-4 w-4" />
                                <a 
                                    href={`https://t.me/${client.telegram.replace('@', '')}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="hover:underline"
                                >
                                    {client.telegram}
                                </a>
                            </div>
                          )}
                      </div>
                      <button className="py-1 px-3 text-sm rounded-lg border border-primary-accent text-primary-accent hover:bg-primary-accent hover:text-white transition-colors">
                          View Details
                      </button>
                  </div>
              ))}
              {clients.length === 0 && <p className="text-gray-500 dark:text-gray-400">No clients added yet.</p>}
          </div>
      </div>
    </div>
  );
};

export default ClientManagement;