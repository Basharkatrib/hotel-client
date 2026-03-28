import React, { useState } from 'react';
import { useGetAdvertisementsQuery } from '../../services/hotelsApi';
import { FaTag, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const PromotionsBar = () => {
    const { data: adsData, isLoading } = useGetAdvertisementsQuery();
    const navigate = useNavigate();
    const [dismissed, setDismissed] = useState(false);

    const ads = adsData?.data?.advertisements || [];

    if (isLoading || ads.length === 0 || dismissed) return null;

    return (
        <div className="z-50 top-15 md:top-20 left-0 right-0 bg-blue-600 text-white overflow-hidden relative group">
            <div className="flex items-center whitespace-nowrap animate-marquee py-2 px-4 pr-10">
                {ads.map((ad, index) => (
                    <div
                        key={ad.id}
                        className="inline-flex items-center mx-8 cursor-pointer hover:underline"
                        onClick={() => navigate(`/hotel/${ad.hotel.slug}`)}
                    >
                        <FaTag className="mr-2 text-yellow-300" />
                        <span className="font-bold mr-1">{ad.hotel.name}:</span>
                        <span>
                            {ad.title} -
                            <span className="text-yellow-300 font-bold ml-1">
                                {ad.discount_type === 'percentage'
                                    ? `${ad.discount_value}% OFF`
                                    : `$${ad.discount_value} OFF`}
                            </span>
                        </span>
                    </div>
                ))}
                {ads.map((ad, index) => (
                    <div
                        key={`dup-${ad.id}`}
                        className="inline-flex items-center mx-8 cursor-pointer hover:underline"
                        onClick={() => navigate(`/hotel/${ad.hotel.slug}`)}
                    >
                        <FaTag className="mr-2 text-yellow-300" />
                        <span className="font-bold mr-1">{ad.hotel.name}:</span>
                        <span>
                            {ad.title} -
                            <span className="text-yellow-300 font-bold ml-1">
                                {ad.discount_type === 'percentage'
                                    ? `${ad.discount_value}% OFF`
                                    : `$${ad.discount_value} OFF`}
                            </span>
                        </span>
                    </div>
                ))}
            </div>

            {/* زر الإغلاق */}
            <button
                onClick={() => setDismissed(true)}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-blue-700 hover:bg-blue-800 transition-colors cursor-pointer"
                aria-label="Close promotions bar"
            >
                <FaTimes size={12} />
            </button>

            <style jsx="true">{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    display: inline-block;
                    animation: marquee 30s linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
};

export default PromotionsBar;