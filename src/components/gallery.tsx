'use client';
import Image from 'next/image';
import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
export function Gallery({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState(0);
  return (
    <div className="gallery">
      <div className="gallery-main">
        <Image
          src={images[index]}
          alt={`${title}, property photograph ${index + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 75vw"
        />
        {images.length > 1 && (
          <div className="gallery-controls">
            <button
              aria-label="Previous photograph"
              onClick={() => setIndex((index + images.length - 1) % images.length)}
            >
              <ChevronLeftIcon />
            </button>
            <span aria-live="polite">
              {String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
            </span>
            <button
              aria-label="Next photograph"
              onClick={() => setIndex((index + 1) % images.length)}
            >
              <ChevronRightIcon />
            </button>
          </div>
        )}
      </div>
      <div className="gallery-thumbnails">
        {images.map((src, i) => (
          <button
            key={src}
            aria-label={`View photograph ${i + 1}`}
            aria-pressed={index === i}
            onClick={() => setIndex(i)}
          >
            <Image src={src} width={180} height={120} alt="" />
          </button>
        ))}
      </div>
    </div>
  );
}
