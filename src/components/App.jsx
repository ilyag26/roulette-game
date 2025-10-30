import { useEffect, useRef, useState } from "react";
import "../styles/App.css";
import line from "./../assets/line.png";

function App() {
  const [gifts, setGifts] = useState([]);
  const [displayGifts, setDisplayGifts] = useState([]);
  const [offset, setOffset] = useState(0);
  const offsetRef = useRef(0); 
  const animationRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const ITEM_WIDTH = 80;

  const createGiftsList = () => {
    const images = import.meta.glob("/src/assets/gifts/*.{png,jpg,jpeg,gif}", { eager: true });
    const imageFiles = Object.values(images).map((img) => img.default);

    const giftList = [];
    for (let i = 0; i < 80; i++) {
      const randomIndex = Math.floor(Math.random() * imageFiles.length);
      giftList.push(imageFiles[randomIndex]);
    }
    return giftList;
  };

  useEffect(() => {
    const giftsArray = createGiftsList();
    setGifts(giftsArray);
    setDisplayGifts([...giftsArray, ...giftsArray, ...giftsArray]);
  }, []);

  const animate = (duration, stopCallback) => {
    const start = performance.now();
    const startOffset = offsetRef.current;
    const totalMove = Math.floor(Math.random() * 1000) + 800;

    const step = (timestamp) => {
      const elapsed = timestamp - start;
      let progress = elapsed / duration;
      if (progress > 1) progress = 1;

      const easeProgress = 1 - Math.pow(1 - progress, 3);
      offsetRef.current = startOffset - totalMove * easeProgress;

      const totalWidth = gifts.length * ITEM_WIDTH;

      const logicalOffset = ((-offsetRef.current % totalWidth) + totalWidth) % totalWidth;
      
      const visualOffset = -totalWidth + logicalOffset;
      console.log(visualOffset);
      setOffset(visualOffset);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(step);
      } else {
        stopCallback?.();
      }
    };

    animationRef.current = requestAnimationFrame(step);
  };

  const startGame = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    animate(5000, () => setIsAnimating(false));
  };

  useEffect(() => {
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  return (
    <div className="game-block">
      <div className="bg-rullet">
        <img className="gamble-line" src={line} alt="line" />
        <ul
          className="rulet"
          style={{
            transform: `translateX(${offset}px)`,
            transition: "none",
          }}
        >
          {displayGifts.map((gift, i) => (
            <li key={i}>
              <img src={gift} alt={`gift-${i}`} />
            </li>
          ))}
        </ul>
      </div>

      <hr />
      <button className="button-start" onClick={startGame} disabled={isAnimating}>
        Start
      </button>
    </div>
  );
}

export default App;