import seoData from '@/data/seo.json';

export default function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(seoData.structuredData),
      }}
    />
  );
}
