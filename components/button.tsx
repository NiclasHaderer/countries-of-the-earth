import { FC, ReactNode } from "react";

export const Button: FC<{ children?: ReactNode | undefined; onClick: () => void }> = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-slate-900 hover:bg-slate-700 text-white font-semibold h-10 shadow-2xl px-4 rounded-lg w-full flex items-center justify-center 
      sm:w-auto dark:bg-sky-500 dark:highlight-white/20 dark:hover:bg-sky-400`}
    >
      {children}
    </button>
  );
};
