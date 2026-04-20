import { Helmet } from "react-helmet-async";

interface SeoProps {
  title: string;          // Page-specific title (will NOT be wrapped in brand suffix)
  description: string;
  path?: string;
}

const ORIGIN = "https://vantagemind.ai";

export const Seo = ({ title, description, path = "/" }: SeoProps) => {
  const url = `${ORIGIN}${path}`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${ORIGIN}/og-image.svg`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${ORIGIN}/og-image.svg`} />
    </Helmet>
  );
};
