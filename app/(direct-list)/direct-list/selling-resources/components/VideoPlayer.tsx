// ABOUTME: HTML5 video player for selling resource pages
// ABOUTME: Renders responsive video with poster image from Supabase storage

import { assetUrl } from '../resources';

interface VideoPlayerProps {
  fileName: string;
  posterFileName?: string;
  title: string;
}

export function VideoPlayer({ fileName, posterFileName, title }: VideoPlayerProps) {
  return (
    <video
      controls
      preload="metadata"
      poster={posterFileName ? assetUrl(posterFileName) : undefined}
      className="w-full rounded-xl"
      aria-label={title}
    >
      <source src={assetUrl(fileName)} type="video/mp4" />
      Your browser does not support the video element.
    </video>
  );
}
