import { FaTimes, FaChevronLeft, FaChevronRight, FaDownload } from 'react-icons/fa';
import DriveImage from './DriveImage';

/**
 * Full-screen Image Viewer Modal
 * Allows viewing images in full size with navigation
 */
export default function ImageViewerModal({ images, currentIndex, onClose, onNavigate, title = "Image Viewer" }) {
  if (!images || images.length === 0 || currentIndex === null) return null;

  const handlePrevious = (e) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    } else {
      onNavigate(images.length - 1); // Loop to last
    }
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (currentIndex < images.length - 1) {
      onNavigate(currentIndex + 1);
    } else {
      onNavigate(0); // Loop to first
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') handlePrevious(e);
    if (e.key === 'ArrowRight') handleNext(e);
  };

  const currentImage = images[currentIndex];

  return (
    <div
      className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100]"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition z-10"
      >
        <FaTimes className="text-xl" />
      </button>

      {/* Image Counter */}
      <div className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-full text-sm z-10">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Download Button */}
      {currentImage?.downloadLink && (
        <a
          href={currentImage.downloadLink}
          download={currentImage.name}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 transition z-10"
        >
          <FaDownload />
          Download
        </a>
      )}

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition"
          >
            <FaChevronLeft className="text-2xl" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition"
          >
            <FaChevronRight className="text-2xl" />
          </button>
        </>
      )}

      {/* Main Image */}
      <div
        className="max-w-7xl max-h-[90vh] w-full px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <DriveImage
          image={currentImage}
          alt={currentImage?.name || `Image ${currentIndex + 1}`}
          className="w-full h-full object-contain rounded-lg"
        />
        
        {/* Image Name */}
        {currentImage?.name && (
          <div className="text-center mt-4 text-white text-sm bg-black/50 px-4 py-2 rounded-lg">
            {currentImage.name}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-4xl w-full px-4">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((image, idx) => (
                <div
                  key={image?.id || idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(idx);
                  }}
                  className={`shrink-0 cursor-pointer transition ${
                    idx === currentIndex ? 'ring-2 ring-white' : 'opacity-50 hover:opacity-100'
                  }`}
                >
                  <DriveImage
                    image={image}
                    alt={image?.name || `Thumbnail ${idx + 1}`}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

