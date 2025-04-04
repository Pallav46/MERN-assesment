import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import ParticlesBackground from './ParticlesBackground';
import 'react-datepicker/dist/react-datepicker.css';
import { FiUpload, FiX, FiCheck, FiUser, FiMail, FiHome, FiFile, FiCalendar } from 'react-icons/fi';

export default function VerificationForm() {
  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue, 
    formState: { errors } 
  } = useForm();

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sameAddress = watch('sameAsResidential');
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);

  const onFileChange = (e) => {
    const files = Array.from(e.target.files);
    const updatedFiles = [...selectedFiles, ...files].slice(0, 5); // Limit to 5 files
    setSelectedFiles(updatedFiles);
    setValue('documents', updatedFiles, { shouldValidate: true });
    e.target.value = '';
  };

  const removeFile = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    setValue('documents', updatedFiles, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    if (!data.documents || data.documents.length < 2) {
      alert("Please upload at least 2 documents");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'documents') {
        if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      }
    });

    data.documents.forEach(file => {
      formData.append('documents', file);
    });

    try {
      await axios.post('/api/candidates/submit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Application submitted successfully!');
      setSelectedFiles([]);
    } catch (error) {
      alert(error.response?.data?.error || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 relative overflow-hidden">
      <ParticlesBackground />
      
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 relative z-10"
      >
        <form 
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 space-y-6"
        >
          <header className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center">
              <FiUser className="mr-2" /> Candidate Verification Portal
            </h1>
            <p className="text-gray-600">Please fill in all required fields</p>
          </header>

          {/* Personal Information Section */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center">
              <FiUser className="mr-2" /> Personal Information
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    {...register('firstName', { required: true })}
                    className="w-full pl-10 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">This field is required</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    {...register('lastName', { required: true })}
                    className="w-full pl-10 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">This field is required</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  type="email"
                  {...register('email', { 
                    required: true,
                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                  })}
                  className="w-full pl-10 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">Valid email is required</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="text-gray-400" />
                </div>
                <DatePicker
                  selected={watch('dob')}
                  onChange={(date) => setValue('dob', date)}
                  maxDate={maxDate}
                  showYearDropdown
                  dropdownMode="select"
                  className="w-full pl-10 px-4 py-2 rounded-lg border border-gray-300"
                />
              </div>
              {errors.dob && (
                <p className="text-red-500 text-sm mt-1">Must be at least 18 years old</p>
              )}
            </div>
          </section>

          {/* Address Section */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center">
              <FiHome className="mr-2" /> Address Information
            </h2>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">
                Residential Address
              </h3>
              
              <div className="space-y-4">
                <div className="relative">
                  <input
                    {...register('residentialAddress.street1', { required: true })}
                    placeholder="Street Address 1 *"
                    className="w-full pl-10 px-4 py-2 rounded-lg border border-gray-300"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiHome className="text-gray-400" />
                  </div>
                </div>
                <div className="relative">
                  <input
                    {...register('residentialAddress.street2', { required: true })}
                    placeholder="Street Address 2 *"
                    className="w-full pl-10 px-4 py-2 rounded-lg border border-gray-300"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiHome className="text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="sameAddress"
                {...register('sameAsResidential')}
                className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="sameAddress" className="text-sm text-gray-700">
                Permanent address same as residential
              </label>
            </div>

            {!sameAddress && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-medium text-gray-700">
                  Permanent Address
                </h3>
                
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      {...register('permanentAddress.street1', { required: !sameAddress })}
                      placeholder="Street Address 1 *"
                      className="w-full pl-10 px-4 py-2 rounded-lg border border-gray-300"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiHome className="text-gray-400" />
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      {...register('permanentAddress.street2', { required: !sameAddress })}
                      placeholder="Street Address 2 *"
                      className="w-full pl-10 px-4 py-2 rounded-lg border border-gray-300"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiHome className="text-gray-400" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </section>

          {/* Documents Section */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center">
              <FiFile className="mr-2" /> Document Upload
            </h2>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Documents (Minimum 2) *
              </label>
              
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    JPEG, PNG, PDF (Max 5MB each)
                  </p>
                </div>
                <input 
                  type="file" 
                  onChange={onFileChange}
                  multiple
                  className="hidden"
                />
              </label>
              
              {errors.documents && (
                <p className="text-red-500 text-sm">
                  At least 2 valid documents are required
                </p>
              )}
              
              {selectedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Selected files:</h4>
                  <ul className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center space-x-3">
                          <FiFile className="text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                        >
                          <FiX />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>

          <button
            type="submit"
            disabled={isSubmitting || selectedFiles.length < 2}
            className={`w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 ${
              isSubmitting || selectedFiles.length < 2 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-blue-700 hover:scale-[1.02]'
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <FiCheck className="mr-1" /> Submit Application
              </>
            )}
          </button>
        </form>
      </motion.main>
    </div>
  );
}