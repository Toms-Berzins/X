import { Helmet } from 'react-helmet-async';

interface HeadProps {
  title?: string;
  description?: string;
}

export const Head: React.FC<HeadProps> = ({
  title = 'X - Your App',
  description = 'Welcome to X',
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  );
}; 
