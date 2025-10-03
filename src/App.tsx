
import ThemeToggle from './components/ThemeToggle';

function App() {
  return (
    <div className="min-h-screen w-screen p-12 flex flex-col items-center justify-start 
                    
                    bg-white dark:bg-zinc-900 
                    text-gray-900 dark:text-gray-100
                    
                    transition-colors duration-300">
      
      <header className="w-full max-w-7xl flex justify-between items-center py-4 px-6 border-b border-gray-200 dark:border-zinc-700">
        <h1 className="text-3xl font-bold">TaskFlow Pro</h1>
        <ThemeToggle />
      </header>
      
      <main className="flex-grow flex items-center justify-center p-8">
        <div className="text-center">
            <p className="text-xl font-medium mb-4">Foundation Complete.</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Next: Implementing the Zustand Store for Data Management.</p>
        </div>
      </main>
      
    </div>
  );
}

export default App;