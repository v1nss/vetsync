import { useState } from 'react';
import { FaImage } from 'react-icons/fa';

/**
 * DriveImage Component
 * Handles Google Drive images with fallback URLs and error handling
 * 
 * @param {Object} image - Image object with link, directLink, viewLink properties
 * @param {string} alt - Alt text for the image
 * @param {string} className - CSS classes for the image
 * @param {string} fallbackIcon - Show icon on error (default: true)
 */
export default function DriveImage({ image, alt = "Image", className = "", fallbackIcon = true }) {
  const [currentLinkIndex, setCurrentLinkIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

  // If no image, return fallback early
  if (!image) {
    if (!fallbackIcon) return null;
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <FaImage className="text-gray-300 text-4xl" />
      </div>
    );
  }

  // If image is a string, treat it as a direct link
  const imageLinks = typeof image === 'string' 
    ? [image]
    : [
        image?.link,
        // Try to construct googleusercontent link from ID if available
        image?.id ? `https://lh3.googleusercontent.com/d/${image.id}` : null,
        image?.directLink,
        image?.thumbnail,
        image?.viewLink,
        // Try to construct direct link from ID if available
        image?.id ? `https://drive.google.com/uc?id=${image.id}` : null,
      ].filter(Boolean); // Remove null/undefined values

  const handleError = () => {
    console.warn(`Image failed to load: ${imageLinks[currentLinkIndex]}`);
    
    // Try next fallback link
    if (currentLinkIndex < imageLinks.length - 1) {
      setCurrentLinkIndex(currentLinkIndex + 1);
    } else {
      // All links failed
      setHasError(true);
    }
  };

  const handleLoad = () => {
    // Image loaded successfully
    if (currentLinkIndex > 0) {
      console.log(`Image loaded using fallback link #${currentLinkIndex + 1}`);
    }
  };

  if (hasError || !imageLinks.length) {
    if (!fallbackIcon) return null;
    
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <FaImage className="text-gray-300 text-4xl" />
      </div>
    );
  }

  return (
    <img
      src={imageLinks[currentLinkIndex]}
      alt={alt}
      className={className}
      onError={handleError}
      onLoad={handleLoad}
      loading="lazy"
    />
  );
}

