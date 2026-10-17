"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { publicImage } from "@/lib/public-image";

const scenes = [
  { title: "Explore care options", text: "Browse clinician profiles and specialties in one place." },
  { title: "Review the details", text: "See the profile and practice information that has been published." },
  { title: "Choose a time", text: "Review available appointment slots and send a request to the practice." },
];

export default function ScrollVideoExperience() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const [videoUnavailable, setVideoUnavailable] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let frame = 0;
    let metadataReady = false;

    const onMetadata = () => { metadataReady = Number.isFinite(video.duration) && video.duration > 0; };
    video.addEventListener("loadedmetadata", onMetadata);

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && video.preload === "none") video.preload = "metadata";
      if (visible) syncFrame();
    }, { rootMargin: "200px 0px", threshold: 0 });

    function syncFrame() {
      if (!visible || reducedMotion.matches || !metadataReady || frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const bounds = section.getBoundingClientRect();
        const travel = Math.max(1, section.offsetHeight - window.innerHeight);
        const progress = Math.min(1, Math.max(0, -bounds.top / travel));
        const target = progress * video.duration;
        if (Math.abs(video.currentTime - target) > 0.12) video.currentTime = target;
      });
    }

    observer.observe(section);
    window.addEventListener("scroll", syncFrame, { passive: true });
    window.addEventListener("resize", syncFrame, { passive: true });
    reducedMotion.addEventListener?.("change", syncFrame);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", syncFrame);
      window.removeEventListener("resize", syncFrame);
      reducedMotion.removeEventListener?.("change", syncFrame);
      video.removeEventListener("loadedmetadata", onMetadata);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <section ref={sectionRef} className="scroll-story bg-[#263F3A] text-[#F7F3EA]" aria-labelledby="story-title">
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-8">
      <div className="lg:py-14">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#D6C5A7]">A simpler care journey</p>
        <h2 id="story-title" className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">From discovery to appointment request</h2>
        <p className="mt-4 max-w-xl leading-7 text-[#E1E7DF]">MediaBook brings profile information and appointment requests together, with each practice sharing its own details and schedule.</p>
        <div className="mt-9 space-y-7">
          {scenes.map((scene, index) => <article key={scene.title} className="story-scene border-l border-[#B7C9B0]/60 pl-5" style={{ animationDelay: `${index * 90}ms` }}>
            <p className="text-xs font-bold tracking-[0.16em] text-[#D6C5A7]">0{index + 1}</p>
            <h3 className="mt-2 text-lg font-semibold">{scene.title}</h3>
            <p className="mt-1 max-w-md text-sm leading-6 text-[#D4DDD7]">{scene.text}</p>
          </article>)}
        </div>
        <Link href="/explore" className="mt-9 inline-flex rounded-xl bg-[#D6C5A7] px-5 py-3 font-semibold text-[#263F3A] transition hover:bg-[#E4D8C5]">Explore clinicians</Link>
      </div>
      <div className="video-frame self-start overflow-hidden rounded-3xl border border-white/15 bg-[#192D2A] shadow-2xl lg:sticky lg:top-16">
        {videoUnavailable ? <div className="relative aspect-video"><Image src={publicImage("/Hero.png")} alt="Healthcare professional ready to help patients" fill sizes="(max-width: 1024px) 100vw, 55vw" className="object-contain p-8" /><p role="status" className="absolute inset-x-4 bottom-3 rounded-lg bg-[#192D2A]/90 p-3 text-center text-sm text-white">The introduction video could not be loaded. You can still explore the directory.</p></div> : <video ref={videoRef} onError={() => setVideoUnavailable(true)} className="aspect-video w-full object-cover" preload="none" muted playsInline controls poster={publicImage("/Hero.png")} aria-label="MediaBook introduction video">
          <source src={publicImage("/MediaBookIntro.mp4")} type="video/mp4" />
          Your browser cannot play this video. Explore the clinician directory using the link beside it.
        </video>}
        <p className="px-4 py-3 text-xs leading-5 text-[#D4DDD7]">Scroll through this section to move through the video. Use the video controls to play it normally.</p>
      </div>
    </div>
  </section>;
}
