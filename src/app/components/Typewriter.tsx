"use client"

import React from 'react';
import { TypeAnimation } from 'react-type-animation';

interface TypewriterProps {
  text: string | (string | number)[];
  speed?: number;
  wrapper?: 'p' | 'h1' | 'h2' | 'h3' | 'strong' | 'span';
  className?: string;
  showCursor?: boolean;
}

const Typewriter: React.FC<TypewriterProps> = ({
  text,
  speed = 50,
  wrapper = 'p',
  className,
  showCursor = false,
}) => {
  const sequence = Array.isArray(text) ? text : [text];

  return (
    <TypeAnimation
      sequence={sequence}
      wrapper={wrapper}
      speed={speed as any}
      cursor={showCursor}
      repeat={0}
      className={className}
    />
  );
};

export default Typewriter;