import React, { useState } from 'react';
import { Goal } from '../types';
import Card from './Card';
import { TargetIcon } from './icons';
import { TranslationKey } from '../i18n';

interface GoalsProps {
  dailyGoals: Goal[];
  monthlyGoals: Goal[];
  onAddGoal: (type: 'daily' | 'monthly', text: string) => void;
  onToggleGoal: (type: 'daily' | 'monthly', id: string) => void;
  onDeleteGoal: (type: 'daily' | 'monthly', id: string) => void;
  t: (key: TranslationKey) => string;
}

const GoalList: React.FC<{
  goals: Goal[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ goals, onToggle, onDelete }) => (
  <ul className="space-y-2">
    {goals.map((goal) => (
      <li key={goal.id} className="flex items-center justify-between group bg-slate-50 dark:bg-slate-800 p-2 rounded-md transition-colors">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={goal.completed}
            onChange={() => onToggle(goal.id)}
            className="h-5 w-5 rounded border-gray-300 dark:border-slate-600 text-brand-primary focus:ring-brand-primary dark:bg-slate-700"
          />
          <span className={`ml-3 text-slate-700 dark:text-slate-200 ${goal.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
            {goal.text}
          </span>
        </div>
        <button
          onClick={() => onDelete(goal.id)}
          className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </li>
    ))}
  </ul>
);

const AddGoalForm: React.FC<{
  onAdd: (text: string) => void;
  placeholder: string;
  addLabel: string;
}> = ({ onAdd, placeholder, addLabel }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim());
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2 mt-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        className="flex-grow p-2 border dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md focus:ring-brand-primary focus:border-brand-primary"
      />
      <button type="submit" className="bg-brand-secondary text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition-colors">
        {addLabel}
      </button>
    </form>
  );
};


const Goals: React.FC<GoalsProps> = ({ dailyGoals, monthlyGoals, onAddGoal, onToggleGoal, onDeleteGoal, t }) => {
  return (
    <Card title={t('myGoals')} icon={<TargetIcon className="w-7 h-7" />}>
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-brand-dark dark:text-slate-100 mb-2">{t('todaysGoals')}</h3>
          <GoalList
            goals={dailyGoals}
            onToggle={(id) => onToggleGoal('daily', id)}
            onDelete={(id) => onDeleteGoal('daily', id)}
          />
          <AddGoalForm onAdd={(text) => onAddGoal('daily', text)} placeholder={t('dailyGoalPlaceholder')} addLabel={t('add')} />
        </div>
        <div>
          <h3 className="font-semibold text-brand-dark dark:text-slate-100 mb-2">{t('thisMonthsGoals')}</h3>
          <GoalList
            goals={monthlyGoals}
            onToggle={(id) => onToggleGoal('monthly', id)}
            onDelete={(id) => onDeleteGoal('monthly', id)}
          />
          <AddGoalForm onAdd={(text) => onAddGoal('monthly', text)} placeholder={t('monthlyGoalPlaceholder')} addLabel={t('add')} />
        </div>
      </div>
    </Card>
  );
};

export default Goals;
