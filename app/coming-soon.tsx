"use client";

import React, { useState } from "react";
import Image from "next/image";

export default function ComingSoonPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // TODO: Connect this to your Neon database via a Server Action
    setSubmitted(true);
    setEmail("");
  };

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4 text-white">
      {/* Background Matching Your Image Design */}
      {/* <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-[#9B51E0] via-[#7F00FF] to-[#E24E42]" /> */}
      <div className="absolute inset-0 -z-10 h-full w-full">
        <Image
          src="/background.svg"
          alt="Page Background"
          fill
          priority
          quality={100}
          className="object-cover object-center"
        />
      </div>

      <div className="mx-auto flex w-full max-w-xl flex-col items-center text-center">
        {/* Nurova Logo Container */}
        <div className=" relative h-100 w-100 select-none">
          <Image
            src="/SVG/nurova2.svg"
            alt="Nurova Logo"
            fill
            priority
            className="object-contain invert brightness-0"
          />
        </div>

        {/* Brand Name Headline */}
        {/* <h1 className="font-lexend text-5xl font-normal lowercase tracking-wide text-white sm:text-6xl md:text-7xl mb-3">
          nurova
        </h1> */}

        {/* Tagline Subtext */}
        <p className="font-grift text-[22px] font-grift tracking-wide text-white sm:text-[28px] mb-8">
          Understanding Minds. Transforming Lives.
        </p>

        {/* Status Callout Banner */}
        <h2 className="font-griftBold text-[30px] font-bold text-white sm:text-[40px] mb-4">
          Launching Soon
        </h2>

        {/* Form Container Matching the Image Pill Style */}
        <div className="w-full max-w-md px-4">
          {!submitted ? (
            <form
              onSubmit={handleSubmit}
              className="relative flex h-12 w-full items-center rounded-full bg-white p-1 shadow-md transition-all"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="font-lexend w-full rounded-full bg-transparent pl-5 pr-28 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
              />
              <button
                type="submit"
                className="font-lexend absolute right-1 top-1 bottom-1 flex items-center justify-center rounded-full bg-[#E24E42] px-6 text-xs font-medium text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.97]"
              >
                Subscribe
              </button>
            </form>
          ) : (
            <div className="rounded-full bg-white/10 border border-white/20 px-6 py-3 backdrop-blur-sm">
              <p className="font-lexend text-sm font-medium text-white">
                ✨ Subscribed! We will keep you updated.
              </p>
            </div>
          )}
        </div>

        {/* Minimal Social Media Links Layout Footer */}
        <div className="mt-12 flex items-center justify-center gap-4">
          {/* LinkedIn Icon */}
          <a
            href="#"
            className="flex h-8 w-8 items-center justify-center rounded-full transition-all hover:bg-white/20"
          >
            <div className="relative h-8 w-8 select-none">
              <Image
                src="/icons/linkedin.svg"
                alt="LinkedIn"
                fill
                className="object-contain brightness-0 invert"
              />
            </div>
          </a>

          {/* Instagram Icon */}
          <a
            href="#"
            className="flex h-8 w-8 items-center justify-center rounded-full transition-all hover:bg-white/20"
          >
            <div className="relative h-8 w-8 select-none">
              <Image
                src="/icons/instagram.svg"
                alt="Instagram"
                fill
                className="object-contain brightness-0 invert"
              />
            </div>
          </a>

          {/* Facebook Icon */}
          <a
            href="#"
            className="flex h-8 w-8 items-center justify-center rounded-full transition-all hover:bg-white/20"
          >
            <div className="relative h-8 w-8 select-none">
              <Image
                src="/icons/facebook.svg"
                alt="Facebook"
                fill
                className="object-contain brightness-0 invert"
              />
            </div>
          </a>
        </div>

      </div>
    </main>
  );
}
