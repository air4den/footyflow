"use client"; 
import { Button } from "@radix-ui/themes";

export default function Home() {
  return (
    <section className="w-full px-4" >
      <div className="mb-4 mt-18 relative flex flex-col items-center justify-center gap-6 h-[75vh] bg-[url('/espanyol_gol_wide.jpg')] bg-cover bg-bottom rounded-2xl overflow-hidden">
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
        <h3 className="text-5xl font-bold text-center mb-16">How It Works</h3>
        
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          {/* Step 1 */}
          <div className="flex flex-col lg:flex-row gap-8 items-center mb-16">
            <div className="flex-1 space-y-6">
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-3xl">
                  1
                </div>
                <h4 className="text-2xl font-bold text-center">Ball Out – Track Your Activity</h4>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed text-center">
                When you play football, record your activity with a watch or the Strava app. Upload the activity to the Strava app. 
              </p>
            </div>
            <div className="w-full max-w-96 bg-gray-200 rounded-lg flex items-center justify-center shadow-lg">
              <img src="/step1.jpg" alt="Step 1" className="w-full h-full object-cover rounded-lg" />
            </div>
          </div>
          
          {/* Step 2 */}
          <div className="flex flex-col lg:flex-row gap-8 items-center mb-16">
            <div className="flex-1 space-y-6">
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-3xl">
                  2
                </div>
                <h4 className="text-2xl font-bold text-center">Sign in to JogaFlo</h4>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed text-center">
                Click the orange "Sign In" button in the top right corner to sign in to JogaFlo with your Strava account.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col lg:flex-row gap-8 items-center mb-16">
            <div className="flex-1 space-y-6">
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-3xl">
                  3
                </div>
                <h4 className="text-2xl font-bold text-center">Create a New Heatmap</h4>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed text-center">
                Select the activity you want to use and click "Create Heatmap".
              </p>
            </div>
            <div className="w-full max-w-96 bg-gray-200 rounded-lg flex items-center justify-center shadow-lg">
              <img src="/step3.png" alt="Step 3" className="w-full h-full object-cover rounded-lg" />
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col lg:flex-row gap-8 items-center mb-16">
            <div className="flex-1 space-y-6">
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-3xl">
                  4
                </div>
                <h4 className="text-2xl font-bold text-center">Edit Heatmap</h4>
              </div>
              <ul className="text-lg w-full md:w-lg text-gray-700 pl-12 items-center justify-center" style={{ listStyleType: 'disc'}}>
                <li>Toggle satelite and Open Street Map map tiles</li>
                <li>Zoom map in and out</li>
                <li>Show/hide the field overlay</li>
                <li>Show/hide heatmap overflow ouside the field overlay</li>
                <li>Adjust the rotation, position, and size of the field overlay</li>
                <li>Interpolation Distance — granularity of heatmap points</li>
                <li>Heatmap Radius — the radius of each point in the heatmap</li>
              </ul>
            </div>
            <div className="w-auto max-w-2xl bg-gray-200 rounded-lg flex items-center justify-center shadow-lg">
              <img src="/step4.png" alt="Step 4" className="w-full h-full object-cover rounded-lg" />
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex flex-col lg:flex-row gap-8 items-center mb-16">
            <div className="flex-1 space-y-6">
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-3xl">
                  5
                </div>
                <h4 className="text-2xl font-bold text-center">Save Heatmap</h4>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed text-center">
                Click "Capture Heatmap" to save the heatmap as a png image.
              </p>
            </div>
            <div className="h-24 max-h-24 bg-gray-200 rounded-lg flex items-center justify-center shadow-lg">
              <img src="/step5.png" alt="Step 5" className="w-full h-full object-cover rounded-lg" />
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
