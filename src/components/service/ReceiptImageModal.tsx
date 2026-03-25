'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ReceiptImageModalProps {
  imageUrl: string;
  title: string;
  onClose: () => void;
}

export default function ReceiptImageModal({ imageUrl, title, onClose }: ReceiptImageModalProps) {
  const [zoomed, setZoomed] = useState(false);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/70 to-transparent">
        <p className="text-white text-sm font-bold truncate pr-4">{title}</p>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors shrink-0"
          aria-label="닫기"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Image */}
      <div
        className={`relative w-full h-full flex items-center justify-center p-4 transition-transform duration-300 ${zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
        onClick={(e) => {
          e.stopPropagation();
          setZoomed(!zoomed);
        }}
      >
        <div className={`relative transition-transform duration-300 ${zoomed ? 'scale-150' : 'scale-100'}`}>
          <Image
            src={imageUrl}
            alt={title}
            width={600}
            height={900}
            className="max-h-[80vh] w-auto object-contain rounded-lg shadow-2xl"
            priority
          />
        </div>
      </div>

      {/* Bottom hint */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center pb-6 bg-gradient-to-t from-black/50 to-transparent">
        <p className="text-white/60 text-xs">
          {zoomed ? '탭하여 축소' : '탭하여 확대'}
        </p>
      </div>
    </div>
  );
}
