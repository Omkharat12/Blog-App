import { useSelector } from 'react-redux';

export default function ThemeProvider({ children }) {
    const { theme } = useSelector((state) => state.theme);

    return (
        <div className={theme}>
            <div className="min-h-screen bg-white text-gray-700 dark:bg-[#10172A] dark:text-gray-200">
                {children}
            </div>
        </div>
    );
}
