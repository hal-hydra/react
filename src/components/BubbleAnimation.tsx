// src/components/BubbleAnimation.tsx
import { useEffect, useState } from "react";
import "./BubbleAnimation.css";

interface Bubble {
  id: number;
  size: number;
  left: string;
  top: string;
  animationDuration: string;
  animationDelay: string;
}

const BubbleAnimation: React.FC = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    // Create random bubbles
    const newBubbles: Bubble[] = [];
    const bubbleCount = 8; // Number of floating bubbles

    for (let i = 0; i < bubbleCount; i++) {
      newBubbles.push({
        id: i,
        size: Math.floor(Math.random() * 80) + 40, // Random size between 40-120px
        left: `${Math.floor(Math.random() * 90)}%`, // Random horizontal position
        top: `${Math.floor(Math.random() * 90)}%`, // Random vertical position
        animationDuration: `${Math.floor(Math.random() * 6) + 4}s`, // Random duration between 4-10s
        animationDelay: `${Math.floor(Math.random() * 3)}s`, // Random delay between 0-3s
      });
    }

    setBubbles(newBubbles);
  }, []);

  return (
    <div className="bubble-container">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="animated-bubble"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: bubble.left,
            top: bubble.top,
            animationDuration: bubble.animationDuration,
            animationDelay: bubble.animationDelay,
          }}
        />
      ))}
    </div>
  );
};

export default BubbleAnimation;
