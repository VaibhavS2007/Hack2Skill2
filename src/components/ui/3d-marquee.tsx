"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";

export interface ThreeDMarqueeProps<T = any> {
  images?: string[];
  items?: T[];
  renderItem?: (item: T, index: number) => React.ReactNode;
  className?: string;
  gridLineColor?: string;
  gridLineColorDark?: string;
  transformStyle?: string;
  speed?: number;
  pauseOnHover?: boolean;
}

export function ThreeDMarquee<T = any>({
  images,
  items,
  renderItem,
  className,
  gridLineColor = "rgba(0, 229, 255, 0.25)",
  gridLineColorDark = "rgba(255, 0, 127, 0.35)",
  transformStyle,
  speed = 12,
  pauseOnHover = true,
}: ThreeDMarqueeProps<T>) {
  // Use items if provided, otherwise images
  const dataSource = (items || images || []) as (T | string)[];

  // Split data into 4 distinct columns
  const chunkCount = 4;
  const chunkSize = Math.ceil(dataSource.length / chunkCount) || 1;
  const chunks = Array.from({ length: chunkCount }, (_, colIndex) => {
    const start = colIndex * chunkSize;
    return dataSource.slice(start, start + chunkSize);
  });

  return (
    <div
      className={cn(
        "relative mx-auto block h-[380px] w-full overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/60 backdrop-blur-md shadow-[0_0_50px_rgba(0,0,0,0.9)]",
        className
      )}
      style={{
        perspective: "1200px",
      }}
    >
      {/* Top and Bottom Gradient Fades for depth blending */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-20 bg-gradient-to-b from-slate-950 via-slate-950/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-24 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />

      {/* Perspective Stage */}
      <div className="flex size-full items-center justify-center">
        <div className="w-[1400px] shrink-0 scale-75 sm:scale-90 md:scale-100 transition-transform">
          <div
            style={{
              transform:
                transformStyle ||
                "rotateX(48deg) rotateY(0deg) rotateZ(-12deg) translateY(-40px)",
              transformStyle: "preserve-3d",
            }}
            className="relative grid grid-cols-4 gap-6 p-6"
          >
            {chunks.map((subarray, colIndex) => {
              const isEven = colIndex % 2 === 0;
              const yOffset = isEven ? 70 : -70;

              return (
                <motion.div
                  key={colIndex + "marquee"}
                  animate={{ y: [0, yOffset, 0] }}
                  transition={{
                    duration: isEven ? speed : speed * 1.25,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                  whileHover={pauseOnHover ? { animationPlayState: "paused" } : undefined}
                  className="flex flex-col items-stretch gap-6 relative"
                >
                  <GridLineVertical
                    className="-left-3"
                    offset="120px"
                    color={gridLineColor}
                    colorDark={gridLineColorDark}
                  />

                  {subarray.map((item, itemIndex) => {
                    const globalIdx = colIndex * chunkSize + itemIndex;
                    return (
                      <div className="relative" key={globalIdx}>
                        <GridLineHorizontal
                          className="-top-3"
                          offset="60px"
                          color={gridLineColor}
                          colorDark={gridLineColorDark}
                        />

                        {renderItem ? (
                          renderItem(item as T, globalIdx)
                        ) : typeof item === "string" ? (
                          <motion.img
                            whileHover={{ y: -8, scale: 1.03 }}
                            transition={{ duration: 0.2 }}
                            src={item}
                            alt={`Image ${globalIdx + 1}`}
                            className="aspect-[970/700] w-full rounded-2xl object-cover ring-1 ring-white/10 hover:shadow-2xl shadow-lg"
                          />
                        ) : null}
                      </div>
                    );
                  })}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export const GridLineHorizontal = ({
  className,
  offset,
  color = "rgba(0, 229, 255, 0.2)",
  colorDark = "rgba(255, 0, 127, 0.3)",
}: {
  className?: string;
  offset?: string;
  color?: string;
  colorDark?: string;
}) => {
  return (
    <div
      style={
        {
          "--background": "#05060A",
          "--color": color,
          "--color-dark": colorDark,
          "--height": "1px",
          "--width": "6px",
          "--fade-stop": "90%",
          "--offset": offset || "100px",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "pointer-events-none absolute left-[calc(var(--offset)/2*-1)] h-[var(--height)] w-[calc(100%+var(--offset))]",
        "bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
        "[mask-composite:exclude]",
        "z-10",
        className
      )}
    />
  );
};

export const GridLineVertical = ({
  className,
  offset,
  color = "rgba(0, 229, 255, 0.2)",
  colorDark = "rgba(255, 0, 127, 0.3)",
}: {
  className?: string;
  offset?: string;
  color?: string;
  colorDark?: string;
}) => {
  return (
    <div
      style={
        {
          "--background": "#05060A",
          "--color": color,
          "--color-dark": colorDark,
          "--height": "6px",
          "--width": "1px",
          "--fade-stop": "90%",
          "--offset": offset || "100px",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "pointer-events-none absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-[var(--width)]",
        "bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
        "[mask-composite:exclude]",
        "z-10",
        className
      )}
    />
  );
};
