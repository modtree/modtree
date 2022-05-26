import { useRouter } from "next/router";
import { Footer } from "./components/Footer";

const theme = {
  github: "https://github.com/vercel/turborepo",
  projectLink: "https://github.com/vercel/turborepo",
  docsRepositoryBase:
    "https://github.com/vercel/turborepo/blob/main/docs/pages",
  titleSuffix: " | Turborepo",
  search: true,
  unstable_flexsearch: true,
  unstable_staticImage: true,
  floatTOC: true,
  font: false,
  projectChatLink: "https://turborepo.org/discord",
  feedbackLink: "Question? Give us feedback →",
  banner: null,
  logo: function LogoActual() {
    return (
      <>
        <img src="/logo-dark.svg" width={160} />
        <span className="sr-only">Turborepo</span>
      </>
    );
  },
  head: function Head({ title, meta }) {
    const router = useRouter();
    return (
      <>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon/favicon-16x16.png"
        />
        <link
          rel="mask-icon"
          href="/images/favicon/safari-pinned-tab.svg"
          color="#000000"
        />
        <link rel="shortcut icon" href="/images/favicon/favicon.ico" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#000" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@turborepo" />
        <meta name="twitter:creator" content="@turborepo" />
        <meta property="og:type" content="website" />
        <meta name="og:title" content={title} />
        <meta name="og:description" content={meta.description} />
        <meta
          property="og:url"
          content={`https://turborepo.org${router.asPath}`}
        />
        <meta
          property="og:image"
          content={`https://turborepo.org${meta.ogImage ?? "/og-image.png"}`}
        />
        <meta property="og:locale" content="en_IE" />
        <meta property="og:site_name" content="Turborepo" />
      </>
    );
  },
  footerEditLink: () => {
    return "Edit this page on GitHub";
  },
  footerText: () => {
    return <Footer />;
  },
  nextThemes: {
    defaultTheme: "dark",
  },
};
export default theme;
