/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { FormEvent } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (e: FormEvent) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, onSubmit, placeholder = "Cari resep makanan..." }: SearchBarProps) {
  
  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <form 
      onSubmit={handleFormSubmit} 
      className="w-full max-w-2xl mx-auto"
      id="search-bar-form"
    >
      <div className="relative group/search" id="search-input-container">
        
        {/* Search icon */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within/search:text-amber-500 transition-colors">
          <Search className="h-5 w-5" />
        </div>

        {/* Input element */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-24 py-3 bg-[#1F1F22] border border-gray-700 rounded-full focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 font-sans text-sm text-gray-100 placeholder-gray-500 transition-all duration-300"
          id="search-input-field"
        />

        {/* Action Button inside input */}
        <button
          type="submit"
          className="absolute right-1.5 top-1.5 bottom-1.5 bg-amber-500 hover:bg-amber-400 text-black font-sans font-bold text-xs px-5 rounded-full transition-all duration-300"
          id="search-submit-btn"
        >
          Cari
        </button>

      </div>
    </form>
  );
}
