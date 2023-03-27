import React, { MouseEvent, useRef, useState } from "react";
import { useOnUnMount } from "@/hooks/lifecycle";

type RippleProps = React.HTMLAttributes<HTMLInputElement> & {
  duration?: number;
  rippleClasses?: string;
} & (
    | {
        mode?: "center";
        widthPercent?: number;
      }
    | {
        mode?: "mouse";
        widthPercent?: undefined;
      }
  );

interface SpanPosition {
  top: string;
  left: string;
  width: string;
  height: string;
}

const RippleSpan: React.VFC<{ spans: SpanPosition[]; duration: string; className: string }> = ({
  spans,
  className,
  duration,
}) => (
  <>
    {spans.map((key, index) => (
      <span key={index} style={{ ...key, animationDuration: duration }} className={`ripple-span ${className}`} />
    ))}
  </>
);

export const Ripple: React.FC<RippleProps> = ({
  className,
  children,
  widthPercent = 0.5,
  mode = "center",
  rippleClasses = "default-ripple-color",
  duration = 500,
  ...props
}) => {
  const [state, setState] = useState<SpanPosition[]>([]);
  const timeout = useRef<number>(0);

  useOnUnMount(() => clearTimeout(timeout.current));

  const removeRippleSpans = () => {
    clearTimeout(timeout.current - 1);
    const timeoutID = setTimeout(() => setState([]), duration) as unknown as number;
    timeout.current = timeoutID + 1;
  };

  const getCursorCenterStyles = (e: MouseEvent<HTMLDivElement>) => {
    const rippleContainer = e.currentTarget;
    const size = rippleContainer.offsetWidth;
    const pos = rippleContainer.getBoundingClientRect();
    const x = e.pageX - pos.x - size / 2;
    const y = e.pageY - pos.y - size / 2;
    return { top: `${y}px`, left: `${x}px`, height: `${size}px`, width: `${size}px` };
  };

  const getRippleCenterStyles = (e: MouseEvent<HTMLDivElement>) => {
    const rippleContainer = e.currentTarget;
    const pos = rippleContainer.getBoundingClientRect();
    const width = pos.width * widthPercent;
    const height = pos.height;
    const x = pos.width / 2 - width / 2;
    const y = -(width - height) / 2;
    return { top: `${y}px`, left: `${x}px`, height: `${width}px`, width: `${width}px` };
  };

  const showRipple = (e: MouseEvent<HTMLDivElement>) => {
    let spanStyles;
    if (mode === "center") {
      spanStyles = getRippleCenterStyles(e);
    } else {
      spanStyles = getCursorCenterStyles(e);
    }

    setState([...state, spanStyles]);
  };

  return (
    <div
      className={`ripple-wrapper ${className ?? ""}`}
      {...props}
      onMouseDown={showRipple}
      onMouseUp={removeRippleSpans}
    >
      {children}
      <div className="ripple-container">
        <RippleSpan spans={state} duration={`${duration}ms`} className={rippleClasses} />
      </div>
    </div>
  );
};
