import React from "react";

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  className?: string;
  wrapperClassName?: string;
  rows?: number;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      error,
      className = "",
      wrapperClassName = "",
      rows = 4,
      ...props
    },
    ref
  ) => {
    return (
      <div className={`mb-4 ${wrapperClassName}`}>
        {label && (
          <label
            htmlFor={props.id || props.name}
            className="block mb-1 font-semibold text-gray-700 dark:text-gray-200"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          rows={rows}
          className={`
            w-full px-4 py-2 rounded-lg border 
            bg-white dark:bg-gray-900
            border-gray-300 dark:border-gray-700
            focus:outline-none focus:ring-2 focus:ring-blue-500
            transition
            text-gray-900 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            resize-none
            ${error ? "border-red-500 ring-red-400" : ""}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500 font-medium">{error}</p>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

export default TextArea;