// scripts/generate-sitemap.js
import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';
import { resolve, relative } from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Для ES-модулей
const __dirname = fileURLToPath(new URL('.', import.meta.url));

// === НАСТРОЙКА ===
const hostname = 'https://nubl.ru'; // 🔁 твой домен
const distPath = resolve(__dirname, '../dist');
const outputFile = resolve(distPath, 'sitemap.xml');

// === Функция поиска HTML-файлов ===
function getHtmlFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let urls = [];

    for (const entry of entries) {
        const fullPath = resolve(dir, entry.name);

        if (entry.isDirectory()) {
            urls = urls.concat(getHtmlFiles(fullPath));
        } else if (entry.isFile() && entry.name.endsWith('.html') && !entry.name.startsWith('404')) {
            // относительный путь от dist
            let relPath = '/' + relative(distPath, fullPath);
            relPath = relPath.replace(/\\/g, '/'); // для Windows
            relPath = relPath
                .replace(/index\.html$/, '') // index.html → /
                .replace(/\.html$/, ''); // about.html → /about

            // убираем двойные слэши и пустые строки
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

    const urls = getHtmlFiles(distPath);
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

generateSitemap().catch(console.error);
