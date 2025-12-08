import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { FaTimes, FaMapMarkerAlt } from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon
const createCustomIcon = (color = '#FF6B6B') => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
};

// Component to handle map clicks and resize
function MapClickHandler({ onLocationSelect }) {
  const map = useMap();
  
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);
    },
  });

  // Fix map size when component mounts
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);

  return null;
}

export default function LocationPickerModal({ isOpen, onClose, onConfirm, initialLat, initialLng }) {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [mapKey, setMapKey] = useState(0);

  // Default center: Philippines (Manila area)
  const defaultCenter = [14.5995, 120.9842];
  const defaultZoom = 13;

  // Initialize with provided coordinates or default
  useEffect(() => {
    if (isOpen) {
      if (initialLat && initialLng) {
        setSelectedLocation([parseFloat(initialLat), parseFloat(initialLng)]);
      } else {
        setSelectedLocation(null);
      }
      setUserLocation(null);
      
      // Force remount map when modal opens
      setMapKey(prev => prev + 1);
      
      // Force map resize after modal opens
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 300);
    }
  }, [isOpen, initialLat, initialLng]);

  // Get user's current location
  const handleGetCurrentLocation = () => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location = [latitude, longitude];
          setUserLocation(location);
          setSelectedLocation(location);
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoadingLocation(false);
          alert('Unable to get your location. Please click on the map to select a location.');
        }
      );
    } else {
      setIsLoadingLocation(false);
      alert('Geolocation is not supported by your browser. Please click on the map to select a location.');
    }
  };

  const handleLocationSelect = (lat, lng) => {
    setSelectedLocation([lat, lng]);
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onConfirm(selectedLocation[0], selectedLocation[1]);
      onClose();
    } else {
      alert('Please select a location on the map first.');
    }
  };

  if (!isOpen) return null;

  const mapCenter = selectedLocation || userLocation || defaultCenter;
  const mapZoom = selectedLocation || userLocation ? 15 : defaultZoom;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FaMapMarkerAlt className="text-primary text-xl" />
            <h2 className="text-xl font-semibold text-gray-900">Select Clinic Location</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Map Container */}
        <div className="relative h-[500px] w-full">
          <MapContainer
            key={mapKey}
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: '100%', width: '100%', zIndex: 0 }}
            scrollWheelZoom={true}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
              attribution="© CartoDB & OSM contributors"
            />
            <MapClickHandler onLocationSelect={handleLocationSelect} />
            {selectedLocation && (
              <Marker
                position={selectedLocation}
                icon={createCustomIcon('#FF6B6B')}
              />
            )}
          </MapContainer>
        </div>

        {/* Controls */}
        <div className="p-6 border-t border-gray-200 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleGetCurrentLocation}
              disabled={isLoadingLocation}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoadingLocation ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>Getting location...</span>
                </>
              ) : (
                <>
                  <FaMapMarkerAlt />
                  <span>Use My Location</span>
                </>
              )}
            </button>

            {selectedLocation && (
              <div className="flex-1 text-sm text-gray-600">
                <p className="font-medium">Selected Location:</p>
                <p>Latitude: {selectedLocation[0].toFixed(6)}</p>
                <p>Longitude: {selectedLocation[1].toFixed(6)}</p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!selectedLocation}
              className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-[#FEA08E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Location
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Click on the map to pin your clinic location, or use "Use My Location" to automatically detect your current position.
          </p>
        </div>
      </div>
    </div>
  );
}
