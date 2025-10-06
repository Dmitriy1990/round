import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface AnimatedNumberProps {
  to: number;
  duration?: number;
  className?: string;
}

export function AnimatedNumber({ to, duration = 1, className }: AnimatedNumberProps) {
  const counterRef = useRef<HTMLSpanElement | null>(null);
  const prevValue = useRef<number>(to);
  const obj = useRef<{ value: number }>({ value: to });

  useEffect(() => {
    const from = prevValue.current;
    obj.current.value = from;

    if (counterRef.current) counterRef.current.textContent = from.toString();

    gsap.to(obj.current, {
      value: to,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = Math.floor(obj.current.value).toString();
        }
      },
    });

    prevValue.current = to;
  }, [to, duration]);

  return (
    <span ref={counterRef} className={className}>
      {to}
    </span>
  );
}
