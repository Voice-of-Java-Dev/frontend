
interface TagBadgeProps {
  tag: string;
  onClick?: () => void;
  variant?: 'default' | 'selected';
}

const TagBadge = ({ tag, onClick, variant = 'default' }: TagBadgeProps) => {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-200";
  const variantClasses = {
    default: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600",
    selected: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700"
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${onClick ? 'cursor-pointer' : ''}`;
  
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={classes}
      >
        {tag}
      </button>
    );
  }
  
  return (
    <span className={classes}>
      {tag}
    </span>
  );
};

export default TagBadge;
