import { useState } from "react";
import { LANGUAGE_VERSIONS } from "../constants";

const languages = Object.entries(LANGUAGE_VERSIONS);

const LanguageSelector = ({ language, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (lang) => {
    onSelect(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left ml-2 mb-4">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-900 text-sm font-medium text-gray-100 hover:bg-gray-700"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={handleToggle}
          style={{ color: language ? 'rgb(96 165 250 / var(--tw-text-opacity))' : '' }}
        >
          {language}
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06 0L10 10.92l3.71-3.71a.75.75 0 011.06 1.06l-4 4a.75.75 0 01-1.06 0l-4-4a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-900 ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex="-1"
        >
          <div className="py-1" role="none">
            {languages.map(([lang, version]) => (
              <button
                key={lang}
                className="text-gray-100 block px-4 py-2 text-sm w-full text-left bg-gray-900 hover:bg-gray-700"
                role="menuitem"
                tabIndex="-1"
                onClick={() => handleSelect(lang)}
                style={{
                  backgroundColor: lang === language ? "gray.700" : "gray.900",
                  color: lang === language ? "rgb(96 165 250 / var(--tw-text-opacity))" : "rgb(156 163 175 / var(--tw-text-opacity))",
                }}
              >
                {lang}
                <span className="text-gray-400 text-sm"> ({version})</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
