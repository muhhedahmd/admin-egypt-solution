"use client";

import { useState, useEffect } from "react";
import ContactForm from "./_comp/contact-form";
import Footer from "./_comp/Footer";
import Header from "./_comp/header";
import dynamic from "next/dynamic";
import AchievementsSection from "./_comp/achivements";
import { HeroSection } from "./_comp/Hero";

const SlideShowsDemoPreview = dynamic(
  () =>
    import("./_comp/SlideShows").then((mod) => mod.slideShowsDemoPreview),
  {
    ssr: false,
    loading() {
      return <div>Loading...</div>;
    },
  }
);

// Loading Screen Component
const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  useEffect(()=>{
    if(progress < 100) {
      document.body.style.overflow = "hidden";
    }
    if(progress === 100){
      document.body.style.overflow = "auto";
    }

  } , [progress])

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center">
      <div className="mb-8 animate-pulse">
        <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center shadow-2xl">
          <span className="text-primary-foreground font-bold text-4xl">E</span>
        </div>
      </div>

      <p className="text-muted-foreground mb-8">Please wait while we prepare your experience</p>

      <div className="w-200 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>


      {/* <div className="flex gap-2 mt-8">
        <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
      </div> */}
    </div>
  );
};

const Page = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadedComponents, setLoadedComponents] = useState({
    header: false,
    hero: false,
    slideShows: false,
  });

  // Check if all components are loaded
  useEffect(() => {
    const allLoaded = Object.values(loadedComponents).every((loaded) => loaded);
    
    if (allLoaded) {
      // Add a small delay for smooth transition
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [loadedComponents]);

  const handleComponentLoad = (component: keyof typeof loadedComponents) => {
    setLoadedComponents((prev) => ({
      ...prev,
      [component]: true,
    }));
  };

  return (
    <>
      {/* Loading Screen */}
      {isLoading && <LoadingScreen />}

      {/* Main Content */}
      <div
        className={`w-full transition-opacity duration-500 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        <Header onLoad={() => handleComponentLoad("header")} />
        <HeroSection onLoad={() => handleComponentLoad("hero")} />

        <AchievementsSection/>

        <main className="container mx-auto px-4 py-12">
          <SlideShowsDemoPreview onLoad={() => handleComponentLoad("slideShows")} />
        </main>

        <ContactForm />
        <Footer />
      </div>
    </>
  );
};

export default Page;
