"use client";

import { useState, useEffect } from "react";

export default function NumberIncrement({
  finalNumber = 100,
}: {
  finalNumber?: number;
}) {
  const [number, setNumber] = useState(50);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNumber((prev) => {
        if (prev < 50) return 50;
        else if (prev >= finalNumber) {
          clearInterval(intervalId);
          return prev;
        }
        return prev + 1;
      });
    }, 20);
    return () => clearInterval(intervalId);
  }, [finalNumber]);

  return <>{number}</>;
}
