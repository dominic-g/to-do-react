import ThemeToggle from '../ThemeToggle'; 
// import SearchInput from '../SearchInput';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => { // <--- Receive props
  return (
    <header className="w-full h-16 bg-white dark:bg-zinc-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-zinc-700 flex items-center justify-between p-4 sticky top-0 z-10">
      
      <button 
          onClick={toggleSidebar} 
          className="p-2 rounded-lg lg:hidden text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700"
          aria-label="Toggle Menu"
      >
          {/* Hamburger Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
      </button>


      {/* App Name/Logo */}
      <div className="flex items-center space-x-4">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">TaskFlow Pro</span>
      </div>

      {/* Task Filter/Search */}
      <div className="w-full max-w-96 hidden sm:block">
        <input 
            type="text" 
            placeholder="Search tasks or projects..." 
            className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-primary-accent focus:border-primary-accent transition-colors"
        />
      </div>

      {/* Theme Toggle */}
      <ThemeToggle />
    </header>
  );
};

export default Header;