
import React from 'react';

const RecruiterSection = () => {
  return (
    <section className="py-32 bg-black text-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex justify-center">
          <div className="space-y-6 w-full max-w-lg">
            <div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-3xl p-10 border border-white border-opacity-10">
              <h3 className="text-2xl font-medium mb-8 text-white">Project Resources</h3>
              <div className="space-y-4">
                <a href="https://github.com/DeepNandre/apple-adpulse-journey-63#" target="_blank" rel="noopener noreferrer" className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-4 px-6 rounded-2xl font-medium transition-all duration-300">
                  View GitHub Repository
                </a>
                <a href="#" className="block w-full bg-white bg-opacity-10 hover:bg-opacity-20 text-white text-center py-4 px-6 rounded-2xl font-medium transition-all duration-300 border border-white border-opacity-20">
                  Download Resume
                </a>
                <a href="#" className="block w-full border border-white border-opacity-30 hover:border-opacity-50 text-white text-center py-4 px-6 rounded-2xl font-medium transition-all duration-300">
                  Schedule Interview
                </a>
              </div>
            </div>
            
            <div className="text-center text-gray-400">
              <p className="text-sm font-light">
                Ready to discuss how this project translates to marketing analytics needs
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecruiterSection;
