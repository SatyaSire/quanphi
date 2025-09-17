import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

export interface KPICardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  };
  icon?: React.ComponentType<{ className?: string }>;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  loading = false,
  onClick,
  className = '',
}) => {
  const isClickable = !!onClick;

  const cardContent = (
    <>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 truncate">{title}</p>
          {loading ? (
            <div className="mt-1 h-8 bg-gray-200 rounded animate-pulse"></div>
          ) : (
            <p className="mt-1 text-3xl font-semibold text-gray-900">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
          )}
        </div>
        {Icon && (
          <div className="flex-shrink-0">
            <Icon className="h-8 w-8 text-gray-400" />
          </div>
        )}
      </div>
      
      {change && !loading && (
        <div className="mt-4 flex items-center">
          <div
            className={`flex items-center text-sm font-medium ${
              change.type === 'increase'
                ? 'text-green-600'
                : 'text-red-600'
            }`}
          >
            {change.type === 'increase' ? (
              <ArrowUpIcon className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 mr-1" />
            )}
            {Math.abs(change.value)}%
          </div>
          <span className="ml-2 text-sm text-gray-500">
            from {change.period}
          </span>
        </div>
      )}
      
      {loading && change && (
        <div className="mt-4 h-4 bg-gray-200 rounded animate-pulse"></div>
      )}
    </>
  );

  if (isClickable) {
    return (
      <button
        onClick={onClick}
        className={`w-full text-left bg-white overflow-hidden shadow rounded-lg p-6 hover:shadow-md transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${className}`}
      >
        {cardContent}
      </button>
    );
  }

  return (
    <div
      className={`bg-white overflow-hidden shadow rounded-lg p-6 ${className}`}
    >
      {cardContent}
    </div>
  );
};

export default KPICard;