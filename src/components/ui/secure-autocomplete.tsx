
import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from './input';
import { useTenant } from '@/contexts/TenantContext';
import { sanitizeInput } from '@/utils/sanitize';
import { handleApiError } from '@/utils/errorHandler';

interface SecureAutocompleteProps {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  table: string;
  column: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  minChars?: number;
  limit?: number;
  filterByBusinessId?: boolean;
  filterField?: string;
}

export const SecureAutocomplete = ({
  id,
  name,
  label,
  placeholder,
  table,
  column,
  value,
  onChange,
  disabled = false,
  required = false,
  className = "",
  minChars = 3,
  limit = 5,
  filterByBusinessId = true,
  filterField = "business_id"
}: SecureAutocompleteProps) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);
  const { currentBusiness } = useTenant();
  
  // Fetch suggestions when input changes
  const fetchSuggestions = async (query: string) => {
    if (query.length < minChars) {
      setSuggestions([]);
      return;
    }
    
    // Sanitize the input
    const sanitizedQuery = sanitizeInput(query);
    
    if (sanitizedQuery.length < minChars) {
      setSuggestions([]);
      return;
    }
    
    setIsLoading(true);
    
    try {
      let supabaseQuery = supabase
        .from(table)
        .select(column)
        .ilike(column, `%${sanitizedQuery}%`)
        .limit(limit);
      
      // Filter by business_id if required
      if (filterByBusinessId && currentBusiness?.id) {
        supabaseQuery = supabaseQuery.eq(filterField, currentBusiness.id);
      }
      
      const { data, error } = await supabaseQuery;
      
      if (error) throw error;
      
      // Extract unique values
      const uniqueValues = Array.from(new Set(data.map(item => item[column])));
      setSuggestions(uniqueValues);
    } catch (error) {
      handleApiError(error, 'Erro ao buscar sugestões');
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle clicking outside the component to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && 
        suggestionsRef.current && 
        !inputRef.current.contains(event.target as Node) && 
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <div className={`relative ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative">
        <Input
          id={id}
          name={name}
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            const newValue = e.target.value;
            onChange(newValue);
            fetchSuggestions(newValue);
          }}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete="off" // Disable browser autocomplete
          aria-autocomplete="list"
          aria-controls={`${id}-suggestions`}
          aria-expanded={isFocused && suggestions.length > 0}
        />
        
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>
      
      {isFocused && suggestions.length > 0 && (
        <ul 
          id={`${id}-suggestions`}
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
          role="listbox"
        >
          {suggestions.map((suggestion, index) => (
            <li 
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => {
                onChange(suggestion);
                setSuggestions([]);
                setIsFocused(false);
              }}
              role="option"
              aria-selected={value === suggestion}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
