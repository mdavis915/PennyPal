import React, { useState, useEffect } from "react";
import "../App.css";

const CoinDrop = ({ trigger }) => {
  const [coins, setCoins] = useState([]);

  const dropCoins = () => {
    if (!trigger) return;

    const numCoins = 6; // More coins for better effect
    const newCoins = Array.from({ length: numCoins }).map((_, index) => ({
      id: index,
      left: (index / numCoins) * 100, // Evenly space across width
      delay: Math.random() * 0.5, // Randomized slight delay for realism
      rotation: Math.random() * 360, // Rotate randomly
    }));

    setCoins(newCoins);

    // Remove coins after animation completes (set slightly longer than CSS duration)
    setTimeout(() => setCoins([]), 3000);
  };

  useEffect(() => {
    if (trigger) {
      dropCoins();
    }
  }, [trigger]);

  return (
    <div className="coin-container">
      {coins.map((coin) => (
        <div
          key={coin.id}
          className="coin"
          style={{
            left: `${coin.left}%`,
            animationDelay: `${coin.delay}s`,
            transform: `rotate(${coin.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
};

export default CoinDrop;
