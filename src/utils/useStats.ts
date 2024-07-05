import { useEffect } from "react";
import Stats from "stats.js";

export default function useStats() {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }
  useEffect(() => {
    const stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);
    const animate = () => {
      stats.begin();
      stats.end();
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    return () => {
      document.body.removeChild(stats.dom);
    };
  }, []);
}
