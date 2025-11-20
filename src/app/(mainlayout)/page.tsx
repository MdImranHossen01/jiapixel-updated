import { lazy, Suspense } from 'react';
import Banner from "./components/banner/Banner";

// Group components that appear together
const MainContent = lazy(() => import("./components/MainContent"));

// Loading component
const LoadingFallback = () => (
  <div className="min-h-[400px] flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const HomePage = () => {
  return (
    <div>
      {/* Banner is critical - load immediately */}
      <Banner/>
      
      {/* Lazy load the rest of the content */}
      <Suspense fallback={<LoadingFallback />}>
        <MainContent />
      </Suspense>
    </div>
  );
};

export default HomePage;