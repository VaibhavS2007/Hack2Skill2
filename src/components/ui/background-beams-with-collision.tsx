import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import React, { useRef, useState, useEffect } from "react";

export const BackgroundBeamsWithCollision = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  const beams = [
    {
      initialX: 10,
      translateX: 10,
      duration: 7,
      repeatDelay: 3,
      delay: 2,
    },
    {
      initialX: 250,
      translateX: 250,
      duration: 4,
      repeatDelay: 4,
      delay: 1,
      className: "h-16",
    },
    {
      initialX: 500,
      translateX: 500,
      duration: 6,
      repeatDelay: 5,
      delay: 3,
    },
    {
      initialX: 750,
      translateX: 750,
      duration: 5,
      repeatDelay: 8,
      delay: 2,
      className: "h-12",
    },
    {
      initialX: 950,
      translateX: 950,
      duration: 8,
      repeatDelay: 3,
      delay: 1,
      className: "h-20",
    },
    {
      initialX: 1150,
      translateX: 1150,
      duration: 4.5,
      repeatDelay: 4,
      delay: 2,
      className: "h-10",
    },
    {
      initialX: 1350,
      translateX: 1350,
      duration: 6.5,
      repeatDelay: 3,
      delay: 4,
      className: "h-14",
    },
    {
      initialX: 1550,
      translateX: 1550,
      duration: 7.5,
      repeatDelay: 5,
      delay: 1,
    },
  ];

  return (
    <div
      ref={parentRef}
      className={cn(
        "min-h-[85vh] relative flex items-center w-full justify-center overflow-hidden bg-slate-950/80 backdrop-blur-sm rounded-3xl border border-slate-800/80 my-4 shadow-[0_0_50px_rgba(0,0,0,0.8)]",
        className
      )}
    >
      {beams.map((beam, idx) => (
        <CollisionMechanism
          key={`${beam.initialX}-${idx}-beam`}
          beamOptions={beam}
          containerRef={containerRef}
          parentRef={parentRef}
        />
      ))}

      {children}
      <div
        ref={containerRef}
        className="absolute bottom-0 bg-transparent w-full inset-x-0 pointer-events-none h-4"
      />
    </div>
  );
};

const CollisionMechanism = React.forwardRef<
  HTMLDivElement,
  {
    containerRef: React.RefObject<HTMLDivElement | null>;
    parentRef: React.RefObject<HTMLDivElement | null>;
    beamOptions?: {
      initialX?: number;
      translateX?: number;
      initialY?: number | string;
      translateY?: number | string;
      rotate?: number;
      className?: string;
      duration?: number;
      delay?: number;
      repeatDelay?: number;
    };
  }
>(({ parentRef, containerRef, beamOptions = {} }, _ref) => {
  const beamRef = useRef<HTMLDivElement>(null);
  const [collision, setCollision] = useState<{
    detected: boolean;
    coordinates: { x: number; y: number } | null;
  }>({
    detected: false,
    coordinates: null,
  });
  const [beamKey, setBeamKey] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const checkCollision = () => {
      if (beamRef.current && containerRef.current && parentRef.current) {
        const beamRect = beamRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        const parentRect = parentRef.current.getBoundingClientRect();

        if (beamRect.bottom >= containerRect.top) {
          const relativeX = beamRect.left - parentRect.left + beamRect.width / 2;
          const relativeY = beamRect.bottom - parentRect.top;

          setCollision({
            detected: true,
            coordinates: {
              x: relativeX,
              y: relativeY,
            },
          });
          setCycle((prev) => prev + 1);
        }
      }
    };

    const animationInterval = setInterval(checkCollision, 50);
    return () => clearInterval(animationInterval);
  }, [cycle, containerRef, parentRef]);

  useEffect(() => {
    if (collision.detected) {
      const timer = setTimeout(() => {
        setCollision({ detected: false, coordinates: null });
        setCycle((prev) => prev + 1);
      }, 1800);

      const keyTimer = setTimeout(() => {
        setBeamKey((prevKey) => prevKey + 1);
      }, 1800);

      return () => {
        clearTimeout(timer);
        clearTimeout(keyTimer);
      };
    }
  }, [collision.detected]);

  return (
    <>
      <motion.div
        key={beamKey}
        ref={beamRef}
        animate="animate"
        initial={{
          translateY: beamOptions.initialY || "-200px",
          translateX: `${beamOptions.initialX || 0}px`,
          rotate: beamOptions.rotate || 0,
        }}
        variants={{
          animate: {
            translateY: beamOptions.translateY || "1200px",
            translateX: `${beamOptions.translateX || beamOptions.initialX || 0}px`,
            rotate: beamOptions.rotate || 0,
          },
        }}
        transition={{
          duration: beamOptions.duration || 8,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
          delay: beamOptions.delay || 0,
          repeatDelay: beamOptions.repeatDelay || 0,
        }}
        className={cn(
          "absolute left-0 top-0 m-auto h-16 w-[2px] rounded-full bg-gradient-to-t from-arcade-neonCyan via-arcade-neonPink to-transparent shadow-[0_0_12px_rgba(0,229,255,0.8)] pointer-events-none",
          beamOptions.className
        )}
      />
      <AnimatePresence>
        {collision.detected && collision.coordinates && (
          <Explosion
            key={`${collision.coordinates.x}-${collision.coordinates.y}`}
            style={{
              left: `${collision.coordinates.x}px`,
              top: `${collision.coordinates.y}px`,
              transform: "translate(-50%, -50%)",
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
});

CollisionMechanism.displayName = "CollisionMechanism";

const Explosion = ({ style, className }: { style?: React.CSSProperties; className?: string }) => {
  const spans = Array.from({ length: 18 }, (_, index) => ({
    id: index,
    initialX: 0,
    initialY: 0,
    directionX: Math.floor(Math.random() * 90 - 45),
    directionY: Math.floor(Math.random() * -60 - 10),
  }));

  return (
    <div style={style} className={cn("absolute z-30 h-2 w-2 pointer-events-none", className)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute -top-px left-1/2 -translate-x-1/2 h-[2px] w-14 rounded-full bg-gradient-to-r from-transparent via-arcade-neonCyan to-transparent shadow-[0_0_15px_#00e5ff]"
      />
      {spans.map((span) => (
        <motion.span
          key={span.id}
          initial={{ x: span.initialX, y: span.initialY, opacity: 1, scale: 1 }}
          animate={{
            x: span.directionX,
            y: span.directionY,
            opacity: 0,
            scale: 0.2,
          }}
          transition={{ duration: Math.random() * 1.2 + 0.4, ease: "easeOut" }}
          className="absolute h-1.5 w-1.5 rounded-full bg-gradient-to-b from-arcade-neonCyan via-arcade-neonPink to-arcade-neonYellow shadow-[0_0_8px_#ff007f]"
        />
      ))}
    </div>
  );
};
