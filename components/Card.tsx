
import React, { ReactNode } from 'react';

interface CardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, icon, children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-slate-900/50 p-6 flex flex-col border border-transparent dark:border-slate-700 transition-colors duration-300 ${className}`}>
      <div className="flex items-center mb-4">
        <div className="text-brand-primary mr-3">{icon}</div>
        <h2 className="text-xl font-bold text-brand-dark dark:text-slate-100">{title}</h2>
      </div>
      <div className="flex-grow">
        {children}
      </div>
    </div>
  );
};

export default Card;
