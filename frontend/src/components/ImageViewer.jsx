import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageViewer({ images, index, onClose, setIndex }) {
  if (!images?.length) return null;

  const prev = () => {
    setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  };

  const next = () => {
    setIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-white"
      >
        <X size={28} />
      </button>

      {/* Left */}
      <button
        onClick={prev}
        className="absolute left-5 text-white"
      >
        <ChevronLeft size={40} />
      </button>

      {/* Image */}
      <img
        src={images[index]}
        className="max-h-[80vh] max-w-[90vw] rounded-lg"
      />

      {/* Right */}
      <button
        onClick={next}
        className="absolute right-5 text-white"
      >
        <ChevronRight size={40} />
      </button>
    </div>
  );
}