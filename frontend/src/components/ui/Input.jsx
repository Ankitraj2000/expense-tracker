import { forwardRef } from 'react';

/**
 * Reusable Input component with label, error, and icon support.
 */
const Input = forwardRef(function Input(
  { label, error, icon: Icon, className = '', id, ...props },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
            <Icon size={16} />
          </div>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`input-base ${Icon ? 'pl-9' : ''} ${
            error ? 'border-red-400 dark:border-red-500 focus:ring-red-400' : ''
          } ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400 animate-fade-in">{error}</p>
      )}
    </div>
  );
});

export default Input;
