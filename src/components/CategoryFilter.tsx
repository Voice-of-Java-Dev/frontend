import TagBadge from './TagBadge';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  // ✅ Prevent duplicate 'All'
  const allCategories = ['All', ...categories.filter((cat) => cat !== 'All')];

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Filter by:</span>
      {allCategories.map((category) => (
        <TagBadge
          key={category}
          tag={category}
          variant={selectedCategory === category ? 'selected' : 'default'}
          onClick={() => onCategoryChange(category)}
        />
      ))}
    </div>
  );
};

export default CategoryFilter;
