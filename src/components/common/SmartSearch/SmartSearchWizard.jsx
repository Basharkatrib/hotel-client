import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose, IoSparkles, IoChevronBack, IoChevronForward, IoLocationOutline, IoPeopleOutline, IoCashOutline, IoCheckmarkCircle } from 'react-icons/io5';
import { useGetRecommendationsQuery } from '../../../services/hotelsApi';
import { Link } from 'react-router-dom';
import RatingBadge from '../RatingBadge';

const SmartSearchWizard = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        city: '',
        guests: 1,
        min_price: 0,
        max_price: 1000,
        amenities: [],
        view: 'none'
    });

    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        window.addEventListener('open-smart-search', handleOpen);
        return () => window.removeEventListener('open-smart-search', handleOpen);
    }, []);

    const { data: recommendations, isFetching } = useGetRecommendationsQuery(formData, {
        skip: step !== 6 || !isOpen
    });

    const closeModal = () => {
        setIsOpen(false);
        // Reset wizard to step 1 after a short delay for smooth closing
        setTimeout(() => setStep(1), 300);
    };

    const totalSteps = 6;

    const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const updateFormData = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const toggleAmenity = (amenity) => {
        setFormData(prev => {
            const amenities = prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity];
            return { ...prev, amenities };
        });
    };

    const steps = [
        {
            id: 1,
            title: 'Where are you heading?',
            icon: <IoLocationOutline className="text-4xl text-blue-500" />,
            content: (
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Enter city (e.g., Barcelona, Paris...)"
                        value={formData.city}
                        onChange={(e) => updateFormData('city', e.target.value)}
                        className="w-full p-4 rounded-xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                    />
                    <div className="flex flex-wrap gap-2">
                        {['Barcelona', 'Paris', 'Dubai', 'London'].map(city => (
                            <button
                                key={city}
                                onClick={() => updateFormData('city', city)}
                                className="px-4 py-2 rounded-full text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors"
                            >
                                {city}
                            </button>
                        ))}
                    </div>
                </div>
            )
        },
        {
            id: 2,
            title: 'How many guests?',
            icon: <IoPeopleOutline className="text-4xl text-indigo-500" />,
            content: (
                <div className="flex flex-col items-center gap-6">
                    <div className="text-6xl font-bold text-gray-900 dark:text-white">{formData.guests}</div>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={formData.guests}
                        onChange={(e) => updateFormData('guests', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between w-full text-xs text-gray-500">
                        <span>Solo</span>
                        <span>Group (10+)</span>
                    </div>
                </div>
            )
        },
        {
            id: 3,
            title: 'Budget range (per night)',
            icon: <IoCashOutline className="text-4xl text-green-500" />,
            content: (
                <div className="space-y-6 text-center">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        ${formData.min_price} - ${formData.max_price}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs text-gray-500">Min</label>
                            <input
                                type="number"
                                value={formData.min_price}
                                onChange={(e) => updateFormData('min_price', e.target.value)}
                                className="w-full p-3 rounded-lg border dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-gray-500">Max</label>
                            <input
                                type="number"
                                value={formData.max_price}
                                onChange={(e) => updateFormData('max_price', e.target.value)}
                                className="w-full p-3 rounded-lg border dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            />
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 4,
            title: 'Must-have Amenities',
            icon: <IoSparkles className="text-4xl text-amber-500" />,
            content: (
                <div className="grid grid-cols-2 gap-3 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                    {[
                        { id: 'wifi', label: 'Fast Wi-Fi', icon: '📶' },
                        { id: 'breakfast', label: 'Breakfast', icon: '🍳' },
                        { id: 'ac', label: 'AC', icon: '❄️' },
                        { id: 'balcony', label: 'Balcony', icon: '🏙️' },
                        { id: 'minibar', label: 'Mini Bar', icon: '🍾' },
                        { id: 'tv', label: 'Smart TV', icon: '📺' },
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => toggleAmenity(item.id)}
                            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${formData.amenities.includes(item.id)
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-100 dark:border-gray-800 hover:border-gray-200'
                                }`}
                        >
                            <span>{item.icon}</span>
                            <span className="text-sm font-medium dark:text-gray-200">{item.label}</span>
                        </button>
                    ))}
                </div>
            )
        },
        {
            id: 5,
            title: 'Preferred View',
            icon: <IoSparkles className="text-4xl text-purple-500" />,
            content: (
                <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                    {[
                        { id: 'city', label: 'City View', icon: '🏙️' },
                        { id: 'sea', label: 'Sea View', icon: '🌊' },
                        { id: 'mountain', label: 'Mountain View', icon: '🏔️' },
                        { id: 'garden', label: 'Garden View', icon: '🌿' },
                        { id: 'none', label: 'No Preference', icon: '🚪' },
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => updateFormData('view', item.id)}
                            className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${formData.view === item.id
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-100 dark:border-gray-800 hover:border-gray-200'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <span>{item.icon}</span>
                                <span className="font-medium dark:text-gray-200">{item.label}</span>
                            </div>
                            {formData.view === item.id && <IoCheckmarkCircle className="text-blue-500 text-xl" />}
                        </button>
                    ))}
                </div>
            )
        },
        {
            id: 6,
            title: 'Your Smart Recommendations',
            icon: <IoSparkles className="text-4xl text-blue-600 animate-pulse" />,
            content: (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {isFetching ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-gray-500 animate-pulse">Analyzing hundreds of rooms for you...</p>
                        </div>
                    ) : recommendations?.data?.rooms?.length > 0 ? (
                        <div className="grid gap-4">
                            {recommendations.data.rooms.map(room => (
                                <Link
                                    key={room.id}
                                    to={`/room/${room.id}`}
                                    className="flex gap-4 p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all group"
                                    onClick={closeModal}
                                >
                                    <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
                                        <img
                                            src={room.images?.[0] || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400'}
                                            alt={room.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1">{room.name}</h4>
                                            <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">${room.price_per_night}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{room.hotel?.name} • {room.hotel?.city}</p>
                                        <div className="flex items-center justify-between gap-2 mt-2">
                                            <div className="flex items-center gap-2">
                                                <RatingBadge
                                                    rating={room.hotel?.rating}
                                                    showText={false}
                                                    size="sm"
                                                />
                                                <span className="text-[10px] text-gray-500">{room.hotel?.reviews_count} reviews</span>
                                            </div>
                                            <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[10px] text-blue-600 dark:text-blue-400 font-bold">
                                                Match: {room.recommendation_score}%
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 space-y-4">
                            <div className="text-6xl">😕</div>
                            <h4 className="font-bold text-gray-900 dark:text-white">No perfect match found</h4>
                            <p className="text-sm text-gray-500">Try adjusting your budget or amenities for more results.</p>
                            <button
                                onClick={() => setStep(1)}
                                className="text-blue-600 font-bold hover:underline"
                            >
                                Start Over
                            </button>
                        </div>
                    )}
                </div>
            )
        }
    ];

    return (
        <>
            {/* Floating Action Button */}
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-[90] flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 text-white shadow-2xl hover:bg-blue-700 transition-colors group"
            >
                <div className="absolute inset-0 rounded-full bg-blue-400 group-hover:animate-ping opacity-20" />
                <IoSparkles className="text-2xl" />

                {/* Tooltip */}
                <div className="absolute right-full mr-4 px-3 py-1 bg-gray-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Smart Search
                </div>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-[24px] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
                        >
                            {/* Progress Bar */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100 dark:bg-gray-800">
                                <motion.div
                                    className="h-full bg-blue-600"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(step / totalSteps) * 100}%` }}
                                />
                            </div>

                            {/* Header */}
                            <div className="px-6 pt-8 pb-4 flex justify-between items-center">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 flex items-center justify-center bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                                        <IoSparkles className="text-blue-600 dark:text-blue-400 text-lg" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-gray-900 dark:text-white">Smart Search</h3>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Step {step} of {totalSteps}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                                >
                                    <IoClose className="text-xl text-gray-500" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="px-6 py-4">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={step}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="space-y-6"
                                    >
                                        <div className="flex flex-col items-center text-center gap-3">
                                            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                                {steps[step - 1].icon}
                                            </div>
                                            <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{steps[step - 1].title}</h2>
                                        </div>

                                        <div className="min-h-[220px] flex flex-col justify-center">
                                            {steps[step - 1].content}
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-950/50 flex justify-between items-center border-t dark:border-gray-800">
                                <button
                                    onClick={prevStep}
                                    disabled={step === 1}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                                        }`}
                                >
                                    <IoChevronBack />
                                    Back
                                </button>

                                {step < totalSteps && (
                                    <button
                                        onClick={nextStep}
                                        className="flex items-center gap-2 px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                                    >
                                        Next
                                        <IoChevronForward />
                                    </button>
                                )}
                                {step === totalSteps && (
                                    <button
                                        onClick={closeModal}
                                        className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-bold transition-all active:scale-95"
                                    >
                                        Close
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default SmartSearchWizard;
