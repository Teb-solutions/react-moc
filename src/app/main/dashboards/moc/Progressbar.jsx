import React, { useState, useEffect } from "react";

const CircleProgress = ({ progressbar }) => {
  const [progress, setProgress] = useState(progressbar);
  const radius = 50;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    const incrementProgress = () => {
      if (progress < 100) {
        setProgress(progress + 1);
      }
    };

    const interval = setInterval(incrementProgress);

    return () => clearInterval(interval);
  }, [progress]);

  return (
    <svg
      height={120}
      width={120}
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="outer-linear" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="5%" stopColor="#4882c2" stopOpacity="1" />
          <stop offset="95%" stopColor="#53a9ff" stopOpacity="1" />
        </linearGradient>
      </defs>
      <circle
        cx="60"
        cy="60"
        r={normalizedRadius}
        fill="none"
        stroke="#e7e8ea"
        strokeWidth={stroke}
      />
      <path
        d={`M 60 10
                    A 50 50 0 1 1 59.99 10`}
        stroke="url(#outer-linear)"
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
      />
      <text
        x="60"
        y="60"
        textAnchor="middle"
        alignmentBaseline="middle"
        fill="#444444"
      >
        <tspan x="60" dy="-0.18em" fontSize="20" fontWeight="normal">
          {progressbar}
        </tspan>
        <tspan fontSize="10" fontWeight="normal">
          %
        </tspan>
        <tspan
          x="60"
          dy="0.82em"
          fontSize="10"
          fontWeight="normal"
          fill="#A9A9A9"
        >
          progress
        </tspan>
      </text>
    </svg>
  );
};

export default CircleProgress;
