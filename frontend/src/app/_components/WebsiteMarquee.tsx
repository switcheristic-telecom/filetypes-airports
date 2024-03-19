import React, { useCallback } from "react";
import type { Airport } from "@/utils/airport";
import type { MapViewState } from "@/lib/map-config";
import { cn } from "@/lib/utils";
interface WebsiteMarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  customTitle?: string;
}

const WebsiteMarquee = ({ customTitle, className }: WebsiteMarqueeProps) => {
  return (
    <div
      className={cn(
        "absolute top-0 z-20 w-screen cursor-pointer font-bitmap",
        "shadow-inner shadow-orange-200",
        "bg-black text-white",
        className,
      )}
    >
      <>
        <div className="relative flex flex-row overflow-x-hidden">
          <div className="animate-marquee whitespace-nowrap">
            <ContentSpans customTitle={customTitle} />
            <ContentSpans customTitle={customTitle} />

            <span className="hidden 3xl:inline">
              <ContentSpans customTitle={customTitle} />
              <ContentSpans customTitle={customTitle} />
            </span>
          </div>

          <div className="absolute top-0 z-10 animate-marquee2 whitespace-nowrap ">
            <ContentSpans customTitle={customTitle} />
            <ContentSpans customTitle={customTitle} />
            <span className="hidden 3xl:inline">
              <ContentSpans customTitle={customTitle} />
              <ContentSpans customTitle={customTitle} />
            </span>
          </div>
        </div>
      </>
    </div>
  );
};

interface ContentSpansProps {
  customTitle?: string;
}

function ContentSpans({ customTitle }: ContentSpansProps) {
  return (
    <span className="led-text-glow-red bg-black font-led text-2xl font-light text-red-400">
      {[1, 1, 1, 1].map((_, i) => (
        <span key={i} className="  px-4 ">
          This website is a work in progress
        </span>
      ))}
    </span>
  );
}

export default WebsiteMarquee;
