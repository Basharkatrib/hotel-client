import React from 'react';
import { FaCheck, FaDiceOne, FaDiceTwo, FaDiceThree } from 'react-icons/fa';
import { HiCheckCircle, HiOutlineIdentification, HiOutlineCreditCard, HiOutlineOfficeBuilding } from 'react-icons/hi';

const BookingStepper = ({ currentStep }) => {
    const steps = [
        { id: 1, name: 'Select Room', icon: HiOutlineOfficeBuilding },
        { id: 2, name: 'Guest Details', icon: HiOutlineIdentification },
        { id: 3, name: 'Payment', icon: HiOutlineCreditCard },
    ];

    return (
        <div className="w-full py-6">
            <div className="flex items-center justify-center max-w-2xl mx-auto">
                {steps.map((step, index) => {
                    const isCompleted = currentStep > step.id;
                    const isActive = currentStep === step.id;
                    const isLast = index === steps.length - 1;

                    return (
                        <React.Fragment key={step.id}>
                            {/* Step Circle */}
                            <div className="flex flex-col items-center relative">
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isCompleted
                                            ? 'bg-blue-600 border-blue-600 text-white'
                                            : isActive
                                                ? 'bg-white border-blue-600 text-blue-600 scale-110 shadow-lg'
                                                : 'bg-white border-gray-300 text-gray-400'
                                        }`}
                                >
                                    {isCompleted ? (
                                        <FaCheck className="w-5 h-5" />
                                    ) : (
                                        <step.icon className="w-6 h-6" />
                                    )}
                                </div>
                                <span
                                    className={`mt-2 text-xs font-medium absolute -bottom-6 w-max ${isActive ? 'text-blue-600' : 'text-gray-500'
                                        }`}
                                >
                                    {step.name}
                                </span>
                            </div>

                            {/* Connector Line */}
                            {!isLast && (
                                <div
                                    className={`flex-1 h-0.5 mx-4 transition-all duration-300 ${isCompleted ? 'bg-blue-600' : 'bg-gray-200'
                                        }`}
                                ></div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default BookingStepper;
