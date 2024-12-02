import Head from "next/head";

export default function Metatags({
  title,
  keywords,
  description,
  image,
}: {
  title?: string;
  keywords?: string;
  description?: string;
  image?: string;
}) {
  if (description === undefined) {
    description =
      "Andamio empowers your organization to teach skills that connect to contribution opportunities.";
  }
  if (keywords === undefined) {
    keywords =
      "blockchain, learning, management, contribution, skill, community, organization, education, web3";
  }

  title = title + " - Andamio";

  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />

      <title>{title}</title>

      <meta name="keywords" content={keywords} />
      <meta name="description" content={description} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@AndamioPlatform" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:creator" content="@AndamioPlatform" />
      {image && (
        <meta name="twitter:image" content={`https://www.andamio.io${image}`} />
      )}
      {image && <meta name="twitter:image:alt" content={title} />}

      <meta property="og:title" content={title} />
      <meta property="og:type" content="article" />
      <meta property="og:site_name" content="Andamio Platform" />
      <meta property="og:description" content={description} />
      {image && (
        <meta property="og:image" content={`https://www.andamio.io${image}`} />
      )}

      {/* favicon */}
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />

      <meta name="msapplication-TileColor" content="#555555" />
      <meta name="theme-color" content="#eeeeee" />
    </Head>
  );
}

Metatags.defaultProps = {
  title: "Andamio - Education & collaboration platform",
  keywords:
    "blockchain, learning, management, contribution, skill, community, organization, education, web3",
  description:
    "Andamio empowers your organization to teach skills that connect to contribution opportunities.",
  image: "/andamio.png",
};
