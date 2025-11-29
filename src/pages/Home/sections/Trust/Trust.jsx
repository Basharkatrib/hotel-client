import React from 'react';
import dollarCircle from '../../../../assets/Home/trust/dollar-circle.svg';
import shieldCheck from '../../../../assets/Home/trust/shield-check.svg';
import vector from '../../../../assets/Home/trust/vector.svg';
import fileList from '../../../../assets/Home/trust/file-list-edit.svg';
import TrustCard from './components/TrustCard';

const Trust = () => {
  const features = [
    {
      icon: dollarCircle,
      title: 'No hidden fees',
      description: 'Transparent pricing with no hidden fees.',
    },
    {
      icon: shieldCheck,
      title: 'Instant booking',
      description: 'Get confirmation right after you reserve.',
    },
    {
      icon: fileList,
      title: 'Flexibility',
      description: 'Flexible options with free cancellation on many listings.',
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-white" aria-labelledby="trust-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <div className="w-12 sm:w-16 h-0.5 bg-blue-400 mx-auto mb-3 sm:mb-4" aria-hidden="true"></div>
          <h2 id="trust-heading" className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 px-4">
            Why Travellers Trust Tripto
          </h2>
        </div>

        {/* Features Grid */}
        <div className="relative">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-8 md:gap-0">
            {features.map((feature, index) => (
              <React.Fragment key={index}>
                <TrustCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
                {/* Connection Line between cards - Desktop Only */}
                {index < features.length - 1 && (
                  <div className="hidden md:flex shrink-0 w-32 lg:w-68 items-center">
                    <img 
                      src={vector} 
                      alt="connection line"
                      className="w-full h-auto"
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Trust;