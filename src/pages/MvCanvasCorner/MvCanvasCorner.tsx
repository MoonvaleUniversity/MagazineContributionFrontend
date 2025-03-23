import { useState, useEffect } from "react";
import { AiOutlineDownload } from "react-icons/ai";
import { MvModal } from "../../components/MvModal";
import { downloadImage, searchArt } from "../../services/CanvasCornerService";
import { MvLoader } from "../../components/MvLoader";
import { SearchBar } from "../../components/MvSearchbar/MvSearchbar";
import { MvButton } from "../../components/MvButton";
import StudentLayout from "../../layout/StudentLayout";

interface UnsplashImage {
  id: string;
  urls: {
    regular: string;
  };
  links: {
    download_location: string;
  };
  user: {
    name: string;
    portfolio_url: string;
  };
}

export const CanvasCorner = () => {
  const [searchQuery, setSearchQuery] = useState('art');
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<UnsplashImage | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to handle new searches (reset state)
  const handleSearch = async (query: string) => {
    try {
      setIsLoading(true);
      setError('');
      const response = await searchArt(query, 1);
      setImages(response.results);
      setPage(2); // Next page will be 2
      setSearchQuery(query);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch images. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to load more images (pagination)
  const loadMore = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await searchArt(searchQuery, page);
      setImages(prevImages => [...prevImages, ...response.results]);
      setPage(prevPage => prevPage + 1);
    } catch (err) {
      console.error(err);
      setError('Failed to load more images. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleSearch('art'); // Initial load with "art"
  }, []);

  const handleDownload = (image: UnsplashImage) => {
    setSelectedImage(image);
    setIsPolicyOpen(true);
  };

  const confirmDownload = async () => {
    if (!selectedImage) return;

    try {
      // Track download
      await downloadImage(selectedImage.links.download_location);

      // Fetch image as blob
      const response = await fetch(selectedImage.urls.regular);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `artwork-${selectedImage.id}.jpg`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
      setError('Failed to download image. Please try again.');
    } finally {
      setIsPolicyOpen(false);
    }
  };

  return (
    <StudentLayout>
    <div className="max-w-7xl mx-auto p-6 rounded-lg">
      
      <h1 className="text-3xl font-bold text-center mb-6">Canvas Corner</h1>
      <p className="text-center text-gray-600 mb-4">
        Search for artistic inspiration for Moonvale University magazine contributions.
      </p>

      <SearchBar 
        onSearch={handleSearch} 
        initialQuery={searchQuery}
      />

      <MvModal
        isOpen={isPolicyOpen}
        onClose={() => setIsPolicyOpen(false)}
        title="Art Usage Policy"
      >
        <div className="text-gray-700 mb-6">
          By downloading this image, you agree to:
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Use it only for educational/artistic purposes</li>
            <li>Credit the artist when sharing publicly</li>
            <li>Not use it for commercial purposes</li>
            <li>
              Comply with Unsplash's 
              <a 
                href="https://unsplash.com /license" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 ml-1"
              >
                License Agreement
              </a>
            </li>
          </ul>
        </div>
        
        <div className="flex justify-end gap-4">
          <MvButton
            onClick={() => setIsPolicyOpen(false)}
            variant="secondary"
          >
            Cancel
          </MvButton>
          <MvButton
            onClick={confirmDownload}
            variant="primary"
          >
            Accept & Download
          </MvButton>
        </div>
      </MvModal>
  
      {error && (
        <div className="text-red-500 text-center mb-8 p-4 bg-red-50 rounded">
          {error}
        </div>
      )}
  
      {images.length === 0 && !isLoading ? (
        <div className="text-center text-gray-500 py-16">
          No inspiration found. Try searching for something else!
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {images.map((image) => (
              <div 
                key={image.id} 
                className="relative group rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all"
              >
                {image.urls.regular && (
                  <img
                    src={image.urls.regular}
                    alt={`Artwork by ${image.user.name}`}
                    className="w-full h-64 object-cover"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/src/Assets/images/404.jpeg';
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center">
                <MvButton
  onClick={() => handleDownload(image)}
  className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
  variant="accent"
>
  <AiOutlineDownload className="w-6 h-6 mr-2" />
  Download
</MvButton>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-sm text-white">
                    Photo by{' '}
                    <a
                      href={`${image.user.portfolio_url}?utm_source=art_gallery&utm_medium=referral`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:underline"
                    >
                      {image.user.name}
                    </a>
                  </p>
                </div>
              </div>
            ))}
          </div>
  
          {images.length > 0 && (
            <div className="mt-8 flex justify-center">
              <MvButton
                onClick={loadMore}
                disabled={isLoading}
                variant="secondary"
                className="px-8 py-3"
              >
                {isLoading ? 'Loading...' : 'Load More'}
                {isLoading && <MvLoader />}
              </MvButton>
            </div>
          )}
        </>
      )}
    </div></StudentLayout>
  );
};