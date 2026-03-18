'use client'

import { useState } from 'react';
import Image from 'next/image';
import filterIcon from '@/images/icons/filter-icon.svg';
import './category-filter.css';

export type Category = 'Tecnología' | 'Gaming' | 'Hogar' | 'Moda';

interface CategoryFilterComponentProps {
    selectedCategory?: Category;
    onCategoryChange?: (category: Category) => void;
    onFilterClick?: () => void;
}

const CategoryFilterComponent = (props: CategoryFilterComponentProps) => {
    const { selectedCategory, onCategoryChange, onFilterClick } = props;
    
    const categories: Category[] = ['Tecnología', 'Gaming', 'Hogar', 'Moda'];
    const [currentCategory, setCurrentCategory] = useState<Category | undefined>(selectedCategory || 'Tecnología');

    const handleCategoryClick = (category: Category) => {
        setCurrentCategory(category);
        onCategoryChange?.(category);
    };

    return (
        <div className="category-filter-container">
            <div className="category-filter-title">Destacadas</div>
            <div className="category-filter-row">
                <button 
                    className="category-filter-button"
                    onClick={onFilterClick}
                >
                    <Image 
                        src={filterIcon} 
                        alt="Filter" 
                        width={16} 
                        height={16}
                    />
                </button>
                {categories.map((category) => (
                    <button
                        key={category}
                        className={`category-button ${currentCategory === category ? 'selected' : ''}`}
                        onClick={() => handleCategoryClick(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryFilterComponent;

