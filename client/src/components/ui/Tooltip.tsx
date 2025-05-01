// src/components/ui/Tooltip.tsx
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';

export interface TooltipProps {
  children: React.ReactElement;
  content: React.ReactNode;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  delay?: number;
  maxWidth?: number;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  placement = 'top',
  delay = 300,
  maxWidth = 200,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollX = window.scrollX || document.documentElement.scrollLeft;
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    // Calculate positions based on placement
    let x = 0;
    let y = 0;

    switch (placement) {
      case 'top':
        x =
          triggerRect.left +
          triggerRect.width / 2 -
          tooltipRect.width / 2 +
          scrollX;
        y = triggerRect.top - tooltipRect.height - 8 + scrollY;
        break;
      case 'right':
        x = triggerRect.right + 8 + scrollX;
        y =
          triggerRect.top +
          triggerRect.height / 2 -
          tooltipRect.height / 2 +
          scrollY;
        break;
      case 'bottom':
        x =
          triggerRect.left +
          triggerRect.width / 2 -
          tooltipRect.width / 2 +
          scrollX;
        y = triggerRect.bottom + 8 + scrollY;
        break;
      case 'left':
        x = triggerRect.left - tooltipRect.width - 8 + scrollX;
        y =
          triggerRect.top +
          triggerRect.height / 2 -
          tooltipRect.height / 2 +
          scrollY;
        break;
    }

    // Ensure tooltip stays within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Adjust horizontal position
    if (x < 10) {
      x = 10;
    } else if (x + tooltipRect.width > viewportWidth - 10) {
      x = viewportWidth - tooltipRect.width - 10;
    }

    // Adjust vertical position
    if (y < 10) {
      y = 10;
    } else if (y + tooltipRect.height > viewportHeight - 10) {
      y = viewportHeight - tooltipRect.height - 10;
    }

    setPosition({ x, y });
  };

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => {
      setIsVisible(true);
      // Wait for the next frame to calculate position once tooltip is rendered
      requestAnimationFrame(() => {
        calculatePosition();
      });
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsVisible(false);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Add window resize listener
  useEffect(() => {
    if (isVisible) {
      const handleResize = () => {
        calculatePosition();
      };

      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleResize);
      };
    }
  }, [isVisible]);

  // Clone the children element to add event handlers and ref using callback pattern
  const triggerElement = React.cloneElement(children, {
    ref: (node: HTMLElement | null) => {
      // Set our triggerRef
      triggerRef.current = node;

      // Handle the children's ref if it exists
      const childRef = children.props.ref;
      if (childRef) {
        // Handle function refs
        if (typeof childRef === 'function') {
          childRef(node);
        }
        // We don't attempt to mutate refs that aren't function refs
        // since they might be readonly
      }
    },
    onMouseEnter: (e: React.MouseEvent) => {
      handleMouseEnter();
      if (children.props.onMouseEnter) {
        children.props.onMouseEnter(e);
      }
    },
    onMouseLeave: (e: React.MouseEvent) => {
      handleMouseLeave();
      if (children.props.onMouseLeave) {
        children.props.onMouseLeave(e);
      }
    },
    onFocus: (e: React.FocusEvent) => {
      handleMouseEnter();
      if (children.props.onFocus) {
        children.props.onFocus(e);
      }
    },
    onBlur: (e: React.FocusEvent) => {
      handleMouseLeave();
      if (children.props.onBlur) {
        children.props.onBlur(e);
      }
    },
  });

  // Generate tooltip arrow style based on placement
  const getArrowStyle = () => {
    switch (placement) {
      case 'top':
        return 'bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-t-black border-l-transparent border-r-transparent border-b-transparent';
      case 'right':
        return 'left-0 top-1/2 -translate-y-1/2 -translate-x-full border-r-black border-t-transparent border-b-transparent border-l-transparent';
      case 'bottom':
        return 'top-0 left-1/2 -translate-x-1/2 -translate-y-full border-b-black border-l-transparent border-r-transparent border-t-transparent';
      case 'left':
        return 'right-0 top-1/2 -translate-y-1/2 translate-x-full border-l-black border-t-transparent border-b-transparent border-r-transparent';
    }
  };

  return (
    <>
      {triggerElement}
      {isVisible &&
        createPortal(
          <div
            ref={tooltipRef}
            className={cn(
              'fixed z-50 px-2 py-1 text-xs font-medium text-white bg-black rounded shadow-lg pointer-events-none opacity-90',
              className
            )}
            style={{
              left: position.x,
              top: position.y,
              maxWidth: maxWidth,
            }}
          >
            {content}
            <div className={cn('absolute w-0 h-0 border-4', getArrowStyle())} />
          </div>,
          document.body
        )}
    </>
  );
};
