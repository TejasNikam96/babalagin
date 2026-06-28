import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Heart,
  Lock,
  ShieldCheck,
  Ruler,
  GraduationCap,
  Cake,
  Briefcase,
  Users,
  ChevronLeft,
  ChevronRight,
  User,
  X,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  Home,
  Users as UsersIcon,
  HeartHandshake,
  Building,
  MapPin,
  Clock,
  Award,
  DollarSign,
  Globe,
  BookOpen,
  Sparkles,
  Target,
  Star,
  Share2,
  Copy,
  Image,
} from "lucide-react";

/**
 * ============================================================================
 * BRAND STANDARD — colors / font / buttons used across Login.jsx,
 * ContactUs.jsx and this file. Keep new pages aligned to this palette.
 * ============================================================================
 *
 * COLORS
 *   maroon-900  #3F0E1C   headings, primary text
 *   maroon-800  #5C1B2E   primary button gradient (start)
 *   maroon-700  #7A2238   primary button gradient (end) / accents
 *   gold-600    #B8860B   icons, eyebrow labels
 *   gold-500    #D4A017   borders, focus ring, dividers
 *   gold-400    #E8C547   icon-on-dark accents
 *   cream-50    #FBF3DC   page background
 *   card        #FFFDF7   card / panel background
 *   text muted  #6B4A52   secondary text
 *   text faint  #8A6F75   tertiary text / helper captions
 *   placeholder #B59A9F   input placeholder text
 *
 * FONT
 *   Headings -> font-serif (matches "प्रोफाईल लॉगिन" / "संदेश पाठवा" headings)
 *   Body     -> default sans stack
 *
 * BUTTONS
 *   Primary   -> bg-gradient-to-r from-[#5C1B2E] to-[#7A2238], text-white,
 *                rounded-lg, shadow-md, hover:-translate-y-0.5
 *   Secondary -> bg-white, border border-[#D4A017]/40, text-[#7A2238],
 *                hover:bg-[#FBF3DC]
 *   Icon-only -> rounded-full, ring-1 ring-[#D4A017]/40
 * ============================================================================
 */

function calcAge(dobDDMMYYYY) {
  if (!dobDDMMYYYY) return null;
  const [d, m, y] = dobDDMMYYYY.split("/").map(Number);
  if (!d || !m || !y) return null;
  const dob = new Date(y, m - 1, d);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const notYetBirthday =
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate());
  if (notYetBirthday) age -= 1;
  return age;
}

function Field({ label, value, icon: Icon }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2">
      {Icon && <Icon className="w-4 h-4 text-[#B8860B] mt-0.5 flex-shrink-0" />}
      <div className="flex-1">
        <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#B8860B]">
          {label}
        </dt>
        <dd className="mt-0.5 text-sm font-medium text-[#3F0E1C]">{value}</dd>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, fields, children, className = "" }) {
  const visible = fields ? fields.filter((f) => f.value) : [];
  if (visible.length === 0 && !children) return null;
  return (
    <div className={`bg-[#FFFDF7] rounded-2xl shadow-sm border border-[#D4A017]/20 p-6 ${className}`}>
      <div className="flex items-center gap-2.5 mb-4">
        <span className="grid place-items-center w-8 h-8 rounded-full bg-[#3F0E1C]/8">
          <Icon className="w-4 h-4 text-[#7A2238]" />
        </span>
        <h2 className="font-serif text-lg font-bold text-[#3F0E1C]">{title}</h2>
        <span className="h-px flex-1 bg-gradient-to-r from-[#D4A017]/40 to-transparent" />
      </div>
      {visible.length > 0 && (
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          {visible.map((f) => (
            <Field key={f.label} label={f.label} value={f.value} icon={f.icon} />
          ))}
        </dl>
      )}
      {children}
    </div>
  );
}

