import React from 'react';
import { Helmet } from 'react-helmet-async';

interface HeadProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
}

export const Head: React.FC<HeadProps> = ({
  title,
  description,
  image = '/images/og-image.jpg',
  url = 'https://powderpro.com',
  type = 'website',
}) => {
  const siteName = 'PowderPro Coating Services';

  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{`${title} | ${siteName}`}</title>
      <meta name="description" content={description} />

      {/* Open Graph tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured data */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: siteName,
          image: image,
          description: description,
          address: {
            '@type': 'PostalAddress',
            streetAddress: '123 Powder Street',
            addressLocality: 'Coating City',
            addressRegion: 'ST',
            postalCode: '12345',
            addressCountry: 'US',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 40.7128,
            longitude: -74.0060,
          },
          url: url,
          telephone: '+1-555-123-4567',
          priceRange: '$$',
          openingHoursSpecification: [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              opens: '08:00',
              closes: '18:00',
            },
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Saturday'],
              opens: '09:00',
              closes: '14:00',
            },
          ],
        })}
      </script>
    </Helmet>
  );
}; 