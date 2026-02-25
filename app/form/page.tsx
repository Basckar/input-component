'use client';

import React, { useState } from 'react';
import Input from '../components/input';

export default function FormPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    age: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  //    Validation Functions   
  
  /** اعتبارسنجی شماره موبایل - فقط وقتی کامل و صحیح باشه تایید میشه */
  const validatePhone = (phone: string): string | null => {
    // اگه خالی بود و required نیست، خطا نده
    if (!phone) return null;
    
    const cleanPhone = phone.replace(/\s/g, '');
    
    // بررسی اینکه فقط عدد باشد
    if (!/^\d+$/.test(cleanPhone)) {
      return 'شماره موبایل باید فقط شامل اعداد باشد';
    }
    
    // بررسی طول ۱۱ رقم
    if (cleanPhone.length !== 11) {
      return 'شماره موبایل باید ۱۱ رقم باشد';
    }
    
    // بررسی شروع با 09
    if (!cleanPhone.startsWith('09')) {
      return 'شماره موبایل باید با 09 شروع شود';
    }
    
    // اگر همه شرط‌ها درست بود، یعنی معتبر است
    return null;
  };

  /** اعتبارسنجی ایمیل */
  const validateEmail = (email: string): string | null => {
    if (!email) return null;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'ایمیل معتبر وارد کنید (example@domain.com)';
    }
    
    return null;
  };

  /** اعتبارسنجی سن */
  const validateAge = (age: string): string | null => {
    if (!age) return null;
    
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      return 'سن باید بین ۱ تا ۱۲۰ باشد';
    }
    
    return null;
  };

  //    Handlers   
  const handleChange = (field: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // پاک کردن خطای مربوط به این فیلد وقتی کاربر تایپ میکنه
    setFormErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
    
    setSubmitSuccess(false);
  };

  const handleBlur = (field: string) => (value: string) => {
    // اعتبارسنجی در blur
    let error: string | null = null;
    
    switch(field) {
      case 'phoneNumber':
        error = validatePhone(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'age':
        error = validateAge(value);
        break;
    }
    
    // اگه خطا داشت، ثبت کن
    if (error) {
      setFormErrors(prev => ({ ...prev, [field]: error }));
    } else {
      // اگه خطا نداشت و مقدار داشت، پاکش کن
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  //    Submit Handler   
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    
    // اعتبارسنجی همه فیلدها قبل از ارسال
    const errors: Record<string, string> = {};
    
    // فیلدهای اجباری
    if (!formData.fullName.trim()) {
      errors.fullName = 'نام و نام خانوادگی الزامی است';
    }
    
    // شماره موبایل
    const phoneError = validatePhone(formData.phoneNumber);
    if (phoneError) {
      errors.phoneNumber = phoneError;
    } else if (!formData.phoneNumber) {
      errors.phoneNumber = 'شماره موبایل الزامی است';
    }
    
    // ایمیل (اختیاری)
    if (formData.email) {
      const emailError = validateEmail(formData.email);
      if (emailError) errors.email = emailError;
    }
    
    // سن (اختیاری)
    if (formData.age) {
      const ageError = validateAge(formData.age);
      if (ageError) errors.age = ageError;
    }
    
    // اگه خطایی هست، ثبت نکن
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setSubmitSuccess(false);
      return;
    }
    
    // اگه خطایی نبود، ارسال کن
    setSubmitSuccess(true);
    console.log('  فرم با موفقیت ارسال شد:', formData);
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      phoneNumber: '',
      email: '',
      age: ''
    });
    setFormErrors({});
    setSubmitAttempted(false);
    setSubmitSuccess(false);
  };

  return (
    <div className="bg-gray-50 py-8 px-12 flex lg:flex-row flex-col justify-center gap-12" dir="rtl">
      <div className="w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
              فرم اعتبارسنجی 
          </h1> 
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-4 p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg">
              فرم با موفقیت ارسال شد!
            <pre className="mt-2 text-sm bg-white p-2 rounded">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-2">
            {/* نام کامل */}
            <Input
              label="نام و نام خانوادگی"
              name="fullName"
              placeholder="مثال: علی محمدی"
              helpText="نام کامل خود را وارد کنید"
              value={formData.fullName}
              onChange={handleChange('fullName')}
              onBlur={handleBlur('fullName')}
              required
            />

            {/* شماره موبایل - با اعتبارسنجی سختگیرانه */}
            <Input
              label="شماره موبایل"
              name="phone"
              placeholder="09123456789"
              maxLength={11}
              helpText="فقط عدد - ۱۱ رقم - حتماً با 09 شروع شود"
              errorMessage="شماره موبایل نامعتبر است"
              value={formData.phoneNumber}
              onChange={handleChange('phoneNumber')}
              onBlur={handleBlur('phoneNumber')}
              required
              type="tel"
              customValidation={validatePhone}
            />

            {/* نمایش خطای اختصاصی شماره موبایل */}
            {formErrors.phoneNumber && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200 mt-1">
                ! {formErrors.phoneNumber}
              </div>
            )}

            {/* ایمیل */}
            <Input
              label="ایمیل"
              name="email"
              type="email"
              placeholder="your@email.com"
              helpText="example@domain.com - اختیاری"
              errorMessage="ایمیل معتبر وارد کنید"
              value={formData.email}
              onChange={handleChange('email')}
              onBlur={handleBlur('email')}
              customValidation={validateEmail}
            />

            {/* نمایش خطای ایمیل */}
            {formErrors.email && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200 mt-1">
                ! {formErrors.email}
              </div>
            )}

            {/* سن */}
            <Input
              label="سن"
              name="age"
              placeholder="۲۵"
              maxLength={3}
              helpText="بین ۱ تا ۱۲۰ - اختیاری"
              errorMessage="سن معتبر نیست"
              value={formData.age}
              onChange={handleChange('age')}
              onBlur={handleBlur('age')}
              type="number"
              customValidation={validateAge}
            />

            {/* نمایش خطای سن */}
            {formErrors.age && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200 mt-1">
                ! {formErrors.age}
              </div>
            )}

            {/* Summary Errors */}
            {submitAttempted && Object.keys(formErrors).length > 0 && (
              <div className="p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg">
                <p className="font-bold mb-2">❌ فرم دارای خطا است و ثبت نشد:</p>
                <ul className="list-disc list-inside text-sm">
                  {Object.entries(formErrors).map(([field, error]) => (
                    <li key={field}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                  ثبت فرم
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-medium"
              >
                  پاک کردن
              </button>
            </div>
          </form>

         
        </div>
      </div>
      <div className='mt-12'>
    
       {/* Live Data */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="text-sm font-bold text-gray-700 mb-2">
               داده های لحظه ای:
            </h3>
            <pre className="text-xs text-gray-800 bg-white p-3 rounded-lg border border-gray-200 overflow-auto">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>

          {/* Validation Rules */}
          <div className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <h3 className="text-sm font-bold text-yellow-800 mb-2">
               قوانین اعتبارسنجی:
            </h3>
            <ul className="text-xs text-yellow-700 space-y-1 list-disc list-inside">
              <li><span className="font-bold">شماره موبایل:</span> فقط عدد، ۱۱ رقم، شروع با 09 - در غیر اینصورت خطا</li>
              <li><span className="font-bold">ایمیل:</span> باید فرمت صحیح داشته باشد (example@domain.com)</li>
              <li><span className="font-bold">سن:</span> فقط عدد، بین ۱ تا ۱۲۰</li>
              <li className="text-red-600 font-bold"> **هیچ فیلدی اشتباهاً تایید نمیشود**</li>
            </ul>
          </div>
          </div>
    </div>
  );
}