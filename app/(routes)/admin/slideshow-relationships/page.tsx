"use client";

import ContactForm from "./_comp/contact-form";
import Footer from "./_comp/Footer";
import Header from "./_comp/header";
import HeroSection from "./_comp/Hero";

import dynamic from "next/dynamic";


const SlideShowsDemoPreview = dynamic(
  () =>
    import(
      "./_comp/SlideShows"
    ).then((mod) => mod.slideShowsDemoPreview),
  { ssr: false }
);

const Page = () => {

  return (
    <div>

      <Header />
      <HeroSection />

      <main className=" container mx-auto px-4 py-12">
        {/* Initial Loading State */}
        <SlideShowsDemoPreview/>

      </main>

      <ContactForm />
      <Footer />
    </div>

  )
}

export default Page;




// {isLoading && allSlides.length === 0 ? (
//           <div className="space-y-8">
//             {[...Array(3)].map((_, i) => (
//               <div
//                 key={i}
//                 className=" rounded-lg shadow-sm overflow-hidden"
//               >
//                 <div className="h-20  animate-pulse" />
//                 <div className="p-6 space-y-4">
//                   <div className="h-96 animate-pulse rounded" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <>
//             {/* Slideshows Grid */}

//           </>
// {/* Empty State */}
// {!isLoading && allSlides.length === 0 && (
//   <div className="text-center py-16">
//     <p className=" text-lg">No slideshows available</p>
//   </div>
// )}

// {/* Load More Trigger */}
// {hasMore && (
//   <div ref={observerTarget} className="h-10 flex items-center justify-center mt-12">
//     {isLoadingMore && (
//       <div className="flex items-center gap-2">
//         <div className="w-2 h-2 bg-muted rounded-full animate-bounce" />
//         <div className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
//         <div className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
//       </div>
//     )}
//   </div>
// )}

// {/* End of List */}
// {!hasMore && allSlides.length > 0 && (
//   <div className="text-center py-12">
//     <p className="text-muted-foreground">You've reached the end</p>
//   </div>
// )}