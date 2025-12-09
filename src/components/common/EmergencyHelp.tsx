
'use client';

import { useState, useEffect } from "react";
import { 
  AlertTriangle, 
  X, 
  Phone, 
  MessageCircle,
  ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const EmergencyHelp = () => {
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [sharingLocation, setSharingLocation] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);

  // Hardcoded contacts
  const buddies = [
    { name: "Amit Kumar", phone: "9876543210" },
    { name: "Priya Singh", phone: "9123456780" },
  ];
  const warden = { name: "Hostel Warden", phone: "9000000000" };
  const policeNumber = "100"; // Emergency number for police in India

  const startLocationSharing = () => {
    setSharingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        // Fallback location (e.g., Delhi) if permission is denied
        () => setLocation({ lat: 28.6139, lng: 77.2090 }) 
      );
    } else {
      // Fallback if geolocation is not supported
      setLocation({ lat: 28.6139, lng: 77.2090 });
    }
  };

  const stopLocationSharing = () => {
    setSharingLocation(false);
  };
  
  useEffect(() => {
    // If modal closes, stop sharing location
    if (!helpModalOpen) {
      stopLocationSharing();
    }
  }, [helpModalOpen]);

  const getLocationMessage = (lat: number, lng: number) => {
    const mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
    return `Emergency! I need help. My current location is: ${mapsLink}`;
  };

  return (
    <>
      {/* The Trigger Button */}
      <Button
        variant="destructive"
        className="h-9 gap-1"
        onClick={() => {
          setHelpModalOpen(true);
          startLocationSharing();
        }}
        aria-label="I need help"
      >
        <ShieldAlert className="w-4 h-4" />
        <span className="hidden sm:inline">SOS</span>
      </Button>

      {/* Custom Modal Overlay */}
      {helpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in-95 duration-300">
            
            <button 
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" 
                onClick={() => setHelpModalOpen(false)} 
                aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="p-6 flex flex-col items-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mb-2 animate-pulse" />
              <h2 className="text-2xl font-bold text-red-600 mb-2 text-center">Emergency Assistance</h2>
              <p className="text-center text-gray-600 mb-6">If you are in danger, contact authorities immediately.</p>

              {/* Call Police Button */}
              <a 
                href={`tel:${policeNumber}`}
                className="flex items-center justify-center gap-3 w-full px-6 py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xl shadow-lg transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-red-300 mb-6"
              >
                <Phone className="w-6 h-6" />
                Call Police ({policeNumber})
              </a>

              <div className="w-full bg-orange-50 rounded-xl p-4 mb-4 flex flex-col items-center border border-orange-200">
                <span className="text-sm font-semibold text-orange-700 mb-1">Your Location</span>
                {sharingLocation && location ? (
                  <span className="text-xs text-gray-800">Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}</span>
                ) : (
                  <span className="text-xs text-gray-500">Getting location...</span>
                )}
              </div>

              <div className="w-full mb-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-2 text-center">Notify Emergency Contacts</h3>
                <div className="flex flex-col gap-2">
                  {[...buddies, warden].map(contact => (
                    <div key={contact.phone} className="flex items-center justify-between bg-gray-100 rounded-lg px-3 py-2">
                      <span className="font-medium text-gray-800">{contact.name}</span>
                      <div className="flex gap-2">
                        <a href={`tel:${contact.phone}`} className="bg-green-500 hover:bg-green-600 text-white rounded-full p-2 transition-colors" aria-label={`Call ${contact.name}`}>
                          <Phone className="w-4 h-4" />
                        </a>
                        <a 
                           href={location ? `sms:${contact.phone}?&body=${encodeURIComponent(getLocationMessage(location.lat, location.lng))}` : `sms:${contact.phone}`} 
                           className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 transition-colors"
                           aria-label={`Message ${contact.name}`}
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className="mt-4 w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-xl shadow-sm transition-colors duration-200"
                onClick={() => setHelpModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