// Photo Slider Component
function PhotoSlider({ photos, activeIndex, onClose, onPrevious, onNext }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(activeIndex);
  const autoPlayRef = useRef(null);

  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % photos.length);
      }, 3000);
    } else {
      clearInterval(autoPlayRef.current);
    }
    return () => clearInterval(autoPlayRef.current);
  }, [isAutoPlaying, photos.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
        onPrevious?.();
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev + 1) % photos.length);
        onNext?.();
      } else if (e.key === 'Escape') {
        onClose?.();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [photos.length, onClose, onPrevious, onNext]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    onPrevious?.();
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
    onNext?.();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="relative max-w-7xl w-full max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition"
          aria-label="Close slider"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition"
            aria-label="Toggle fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition"
            aria-label="Toggle auto-play"
          >
            {isAutoPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
        </div>

        <div className="w-full h-full flex items-center justify-center">
          <img
            src={photos[currentIndex].src}
            alt={photos[currentIndex].alt || `Photo ${currentIndex + 1}`}
            className="object-contain max-w-full max-h-[85vh]"
          />
        </div>

        {photos.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition"
              aria-label="Next photo"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </>
        )}

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
          {currentIndex + 1} / {photos.length}
          {photos[currentIndex].caption && (
            <span className="ml-2 text-gray-300">• {photos[currentIndex].caption}</span>
          )}
        </div>

        {photos.length > 1 && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 max-w-[80vw] overflow-x-auto px-4">
            {photos.map((photo, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                  index === currentIndex
                    ? 'border-[#D4A017]'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={photo.src}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FamilyBackground({ family }) {
  if (!family) return null;

  const familyFields = [
    { label: "Father's Name", value: family.fatherName, icon: User },
    { label: "Father's Occupation", value: family.fatherOccupation, icon: Briefcase },
    { label: "Mother's Name", value: family.motherName, icon: User },
    { label: "Mother's Occupation", value: family.motherOccupation, icon: Briefcase },
    { label: "Number of Brothers", value: family.brothers, icon: UsersIcon },
    { label: "Number of Sisters", value: family.sisters, icon: UsersIcon },
    { label: "Family Type", value: family.familyType, icon: Home },
    { label: "Family Values", value: family.familyValues, icon: HeartHandshake },
    { label: "Family Status", value: family.familyStatus, icon: Award },
    { label: "Ancestral Origin", value: family.ancestralOrigin, icon: MapPin },
    { label: "Family Language", value: family.familyLanguage, icon: Globe },
  ];

  const visibleFields = familyFields.filter(f => f.value);

  if (visibleFields.length === 0) return null;

  return (
    <Section icon={Users} title="Family Background" fields={visibleFields}>
      {family.additionalInfo && (
        <div className="mt-4 pt-4 border-t border-[#D4A017]/20">
          <p className="text-sm text-[#3F0E1C] leading-relaxed">
            {family.additionalInfo}
          </p>
        </div>
      )}
    </Section>
  );
}

function Expectations({ expectations }) {
  if (!expectations) return null;

  const expectationFields = [
    { label: "Age Range", value: expectations.ageRange, icon: Cake },
    { label: "Height Range", value: expectations.heightRange, icon: Ruler },
    { label: "Education", value: expectations.education, icon: GraduationCap },
    { label: "Occupation", value: expectations.occupation, icon: Briefcase },
    { label: "Income Range", value: expectations.incomeRange, icon: DollarSign },
    { label: "Caste", value: expectations.caste, icon: UsersIcon },
    { label: "Religion", value: expectations.religion, icon: Globe },
    { label: "Location", value: expectations.location, icon: MapPin },
    { label: "Marital Status", value: expectations.maritalStatus, icon: HeartHandshake },
    { label: "Family Values", value: expectations.familyValues, icon: Home },
    { label: "Dietary Preferences", value: expectations.dietaryPreferences, icon: Sparkles },
    { label: "Language", value: expectations.language, icon: BookOpen },
  ];

  const visibleFields = expectationFields.filter(f => f.value);

  if (visibleFields.length === 0) return null;

  return (
    <Section icon={Target} title="Partner Expectations" fields={visibleFields}>
      {expectations.additionalInfo && (
        <div className="mt-4 pt-4 border-t border-[#D4A017]/20">
          <p className="text-sm text-[#3F0E1C] leading-relaxed">
            {expectations.additionalInfo}
          </p>
        </div>
      )}
      
      {expectations.preferences && expectations.preferences.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {expectations.preferences.map((pref, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 rounded-full bg-[#D4A017]/10 border border-[#D4A017]/30 px-3 py-1 text-xs font-medium text-[#B8860B]"
            >
              <Sparkles className="w-3 h-3" />
              {pref}
            </span>
          ))}
        </div>
      )}
    </Section>
  );
}

// ============================================================
// FIXED WHATSAPP SHARING WITH PROPER IMAGE PREVIEW
// ============================================================

// Generate a shareable link
function generateShareableLink(profile) {
  const baseUrl = window.location.origin + window.location.pathname;
  
  // Create a clean share data object
  const shareData = {
    id: profile.id,
    surname: profile.surname,
    age: calcAge(profile.dob),
    height: profile.height,
    education: profile.education,
    occupation: profile.occupation,
    caste: profile.caste,
    community: profile.community,
    diet: profile.diet,
  };
  
  try {
    const jsonString = JSON.stringify(shareData);
    const encodedData = btoa(encodeURIComponent(jsonString));
    return `${baseUrl}?share=${encodedData}`;
  } catch (error) {
    console.error('Error generating share link:', error);
    return `${baseUrl}?profileId=${encodeURIComponent(profile.id)}`;
  }
}

// Get the best image URL for WhatsApp preview
function getWhatsAppImageUrl(profile) {
  // Use the first photo if available
  if (profile.photos && profile.photos.length > 0) {
    let imageUrl = profile.photos[0].src;
    
    // Make sure it's a direct image URL
    // Remove any query parameters that might break WhatsApp preview
    if (imageUrl.includes('?')) {
      const urlParts = imageUrl.split('?');
      imageUrl = urlParts[0];
    }
    
    // Add parameters for better preview
    // For Unsplash, add specific params
    if (imageUrl.includes('unsplash.com')) {
      imageUrl = `${imageUrl}?w=600&h=800&fit=crop&crop=center`;
    }
    
    return imageUrl;
  }
  return null;
}

// Format profile for WhatsApp with proper image preview
function formatProfileForWhatsApp(profile) {
  const age = calcAge(profile.dob);
  const shareLink = generateShareableLink(profile);
  const imageUrl = getWhatsAppImageUrl(profile);
  
  let message = '';
  
  // IMPORTANT: Put image URL on its own line at the very top
  // WhatsApp will automatically show a preview
  if (imageUrl) {
    message += `${imageUrl}\n\n`;
  }
  
  // Now add all the details
  message += `🔹 *${profile.id} - ${profile.surname} Family*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  
  message += `👤 ${profile.surname} ${profile.sex === 'Male' ? 'Son' : 'Daughter'}\n`;
  message += `🎂 ${age} years\n`;
  message += `📏 ${profile.height}\n`;
  message += `🎓 ${profile.education}\n`;
  message += `💼 ${profile.occupation}\n`;
  message += `🏛️ ${profile.caste}\n`;
  message += `🌍 ${profile.community}`;
  
  if (profile.diet) {
    message += `\n🍽️ ${profile.diet}`;
  }
  
  // Add family details if available
  if (profile.family) {
    message += `\n\n👨‍👩‍👧‍👦 *Family Details*\n`;
    message += `━━━━━━━━━━━━━━━━━\n`;
    if (profile.family.fatherName) {
      message += `👨 Father: ${profile.family.fatherName}\n`;
    }
    if (profile.family.motherName) {
      message += `👩 Mother: ${profile.family.motherName}\n`;
    }
    if (profile.family.familyType) {
      message += `🏠 ${profile.family.familyType}\n`;
    }
    if (profile.family.familyValues) {
      message += `💝 ${profile.family.familyValues}`;
    }
  }
  
  // Add expectations summary if available
  if (profile.expectations) {
    message += `\n\n🎯 *Looking For*\n`;
    message += `━━━━━━━━━━━━━━━\n`;
    if (profile.expectations.ageRange) {
      message += `📅 ${profile.expectations.ageRange}\n`;
    }
    if (profile.expectations.education) {
      message += `🎓 ${profile.expectations.education}\n`;
    }
    if (profile.expectations.occupation) {
      message += `💼 ${profile.expectations.occupation}`;
    }
  }
  
  // Add the share link at the end
  message += `\n\n🔗 *View Full Profile*\n`;
  message += `${shareLink}`;
  
  return message;
}

// Share on WhatsApp
function shareOnWhatsApp(profile) {
  const text = formatProfileForWhatsApp(profile);
  const encodedText = encodeURIComponent(text);
  const whatsappUrl = `https://wa.me/?text=${encodedText}`;
  
  // Open WhatsApp in a new window
  window.open(whatsappUrl, '_blank');
}

// Copy share link
function copyShareLink(profile) {
  const link = generateShareableLink(profile);
  navigator.clipboard.writeText(link).then(() => {
    alert('Share link copied to clipboard!');
  }).catch(() => {
    const textArea = document.createElement('textarea');
    textArea.value = link;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    alert('Share link copied to clipboard!');
  });
}

// Share with image via WhatsApp - using data URI for better preview
function shareWithEnhancedImage(profile) {
  if (!profile.photos || profile.photos.length === 0) {
    shareOnWhatsApp(profile);
    return;
  }
  
  const age = calcAge(profile.dob);
  const shareLink = generateShareableLink(profile);
  const imageUrl = getWhatsAppImageUrl(profile);
  
  // Create a more visual message
  let message = '';
  
  // Add image URL with clean formatting
  if (imageUrl) {
    // Add the image URL first - WhatsApp will show preview
    message += `${imageUrl}\n\n`;
  }
  
  // Add a brief but comprehensive summary
  message += `🌟 *${profile.id} - ${profile.surname} Family*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `\n`;
  message += `👤 ${profile.surname} ${profile.sex === 'Male' ? 'Son' : 'Daughter'}\n`;
  message += `📅 ${age} years\n`;
  message += `📏 ${profile.height}\n`;
  message += `🎓 ${profile.education}\n`;
  message += `💼 ${profile.occupation}\n`;
  message += `🏛️ ${profile.caste}\n`;
  message += `🌍 ${profile.community}\n`;
  
  if (profile.diet) {
    message += `🍽️ ${profile.diet}\n`;
  }
  
  // Quick family info
  if (profile.family && profile.family.familyType) {
    message += `🏠 ${profile.family.familyType}\n`;
  }
  
  // Quick expectations
  if (profile.expectations && profile.expectations.ageRange) {
    message += `🎯 Seeking: ${profile.expectations.ageRange}\n`;
  }
  
  message += `\n`;
  message += `🔗 *View Complete Profile:*\n`;
  message += `${shareLink}`;
  
  const encodedText = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/?text=${encodedText}`;
  window.open(whatsappUrl, '_blank');
}

// Share using Web Share API (mobile)
function shareViaNativeShare(profile) {
  const shareLink = generateShareableLink(profile);
  const imageUrl = getWhatsAppImageUrl(profile);
  
  const shareData = {
    title: `${profile.id} - ${profile.surname} Family`,
    text: `Check out this profile: ${profile.surname} ${profile.sex === 'Male' ? 'Son' : 'Daughter'} - ${calcAge(profile.dob)} years`,
    url: imageUrl || shareLink,
  };
  
  if (navigator.share) {
    navigator.share(shareData).catch(() => {
      // Fallback to regular share
      shareOnWhatsApp(profile);
    });
  } else {
    shareOnWhatsApp(profile);
  }
}

// Function to share with a generated thumbnail
function shareWithGeneratedThumbnail(profile) {
  // If you have a server that can generate thumbnails
  // You would call your API here
  // For now, fallback to enhanced image share
  shareWithEnhancedImage(profile);
}

const DEFAULT_PROFILE = {
  id: "MB113134",
  surname: "KACHOLE",
  caste: "96 Kuli Maratha",
  community: "Marathi",
  verified: true,
  photos: [
    { 
      src: "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20width%3D'400'%20height%3D'400'%3E%3Crect%20width%3D'400'%20height%3D'400'%20fill%3D'%23fdf3da'%2F%3E%3Ccircle%20cx%3D'200'%20cy%3D'160'%20r%3D'80'%20fill%3D'%237a1224'%2F%3E%3Cpath%20d%3D'M60%20400c0-90%2064-150%20140-150s140%2060%20140%20150z'%20fill%3D'%237a1224'%2F%3E%3C%2Fsvg%3E", 
      alt: "Profile photo 1",
      caption: "Professional portrait"
    },
    { 
      src: "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20width%3D'400'%20height%3D'400'%3E%3Crect%20width%3D'400'%20height%3D'400'%20fill%3D'%23fdf3da'%2F%3E%3Ccircle%20cx%3D'200'%20cy%3D'160'%20r%3D'80'%20fill%3D'%237a1224'%2F%3E%3Cpath%20d%3D'M60%20400c0-90%2064-150%20140-150s140%2060%20140%20150z'%20fill%3D'%237a1224'%2F%3E%3C%2Fsvg%3E", 
      alt: "Profile photo 2",
      caption: "Casual photo"
    },
    { 
      src: "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20width%3D'400'%20height%3D'400'%3E%3Crect%20width%3D'400'%20height%3D'400'%20fill%3D'%23fdf3da'%2F%3E%3Ccircle%20cx%3D'200'%20cy%3D'160'%20r%3D'80'%20fill%3D'%237a1224'%2F%3E%3Cpath%20d%3D'M60%20400c0-90%2064-150%20140-150s140%2060%20140%20150z'%20fill%3D'%237a1224'%2F%3E%3C%2Fsvg%3E", 
      alt: "Profile photo 3",
      caption: "Formal attire"
    },
  ],
  dob: "02/11/1991",
  sex: "Male",
  height: "5' 07\"",
  education: "MBA Marketing",
  occupation: "Asst. Manager – Kalyani Technoforge Ltd, Pune / 10 LAC PA",
  bloodGroupWeight: "A+ / 71 KG",
  spectacleLens: "No / No",
  complexion: "Nimgora",
  gotraDevak: "Kashyap / Sun",
  birthPlace: "Pune, 05:10 PM",
  mangal: "No",
  diet: "Vegetarian",
  family: {
    fatherName: "Shri. Ramchandra Kachole",
    fatherOccupation: "Retired Government Officer",
    motherName: "Smt. Savita Kachole",
    motherOccupation: "Homemaker",
    brothers: "1 (Elder, Married)",
    sisters: "1 (Younger, Married)",
    familyType: "Nuclear Family",
    familyValues: "Traditional, Family-oriented",
    familyStatus: "Upper Middle Class",
    ancestralOrigin: "Satara, Maharashtra",
    familyLanguage: "Marathi, Hindi, English",
    additionalInfo: "Close-knit family with strong cultural values."
  },
  expectations: {
    ageRange: "27-32 years",
    heightRange: "5' 4\" - 5' 8\"",
    education: "Graduate or Postgraduate",
    occupation: "Working Professional",
    incomeRange: "5-10 LPA",
    caste: "Maratha / Kshatriya preferred",
    religion: "Hindu",
    location: "Maharashtra, Pune/Mumbai",
    maritalStatus: "Never Married",
    familyValues: "Family-oriented, Respectful",
    dietaryPreferences: "Vegetarian preferred",
    language: "Marathi, Hindi, English",
    preferences: [
      "Friendly and Understanding",
      "Career-oriented",
      "Family values",
      "Respects elders",
      "Good communication skills"
    ],
    additionalInfo: "Looking for a supportive life partner."
  }
};

// Main Component
export default function ProfileDetails({
  profile = DEFAULT_PROFILE,
  watermarkText = "शुभ विवाह",
  onBack,
  onExpressInterest,
  isLoggedIn = false,
}) {
  const [activePhoto, setActivePhoto] = useState(0);
  const [shortlisted, setShortlisted] = useState(false);
  const [notice, setNotice] = useState("");
  const [showSlider, setShowSlider] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const photos = profile.photos?.length ? profile.photos : [];
  const age = useMemo(() => calcAge(profile.dob), [profile.dob]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedData = urlParams.get('share');
    if (sharedData) {
      try {
        const decoded = JSON.parse(decodeURIComponent(atob(sharedData)));
        console.log('Shared profile data:', decoded);
      } catch (error) {
        console.error('Error decoding shared data:', error);
      }
    }
  }, []);

  function showPhoto(delta) {
    if (!photos.length) return;
    setActivePhoto((i) => (i + delta + photos.length) % photos.length);
  }

  function handleExpressInterest() {
    if (!isLoggedIn) {
      setNotice("Please login first.");
      setTimeout(() => setNotice(""), 3000);
      return;
    }
    onExpressInterest?.(profile);
    setNotice("Your interest has been sent.");
    setTimeout(() => setNotice(""), 3000);
  }

  function openSlider(index) {
    setActivePhoto(index);
    setShowSlider(true);
    document.body.style.overflow = 'hidden';
  }

  function closeSlider() {
    setShowSlider(false);
    document.body.style.overflow = 'auto';
  }

  return (
    <div className="min-h-screen w-full bg-[#FBF3DC] px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#7A2238] hover:text-[#3F0E1C] transition mb-5"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to search results
        </button>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-serif text-3xl font-bold text-[#3F0E1C]">
                {profile.id} ({profile.surname})
              </h1>
              {profile.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#3F0E1C]/8 px-2.5 py-1 text-[11px] font-semibold text-[#7A2238]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified
                </span>
              )}
            </div>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <span className="rounded-full bg-[#D4A017]/15 border border-[#D4A017]/40 px-3 py-1 text-xs font-semibold text-[#B8860B]">
                {profile.caste}
              </span>
              <span className="rounded-full bg-[#D4A017]/15 border border-[#D4A017]/40 px-3 py-1 text-xs font-semibold text-[#B8860B]">
                {profile.community}
              </span>
              {profile.diet && (
                <span className="rounded-full bg-[#D4A017]/15 border border-[#D4A017]/40 px-3 py-1 text-xs font-semibold text-[#B8860B]">
                  {profile.diet}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => setShortlisted((s) => !s)}
              aria-pressed={shortlisted}
              className="grid place-items-center w-11 h-11 rounded-full bg-white border border-[#D4A017]/40 text-[#7A2238] hover:bg-[#FBF3DC] active:scale-95 transition"
            >
              <Heart className="w-5 h-5" fill={shortlisted ? "#7A2238" : "none"} />
            </button>
            
            <button
              type="button"
              onClick={handleExpressInterest}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#5C1B2E] to-[#7A2238] px-5 py-2.5 font-semibold text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition"
            >
              {!isLoggedIn && <Lock className="w-4 h-4" />}
              Express Interest
            </button>

            {/* Share Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowShareOptions(!showShareOptions)}
                className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-5 py-2.5 font-semibold text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>

              {showShareOptions && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-[#D4A017]/20 overflow-hidden z-20">
                  <div className="p-2">
                    <button
                      onClick={() => {
                        shareOnWhatsApp(profile);
                        setShowShareOptions(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#FBF3DC] rounded-lg transition text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center flex-shrink-0">
                        <Share2 className="w-5 h-5 text-[#25D366]" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[#3F0E1C]">Share on WhatsApp</div>
                        <div className="text-xs text-[#6B4A52]">Share with image preview</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        shareWithEnhancedImage(profile);
                        setShowShareOptions(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#FBF3DC] rounded-lg transition text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#D4A017]/10 flex items-center justify-center flex-shrink-0">
                        <Image className="w-5 h-5 text-[#B8860B]" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[#3F0E1C]">Share with Image</div>
                        <div className="text-xs text-[#6B4A52]">Better image preview</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        copyShareLink(profile);
                        setShowShareOptions(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#FBF3DC] rounded-lg transition text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#3F0E1C]/10 flex items-center justify-center flex-shrink-0">
                        <Copy className="w-5 h-5 text-[#7A2238]" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[#3F0E1C]">Copy Link</div>
                        <div className="text-xs text-[#6B4A52]">Copy to clipboard</div>
                      </div>
                    </button>

                    {navigator.share && (
                      <button
                        onClick={() => {
                          shareViaNativeShare(profile);
                          setShowShareOptions(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#FBF3DC] rounded-lg transition text-left"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#D4A017]/10 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-5 h-5 text-[#B8860B]" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-[#3F0E1C]">Native Share</div>
                          <div className="text-xs text-[#6B4A52]">Use system share</div>
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {notice && (
          <div
            role="status"
            className="mb-6 inline-flex items-center gap-2 rounded-lg bg-[#3F0E1C]/8 px-4 py-2 text-sm font-medium text-[#7A2238]"
          >
            {notice}
          </div>
        )}

        <div className="grid lg:grid-cols-[400px_1fr] gap-6 relative">
          <div className="lg:sticky lg:top-6 self-start h-fit max-h-[calc(100vh-3rem)] overflow-y-auto">
            <div className="space-y-4">
              <div className="bg-[#FFFDF7] rounded-2xl shadow-sm border border-[#D4A017]/20 overflow-hidden">
                <div 
                  className="relative aspect-[3/4] bg-gradient-to-br from-[#3F0E1C]/10 to-[#D4A017]/10 cursor-pointer hover:opacity-95 transition"
                  onClick={() => photos.length > 0 && openSlider(activePhoto)}
                >
                  {photos.length ? (
                    <img
                      src={photos[activePhoto].src}
                      alt={photos[activePhoto].alt || `${profile.id} photo`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[#7A2238]/50">
                      <User className="w-20 h-20" />
                      <span className="text-sm font-medium">No photo available</span>
                    </div>
                  )}

                  {photos.length > 0 && (
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition flex items-center justify-center opacity-0 hover:opacity-100">
                      <div className="bg-white/90 rounded-full p-3 shadow-lg">
                        <Maximize2 className="w-6 h-6 text-[#7A2238]" />
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.12]">
                    <div className="absolute inset-0 flex flex-wrap content-center justify-center -rotate-[30deg] gap-8 text-[#3F0E1C] text-sm font-bold whitespace-nowrap">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <span key={i}>{watermarkText}</span>
                      ))}
                    </div>
                  </div>

                  {photos.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          showPhoto(-1);
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 grid place-items-center w-10 h-10 rounded-full bg-white/85 text-[#3F0E1C] hover:bg-white transition shadow-lg"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          showPhoto(1);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center w-10 h-10 rounded-full bg-white/85 text-[#3F0E1C] hover:bg-white transition shadow-lg"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <span className="absolute bottom-2 right-2 rounded-full bg-[#3F0E1C]/80 text-white text-xs px-3 py-1">
                        {activePhoto + 1}/{photos.length}
                      </span>
                    </>
                  )}
                </div>

                {photos.length > 1 && (
                  <div className="flex gap-2 p-4 overflow-x-auto">
                    {photos.map((p, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActivePhoto(i)}
                        onDoubleClick={() => openSlider(i)}
                        className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                          i === activePhoto
                            ? "border-[#D4A017]"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img src={p.src} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {age && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#D4A017]/30 px-3 py-1.5 text-xs font-semibold text-[#3F0E1C]">
                    <Cake className="w-3.5 h-3.5 text-[#B8860B]" />
                    {age} years
                  </span>
                )}
                {profile.height && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#D4A017]/30 px-3 py-1.5 text-xs font-semibold text-[#3F0E1C]">
                    <Ruler className="w-3.5 h-3.5 text-[#B8860B]" />
                    {profile.height}
                  </span>
                )}
                {profile.education && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#D4A017]/30 px-3 py-1.5 text-xs font-semibold text-[#3F0E1C]">
                    <GraduationCap className="w-3.5 h-3.5 text-[#B8860B]" />
                    {profile.education}
                  </span>
                )}
                {profile.occupation && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#D4A017]/30 px-3 py-1.5 text-xs font-semibold text-[#3F0E1C]">
                    <Briefcase className="w-3.5 h-3.5 text-[#B8860B]" />
                    Working Professional
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-5 overflow-y-auto max-h-[calc(100vh-3rem)] pb-4">
            <Section
              icon={User}
              title="Personal Information"
              fields={[
                { label: "Date of Birth", value: profile.dob, icon: Cake },
                { label: "Age", value: age ? `${age} years` : null, icon: Clock },
                { label: "Gender", value: profile.sex, icon: User },
                { label: "Height", value: profile.height, icon: Ruler },
                { label: "Caste", value: profile.caste, icon: UsersIcon },
                { label: "Complexion", value: profile.complexion, icon: Sparkles },
                { label: "Blood Group / Weight", value: profile.bloodGroupWeight, icon: HeartHandshake },
                { label: "Spectacles / Lens", value: profile.spectacleLens, icon: BookOpen },
                { label: "Mangal", value: profile.mangal, icon: Star },
                { label: "Diet", value: profile.diet, icon: Sparkles },
                { label: "Birth Place", value: profile.birthPlace, icon: MapPin },
                { label: "Gotra & Devak", value: profile.gotraDevak, icon: Home },
              ]}
            />

            <Section
              icon={Briefcase}
              title="Education & Career"
              fields={[
                { label: "Education", value: profile.education, icon: GraduationCap },
                { label: "Occupation", value: profile.occupation, icon: Briefcase },
              ]}
            />

            <FamilyBackground family={profile.family} />
            <Expectations expectations={profile.expectations} />

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => setShortlisted((s) => !s)}
                className={`flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-medium transition ${
                  shortlisted
                    ? 'bg-[#7A2238] text-white'
                    : 'bg-white border border-[#D4A017]/40 text-[#7A2238] hover:bg-[#FBF3DC]'
                }`}
              >
                <Heart className="w-4 h-4" fill={shortlisted ? "white" : "none"} />
                {shortlisted ? 'Shortlisted' : 'Add to Shortlist'}
              </button>
              
              <button
                onClick={handleExpressInterest}
                className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#5C1B2E] to-[#7A2238] px-4 py-2.5 font-semibold text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition"
              >
                {!isLoggedIn && <Lock className="w-4 h-4" />}
                Express Interest
              </button>

              <button
                onClick={() => shareOnWhatsApp(profile)}
                className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 font-semibold text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {showSlider && photos.length > 0 && (
        <PhotoSlider
          photos={photos}
          activeIndex={activePhoto}
          onClose={closeSlider}
          onPrevious={() => showPhoto(-1)}
          onNext={() => showPhoto(1)}
        />
      )}
    </div>
  );
}