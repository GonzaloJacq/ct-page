'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface PhotoGalleryProps {
  photos?: string[];
}

export default function PhotoGallery({ photos = [] }: PhotoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  
  // Si no hay fotos, mostrar placeholders
  const displayPhotos = photos.length > 0 ? photos : Array(6).fill('/placeholder-photo.jpg');

  const handlePrev = () => {
    setSelectedIndex((prev) => 
      prev === null ? 0 : (prev - 1 + displayPhotos.length) % displayPhotos.length
    );
  };

  const handleNext = () => {
    setSelectedIndex((prev) => 
      prev === null ? 0 : (prev + 1) % displayPhotos.length
    );
  };

  return (
    <>
      <div className="dashboard-card">
        <h2 className="text-2xl font-display text-white mb-6 uppercase tracking-wider">
          Galería Fotográfica
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {displayPhotos.map((photo, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer"
            >
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <img
                  src={photo}
                  alt={`Foto ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <ChevronRight className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-2 right-2 bg-primary/80 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {index + 1}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedIndex(null)}
        >
          <div 
            className="relative w-full max-w-4xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute -top-10 right-0 p-2 text-white hover:text-primary transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image Container */}
            <div className="relative w-full flex-1 flex items-center justify-center rounded-lg overflow-hidden bg-black/50">
              <img
                src={displayPhotos[selectedIndex]}
                alt={`Foto ${selectedIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6 px-4">
              <button
                onClick={handlePrev}
                className="p-2 rounded-full bg-primary/20 hover:bg-primary/40 text-white transition-colors group"
              >
                <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>

              <div className="text-center text-white font-display">
                <p className="text-sm uppercase tracking-wider">
                  Foto {selectedIndex + 1} de {displayPhotos.length}
                </p>
              </div>

              <button
                onClick={handleNext}
                className="p-2 rounded-full bg-primary/20 hover:bg-primary/40 text-white transition-colors group"
              >
                <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
