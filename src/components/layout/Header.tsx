import ThemeToggle from '../ThemeToggle'; 
// import SearchInput from '../SearchInput';

const Header: React.FC = () => {
  return (
    <header className="w-full h-16 bg-white dark:bg-zinc-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-zinc-700 flex items-center justify-between p-4 sticky top-0 z-10">
      
      {/* App Name/Logo */}
      <div className="flex items-center space-x-4">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">TaskFlow Pro</span>
      </div>

      {/* Task Filter/Search (REMOVED IMPORT, USING INLINE INPUT) */}
      <div className="w-96">
        <input 
            type="text" 
            placeholder="Search tasks or projects..." 
            // Tailwind classes for a sleek, themed search box
            className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-primary-accent focus:border-primary-accent transition-colors"
        />
      </div>

      {/* Theme Toggle */}
      <ThemeToggle />
    </header>
  );
};

export default Header;