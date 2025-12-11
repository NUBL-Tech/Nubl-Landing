// scripts/generate-sitemap.js
import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';
import { resolve, relative } from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// === НАСТРОЙКА ===
const hostname = process.env.VITE_BASE_DOMAIN || 'https://nubl.ru';
const distPath = resolve(__dirname, '../dist');
const outputFile = resolve(distPath, 'sitemap.xml');

// === Функция поиска HTML-файлов ===
function getHtmlFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const urls = [];

    for (const entry of entries) {
        const fullPath = resolve(dir, entry.name);

        if (entry.isDirectory()) {
            urls.push(...getHtmlFiles(fullPath));
        } else if (entry.isFile() && entry.name.endsWith('.html') && !entry.name.startsWith('404')) {
            // относительный путь от dist
            let relPath = '/' + relative(distPath, fullPath);
            relPath = relPath.replace(/\\/g, '/'); // для Windows

            // Спец-кейс: корневой index.html → /
            if (relPath === '/index.html') {
                relPath = '/';
            } else if (relPath.endsWith('.html')) {
                // Любой другой *.html → без .html
                relPath = relPath.slice(0, -'.html'.length); // /about.html → /about, /blog/index.html → /blog/index
            }

            // убираем двойные слэши и гарантируем ведущий /
            relPath = relPath.replace(/\/{2,}/g, '/');
            if (!relPath.startsWith('/')) relPath = '/' + relPath;

            urls.push(relPath);
        }
    }

    return urls;
}

// === Генерация sitemap ===
async function generateSitemap() {
    const sitemap = new SitemapStream({ hostname });
    const writeStream = createWriteStream(outputFile);
    sitemap.pipe(writeStream);

    const rawUrls = getHtmlFiles(distPath);

    // Дедупликация на всякий случай
    const urls = Array.from(new Set(rawUrls));

    urls.forEach(url => {
        sitemap.write({
            url,
            changefreq: 'monthly',
            priority: url === '/' ? 1.0 : 0.8,
            lastmod: new Date().toISOString(),
        });
    });

    sitemap.end();
    await streamToPromise(sitemap);

    console.log(`✅ sitemap.xml создан: ${outputFile}`);
    console.log(`📄 Найдено страниц: ${urls.length}`);
    urls.forEach(u => console.log('  •', u));
}

// === Генерация robots.txt ===
function generateRobotsTxt() {
    const robotsContent = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /secret.html

Sitemap: ${hostname}/sitemap.xml
`;

    const robotsFile = resolve(distPath, 'robots.txt');
    fs.writeFileSync(robotsFile, robotsContent, 'utf-8');
    console.log(`✅ robots.txt создан: ${robotsFile}`);
}

generateSitemap()
    .then(() => generateRobotsTxt())
    .catch(console.error);
