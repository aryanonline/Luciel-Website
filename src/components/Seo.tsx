import { Helmet } from "react-helmet-async";

interface SeoProps {
  title: string;
  description: string;
  path?: string;
}

export const Seo = ({ title, description, path = "/" }: SeoProps) => {
  const fullTitle = `VantageMind AI — ${title}`;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={`https://vantagemind.ai${path}`} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="/og-image.svg" />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
};
