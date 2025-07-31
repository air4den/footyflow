"use client"; 
import { Button } from "@radix-ui/themes";

export default function Home() {
  return (
    <section className="w-full px-4" >
      <div className="my-4 relative flex flex-col items-center justify-center gap-6 h-[75vh] bg-[url('/espanyol_gol_wide.jpg')] bg-cover bg-bottom rounded-2xl overflow-hidden">
        <h1 className="py-0 text-7xl sm:text-8xl md:text-[10vw] font-extrabold text-white m-0 leading-none">
          JogaFlo
        </h1>
        <h2 className="text-3xl text-white font-bold text-center px-4">
          Turn your activities into football heatmaps.
        </h2>
        <Button 
          className="px-4 py-2 bg-strorange text-3xl text-white font-bold rounded-lg hover:bg-orange-700 hover:bg-opacity-80"
          onClick={() => { window.location.href = "/create"; }}
        >
          Create New Heatmap
        </Button>
      </div>
      
      <div className="my-24">
        <h3 className="text-4xl font-bold text-center mb-16">How It Works</h3>
        
        <div className="mx-auto max-w-4xl">
          {/* Step 1 */}
          <div className="flex flex-col lg:flex-row gap-8 items-start mb-16">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  1
                </div>
                <h4 className="text-2xl font-bold">Connect Your Strava</h4>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                Sign in with your Strava account to securely access your running and cycling activities. 
                We only read your activity data - no posting or modifications to your account.
              </p>
            </div>
            <div className="w-full lg:w-64 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Strava Connect Image</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col lg:flex-row gap-8 items-start mb-16">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  2
                </div>
                <h4 className="text-2xl font-bold">Select Your Activity</h4>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                Choose from your recent Strava activities. Pick any run or ride that has GPS data 
                and we'll transform it into a football field heatmap visualization.
              </p>
            </div>
            <div className="w-full lg:w-64 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Activity Selection Image</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col lg:flex-row gap-8 items-start mb-16">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  3
                </div>
                <h4 className="text-2xl font-bold">Generate Heatmap</h4>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our algorithm maps your GPS route onto a football field, creating a beautiful 
                heatmap that shows your movement patterns and intensity across the pitch.
              </p>
            </div>
            <div className="w-full lg:w-64 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Heatmap Generation Image</span>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col lg:flex-row gap-8 items-start mb-16">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  4
                </div>
                <h4 className="text-2xl font-bold">Share & Compare</h4>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                Download your heatmap as an image or share it with friends. Compare different 
                activities to see how your routes and intensity patterns vary over time.
              </p>
            </div>
            <div className="w-full lg:w-64 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Share & Compare Image</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
