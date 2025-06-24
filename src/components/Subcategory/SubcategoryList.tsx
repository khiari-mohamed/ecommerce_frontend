import React from 'react';
import { SubCategory } from '../../types/subcategory';
import Link from 'next/link';

interface Props {
  subcategories: SubCategory[];
}

const SubcategoryList: React.FC<Props> = ({ subcategories }) => {
  if (!subcategories || subcategories.length === 0) return null;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Subcategories</h3>
      <ul className="space-y-2">
        {subcategories.map((sub) => (
          <li key={sub._id}>
            <Link
              href={`/subcategories/${sub.slug}`}
              className="text-blue-600 hover:underline"
            >
              {sub.name || sub.designation_fr || sub.designation}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubcategoryList;