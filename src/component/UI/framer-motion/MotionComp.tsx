import React from "react";
import {
  motion,
  useReducedMotion,
  type Variants,
  type HTMLMotionProps,
  type SVGMotionProps,
} from "framer-motion";
// List of HTML elements from Framer Motion's types
type HTMLElements = keyof React.JSX.IntrinsicElements extends infer K
  ? K extends keyof React.JSX.IntrinsicElements
    ? React.JSX.IntrinsicElements[K] extends React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >
      ? K
      : never
    : never
  : never;

// List of SVG elements
type SVGElements = keyof React.JSX.IntrinsicElements extends infer K
  ? K extends keyof React.JSX.IntrinsicElements
    ? React.JSX.IntrinsicElements[K] extends React.SVGProps<SVGElement>
      ? K
      : never
    : never
  : never;

export interface IMotionComponentProps {
  as?: keyof React.JSX.IntrinsicElements;
  variants?: Variants;
  className?: string;
  href?: string;
  src?: string;
  children?: React.ReactNode;
}

type MotionProps<T extends keyof React.JSX.IntrinsicElements> =
  T extends HTMLElements
    ? HTMLMotionProps<T>
    : T extends SVGElements
    ? SVGMotionProps<T>
    : never;

const MotionComponent = <T extends keyof React.JSX.IntrinsicElements = "div">({
  as = "div" as T,
  variants,
  children,
  className,
  href,
  src,
  ...rest
}: IMotionComponentProps & MotionProps<T>) => {
  const shouldReduceMotion = useReducedMotion();
  const Component = motion[as as keyof typeof motion] as React.ElementType;

  return (
    <Component
      className={className}
      href={href}
      src={src}
      variants={shouldReduceMotion ? { visible: { opacity: 1 } } : variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.8 }}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default MotionComponent;

// export interface IMotionComponentProps extends HTMLMotionProps<"div"> {
//   as?: keyof React.JSX.IntrinsicElements;
//   variants?: Variants;
//   className?: string;
//   href?: string;
//   src?: string;
//   //   children?: React.JSX.Element | React.JSX.Element[];
//   children?: React.ReactNode;
// }

// type MotionComponentKey = keyof typeof motion;

// type MotionProps<T extends keyof React.JSX.IntrinsicElements> =
//   T extends keyof React.HTMLElementType
//     ? HTMLMotionProps<T>
//     : T extends keyof React.SVGElementType
//     ? SVGMotionProps<T>
//     : never;
