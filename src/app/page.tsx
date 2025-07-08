"use client"; 
import { Button } from "@radix-ui/themes";

export default function Home() {
  return (
    <section className="w-full px-4" >
      <div className="my-4 relative flex flex-col items-center justify-center gap-6 h-[75vh] bg-[url('/espanyol_gol_wide.jpg')] bg-cover bg-bottom rounded-2xl overflow-hidden">
        <h1 className="py-0 text-[10vw] font-extrabold text-white m-0 leading-none">
            FootyFlow
        </h1>
        <h2 className="text-3xl text-white font-bold">
          Turn your activities into football heatmaps.
        </h2>
        <Button 
          className="px-4 py-2 bg-strorange text-3xl text-white font-bold rounded-lg hover:bg-orange-700 hover:bg-opacity-80"
          onClick={() => { window.location.href = "/profile"; }}
        >
          Get Started
        </Button>
      </div>
      <div className="my-64 text-center">
        <h3 className="text-2xl font-bold mb-4">Hello world</h3>
      </div>
    </section>
  );
}
