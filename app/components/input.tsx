'use client';

import React, { useState, ChangeEvent, FocusEvent, useEffect } from 'react';

interface InputProps {
  /** برچسب فیلد */
  label: string;
  /** متن placeholder */
  placeholder?: string;
  /** حداکثر طول مجاز */
  maxLength?: number;
  /** پیام خطای سفارشی */
  errorMessage?: string;
  /** متن راهنما */
  helpText?: string;
  /** نوع ورودی */
  type?: string;
  /** نام فیلد */
  name?: string;
  /** شناسه یکتا */
  id?: string;
  /** مقدار کنترل شده از خارج */
  value?: string;
  /** تابع تغییر مقدار */
  onChange?: (value: string) => void;
  /** تابع blur */
  onBlur?: (value: string) => void;
  /** تابع اعتبارسنجی سفارشی - اگر null برگردونه معنیه معتبر است */
  customValidation?: (value: string) => string | null;
  /** چک کردن فیلد برای ثبت نام الزامی  */
  required?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder = '',
  maxLength,
  errorMessage = 'مقدار وارد شده معتبر نیست',
  helpText,
  type = 'text',
  name,
  id,
  value: externalValue,
  onChange: externalOnChange,
  onBlur: externalOnBlur,
  customValidation,
  required = false,
}) => {
  //    State Management   
  const [internalValue, setInternalValue] = useState(externalValue || '');
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const currentValue = externalValue !== undefined ? externalValue : internalValue;

  //    Validation Logic   
  const validateField = (val: string): string | null => {
    // Required validation
    if (required && (!val || val.trim() === '')) {
      return 'این فیلد الزامی است';
    }

    // اگه خالی بود و required نیست، خطا نده
    if (!val && !required) {
      return null;
    }

    // MaxLength validation
    if (maxLength && val.length > maxLength) {
      return errorMessage;
    }

    // Custom validation
    if (customValidation) {
      const customError = customValidation(val);
      if (customError) return customError;
    }

    // اگر هیچ خطایی نبود، یعنی معتبر است
    return null;
  };

  //    Event Handlers   
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    
    // اعمال محدودیت برای فیلدهای خاص
    if (name === 'phone' || label.includes('موبایل')) {
      newValue = newValue.replace(/[^\d]/g, ''); // فقط عدد
      if (newValue.length > 11) newValue = newValue.slice(0, 11);
    }
    
    if (type === 'number' || type === 'tel') {
      newValue = newValue.replace(/[^\d]/g, '');
    }
    
    // Update internal state
    if (externalValue === undefined) {
      setInternalValue(newValue);
    }
    
    setCharCount(newValue.length);
    
    // اعتبارسنجی در لحظه
    const validationError = validateField(newValue);
    setError(validationError);

    // فراخوانی تابع والد
    externalOnChange?.(newValue);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // علامت‌گذاری به عنوان touched
    setTouched(true);
    
    // اعتبارسنجی در هنگام ترک فیلد
    const validationError = validateField(newValue);
    setError(validationError);

    // فراخوانی تابع والد
    externalOnBlur?.(newValue);
  };

  // Update char count when external value changes
  useEffect(() => {
    setCharCount(currentValue.length);
    
    // اگه touched هست، اعتبارسنجی رو به‌روز کن
    if (touched) {
      const validationError = validateField(currentValue);
      setError(validationError);
    }
  }, [currentValue, touched]);

  const inputId = id || name || `input-${Math.random().toString(36).substring(2, 9)}`;
  
  // Dynamic classes - فقط بر اساس error و touched
  const getInputClasses = () => {
    const baseClasses = 'w-full px-4 py-3 text-gray-800 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-base';
    
    if (error && touched) {
      return `${baseClasses} border-red-500 focus:border-red-500 focus:ring-red-200 bg-red-50`;
    }
    
    // هیچ وقت سبز نشون نده مگه اینکه واقعاً معتبر باشه و touched شده باشه
    if (!error && touched && currentValue.length > 0) {
      return `${baseClasses} border-green-500 focus:border-green-500 focus:ring-green-200 bg-green-50`;
    }
    
    return `${baseClasses} border-gray-300 focus:border-blue-500 focus:ring-blue-200`;
  };

  return (
    <div className="mb-6 w-full bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      {/*    Header with Label    */}
      <div className="flex justify-between items-center mb-2">
        <label htmlFor={inputId} className="text-sm font-bold text-gray-700">
          {label} {required && <span className="text-red-500 text-lg">*</span>}
        </label>
        
        {/* Character Counter */}
        {maxLength && (
          <div className="flex items-center gap-1">
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              charCount > maxLength 
                ? 'bg-red-100 text-red-700 font-bold' 
                : charCount > maxLength * 0.8 
                  ? 'bg-orange-100 text-orange-700' 
                  : 'bg-gray-100 text-gray-600'
            }`}>
              {charCount}/{maxLength}
            </span>
          </div>
        )}
      </div>

      {/*    Help Text    */}
      {helpText && (
        <div className="mb-2 flex items-start gap-1.5 text-xs text-blue-600 bg-blue-50 p-2 rounded-lg border border-blue-100">
          <span className="text-blue-500 text-sm font-bold">*</span>
          <span className="flex-1 font-medium">{helpText}</span>
        </div>
      )}

      {/*    Input Field    */}
      <input
        type={type === 'number' ? 'tel' : type}
        id={inputId}
        name={name}
        value={currentValue}
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={handleBlur}
        className={getInputClasses()}
        aria-invalid={!!error}
        inputMode={type === 'number' || name === 'phone' ? 'numeric' : 'text'}
      />

      {/*    Event Indicators    */}
      <div className="mt-2 flex gap-2 text-[10px]">
        <span className={`px-2 py-0.5 rounded-full ${
          charCount > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
        }`}>
          onChange: {charCount > 0 ? 'اجرا شد' : 'منتظر...'}
        </span>
        <span className={`px-2 py-0.5 rounded-full ${
          touched ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'
        }`}>
          onBlur: {touched ? 'اجرا شد' :  'منتظر...'}
        </span>
        {touched && !error && currentValue.length > 0 && (
          <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700">
            معتبر ✓
          </span>
        )}
        {error && touched && (
          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700">
            نامعتبر  
          </span>
        )}
      </div>

      {/*    Error Message - فقط وقتی خطا داریم    */}
      {error && touched && (
        <div className="mt-2 flex items-start gap-1.5 text-xs text-red-600 font-bold bg-red-50 p-3 rounded-lg border border-red-200">
          <span className="text-red-500 text-base">!</span>
          <span className="flex-1">{error}</span>
        </div>
      )}

      {/*    همیشه خطا رو نشون بده، هیچوقت تایید اشتباهی نده    */}
    </div>
  );
};

export default Input;