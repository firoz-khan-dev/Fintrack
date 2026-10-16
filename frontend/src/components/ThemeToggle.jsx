
import { useTheme } from "../context/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-5 right-5 z-[9999] flex h-12 w-12
        items-center justify-center rounded-full border border-gray-300
        bg-white text-gray-900 shadow-xl transition hover:scale-110
        dark:border-gray-600 dark:bg-[#202023] dark:text-yellow-300 cursor-pointer"
      aria-label="Toggle theme"
      title={theme === "dark" ? "Light Mode" : "Dark Mode"}
    >
      {theme === "dark" ? <FaSun size={20} /> : <FaMoon size={20} />}
    </button>
  );
}
