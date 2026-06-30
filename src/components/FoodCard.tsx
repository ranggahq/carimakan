/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Eye, ShoppingCart, Globe, Tag, Check } from 'lucide-react';
import { Meal } from '../types';
import { useCart } from '../context/CartContext';
import { translateCategory, translateArea, getMealPrice, formatPrice } from '../utils';

interface FoodCardProps {
  meal: Meal;
  key?: string | number;
}

export default function FoodCard({ meal }: FoodCardProps) {
  const { addToCart } = useCart();
  const [addingState, setAddingState] = useState<boolean>(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setAddingState(true);
      await addToCart({
        mealId: meal.id,
        name: meal.name,
        thumbnail: meal.thumbnail,
        category: meal.category,
        area: meal.area
      });
      // Simple duration for showing success check icon
      setTimeout(() => {
        setAddingState(false);
      }, 1500);
    } catch {
      setAddingState(false);
    }
  };

  const indonesianCategory = translateCategory(meal.category);
  const indonesianArea = translateArea(meal.area, meal.name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4 }}
      className="bg-[#161618] rounded-2xl border border-gray-850 overflow-hidden shadow-lg hover:border-amber-500/55 transition-all duration-300 flex flex-col h-full group"
      id={`food-card-${meal.id}`}
    >
      
      {/* Food Thumbnail Area */}
      <Link to={`/detail/${meal.id}`} state={{ meal }} className="relative block overflow-hidden aspect-video bg-gray-900" id={`pic-link-${meal.id}`}>
        <img
          src={meal.thumbnail}
          alt={meal.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
          loading="lazy"
          id={`pic-img-${meal.id}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <span className="text-amber-500 text-xs font-sans font-bold flex items-center space-x-1">
            <Eye className="h-4 w-4" />
            <span>Lihat Detail Makanan</span>
          </span>
        </div>
      </Link>

      {/* Food Primary Metadata */}
      <div className="p-5 flex-1 flex flex-col justify-between" id={`meta-area-${meal.id}`}>
        
        <div className="space-y-2.5">
          {/* Badge List */}
          <div className="flex flex-wrap gap-1.5" id={`badge-grid-${meal.id}`}>
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-500/10 text-xxs font-sans font-medium text-amber-400 border border-amber-500/20">
              <Tag className="h-3 w-3" />
              <span>{indonesianCategory}</span>
            </span>
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-gray-800 text-xxs font-sans font-medium text-gray-300 border border-gray-700">
              <Globe className="h-3 w-3" />
              <span>{indonesianArea}</span>
            </span>
          </div>

          {/* Title */}
          <Link to={`/detail/${meal.id}`} state={{ meal }} className="block" id={`title-link-${meal.id}`}>
            <h3 className="font-sans font-bold text-white text-base leading-snug tracking-tight hover:text-amber-500 transition-colors line-clamp-2">
              {meal.name}
            </h3>
          </Link>

          {/* Price */}
          <div className="pt-1 text-amber-500 font-sans font-bold text-sm" id={`price-${meal.id}`}>
            {formatPrice(getMealPrice(meal.category))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 pt-4 border-t border-gray-850 flex items-center gap-2" id={`bottom-action-${meal.id}`}>
          {/* Detail Button */}
          <Link
            to={`/detail/${meal.id}`}
            state={{ meal }}
            className="flex-1 text-center bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white border border-gray-700 font-sans font-bold text-[11px] py-2.5 rounded-xl transition-all duration-300"
            id={`detail-btn-${meal.id}`}
          >
            Detail
          </Link>

          {/* Add Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={addingState}
            className={`cursor-pointer flex-1 py-2.5 rounded-xl font-sans font-bold text-[11px] flex items-center justify-center space-x-1.5 transition-all duration-300 ${
              addingState 
                ? 'bg-green-500 text-black' 
                : 'bg-amber-500 hover:bg-amber-400 text-black'
            }`}
            id={`buy-btn-${meal.id}`}
          >
            {addingState ? (
              <>
                <Check className="h-3.5 w-3.5 animate-scaleCheck" />
                <span>Dipilih!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-3.5 w-3.5" />
                <span>+ Keranjang</span>
              </>
            )}
          </button>
        </div>

      </div>

    </motion.div>
  );
}
