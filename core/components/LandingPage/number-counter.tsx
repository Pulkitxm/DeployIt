"use client";

import { useState, useEffect } from "react";

export default function NumberIncrement({
  finalNumber = 100,
}: {
  finalNumber?: number;
}) {
  const [number, setNumber] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNumber((prev) => {
        if (prev >= finalNumber) {
          clearInterval(intervalId);
          return prev;
        }
        return prev + 1;
      });
    }, 50);
    return () => clearInterval(intervalId);
  }, [finalNumber]);

  return <>{number}</>;
}
