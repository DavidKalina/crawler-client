import React from "react";

const NoJobsBanner = () => {
  return (
    <svg
      width="600"
      height="400"
      viewBox="0 0 600 400"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="title desc"
    >
      <title>No Jobs Illustration</title>
      <desc>
        An illustration showing a monitor with &quot;No Jobs&quot; message when there are no jobs.
      </desc>
      <defs>
        <linearGradient id="bg-gradient" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stop-color="#3B82F6" />
          <stop offset="100%" stop-color="#8B5CF6" />
        </linearGradient>
        <filter id="blur-filter" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="15" />
        </filter>
      </defs>

      <rect width="600" height="400" fill="url(#bg-gradient)" />

      <circle cx="100" cy="100" r="60" fill="#60A5FA" opacity="0.3" filter="url(#blur-filter)" />
      <circle cx="500" cy="300" r="80" fill="#C084FC" opacity="0.3" filter="url(#blur-filter)" />

      <g transform="translate(200,120)">
        <rect
          x="0"
          y="0"
          width="200"
          height="140"
          rx="10"
          fill="#1F2937"
          stroke="#374151"
          stroke-width="2"
        />
        <rect x="10" y="10" width="180" height="100" rx="5" fill="#111827" />
        <text
          x="100"
          y="65"
          fill="#9CA3AF"
          font-size="20"
          font-family="sans-serif"
          text-anchor="middle"
        >
          No Jobs
        </text>
        <rect x="90" y="120" width="20" height="20" rx="3" fill="#374151" />
        <path d="M100,140 v30" stroke="#374151" stroke-width="4" stroke-linecap="round" />
      </g>

      <path
        d="M50,370 Q150,330 250,370"
        stroke="#A5B4FC"
        stroke-width="3"
        fill="none"
        opacity="0.5"
      />
      <path d="M350,30 Q450,0 550,30" stroke="#D8B4FE" stroke-width="3" fill="none" opacity="0.5" />
    </svg>
  );
};

export default NoJobsBanner;
