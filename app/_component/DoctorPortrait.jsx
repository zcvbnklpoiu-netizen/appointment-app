"use client";

import { useState } from "react";
import Image from "next/image";
import { publicImage } from "@/lib/public-image";

export default function DoctorPortrait({ src, alt, ...props }) {
  const sourceKey = typeof src === "string" ? src : "";
  const [failedSource, setFailedSource] = useState("");

  return <Image
    {...props}
    src={failedSource === sourceKey ? publicImage("") : publicImage(src)}
    alt={alt}
    onError={() => setFailedSource(sourceKey)}
  />;
}
