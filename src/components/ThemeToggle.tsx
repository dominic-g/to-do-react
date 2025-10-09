import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react'; 

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full transition-colors duration-300 shadow-xl 
                 bg-gray-200 dark:bg-zinc-700 
                 text-gray-800 dark:text-gray-100 
                 hover:bg-gray-300 dark:hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary-accent"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        // Sun Icon (when current is Dark, suggests Light mode)
        <Sun className="h-6 w-6" />
      ) : (
        // Moon Icon (when current is Light, suggests Dark mode)
        <Moon className="h-6 w-6" />
      )}
    </button>
  );
};

export default ThemeToggle;