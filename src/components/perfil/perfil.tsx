import React from "react";
import "./perfil.css";

interface PerfillProps {
  title: string;
  subtitle: string;
  avatarUrl: string;
  description: string;
}

function Perfill({ title, subtitle, avatarUrl, description }: PerfillProps) {
  return (
    <div className="card">
      <div className="card__img">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="450">
          <rect fill="#ffffff" width="100%" height="100%"></rect>
          <defs>
            <linearGradient
              id="a"
              gradientUnits="userSpaceOnUse"
              x1="0"
              x2="0"
              y1="0"
              y2="100%"
              gradientTransform="rotate(222,648,379)"
            >
              <stop offset="0" stopColor="#ffffff"></stop>
              <stop offset="1" stopColor="rgb(0, 140, 255)"></stop>
            </linearGradient>
          </defs>
          <rect x="0" y="0" fill="url(#a)" width="100%" height="100%"></rect>
        </svg>
      </div>
      <div className="card__avatar">
        <img src={avatarUrl} alt="Avatar" width="128" height="128" />
      </div>
      <div className="card__title">{title}</div>
      <div className="card__subtitle">{subtitle}</div>
      <div className="card__description">{description}</div>
    </div>
  );
}

export default Perfill;
