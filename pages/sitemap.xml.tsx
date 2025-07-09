//pages/sitemap.xml.js
const EXTERNAL_DATA_URL = 'https://www.face-guardian.com';

function generateSiteMap() {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
            <loc>${EXTERNAL_DATA_URL}/</loc>
        </url>
        <url>
            <loc>${EXTERNAL_DATA_URL}</loc>
        </url>
        <url>
            <loc>${EXTERNAL_DATA_URL}/home</loc>
        </url>
        <url>
            <loc>${EXTERNAL_DATA_URL}/integration/api</loc>
        </url>
        <url>
            <loc>${EXTERNAL_DATA_URL}/integration/application</loc>
        </url>
        <url>
            <loc>${EXTERNAL_DATA_URL}/integration/guide</loc>
        </url>
        <url>
            <loc>${EXTERNAL_DATA_URL}/login</loc>
        </url>
        <url>
            <loc>${EXTERNAL_DATA_URL}/login/email</loc>
        </url>
        <url>
            <loc>${EXTERNAL_DATA_URL}/register</loc>
        </url>
    </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }: { res: any }) {
  const sitemap = generateSiteMap();
  res.setHeader('Content-Type', 'text/xml');
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
