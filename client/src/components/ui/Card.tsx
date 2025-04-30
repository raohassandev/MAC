
import { FC, ReactNode } from 'react';

interface CardProps {
  className?: string;
  children?: ReactNode;
}

// Main Card component
const Card: FC<CardProps> & {
  Root: FC<CardProps>;
  Content: FC<CardProps>;
  Header: FC<CardProps>;
  Title: FC<CardProps>;
  Footer: FC<CardProps>;
} = ({ className = '', children }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      {children}
    </div>
  );
};

// Root component
const Root: FC<CardProps> = ({ className = '', children }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      {children}
    </div>
  );
};

// Content component
const Content: FC<CardProps> = ({ className = '', children }) => {
  return <div className={className}>{children}</div>;
};

// Header component
const Header: FC<CardProps> = ({ className = '', children }) => {
  return <div className={`pb-2 mb-4 border-b ${className}`}>{children}</div>;
};

// Title component
const Title: FC<CardProps> = ({ className = '', children }) => {
  return <h3 className={`text-lg font-medium ${className}`}>{children}</h3>;
};

// Footer component
const Footer: FC<CardProps> = ({ className = '', children }) => {
  return <div className={`pt-2 mt-4 border-t ${className}`}>{children}</div>;
};

// Assign subcomponents to Card
Card.Root = Root;
Card.Content = Content;
Card.Header = Header;
Card.Title = Title;
Card.Footer = Footer;

export {
  Card,
  Root,
  Content,
  Header as CardHeader,
  Title as CardTitle,
  Footer as CardFooter,
};
