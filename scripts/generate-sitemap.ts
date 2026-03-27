#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { generateDailyContentSitemapEntries } from '../lib/daily-content'

// Main sitemap structure
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

  <!-- Homepage - HIGHEST PRIORITY -->
  <url>
    <loc>https://pakbizbranhces.online/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Main Navigation Pages - HIGH PRIORITY -->
  <url>
    <loc>https://pakbizbranhces.online/categories</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://pakbizbranhces.online/add-business</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Key Category Pages - HIGH PRIORITY -->
  <url>
    <loc>https://pakbizbranhces.online/categories/restaurants</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://pakbizbranhces.online/categories/real-estate</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Important Landing Pages - MEDIUM PRIORITY -->
  <url>
    <loc>https://pakbizbranhces.online/best-restaurants</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>https://pakbizbranhces.online/top-real-estate</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>https://pakbizbranhces.online/healthcare-services</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- Blog Pages - MEDIUM PRIORITY -->
  <url>
    <loc>https://pakbizbranhces.online/blog</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://pakbizbranhces.online/blog/how-to-add-business</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://pakbizbranhces.online/blog/best-business-directory-karachi-businesses</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>

  <!-- Support Pages - LOW PRIORITY -->
  <url>
    <loc>https://pakbizbranhces.online/about</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>

  <url>
    <loc>https://pakbizbranhces.online/contact</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>

  <url>
    <loc>https://pakbizbranhces.online/priority</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>

  <url>
    <loc>https://pakbizbranhces.online/developer</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>

  <!-- Legal Pages - LOWEST PRIORITY -->
  <url>
    <loc>https://pakbizbranhces.online/privacy</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>

  <url>
    <loc>https://pakbizbranhces.online/terms</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>

  <!-- Daily Content - SEO BOOST -->
  ${generateDailyContentSitemapEntries()}

</urlset>`

// Write sitemap to public directory
const publicDir = path.join(process.cwd(), 'public')
const sitemapPath = path.join(publicDir, 'sitemap.xml')

fs.writeFileSync(sitemapPath, sitemap, 'utf8')

console.log('✅ Sitemap generated successfully with daily content!')
console.log(`📍 Location: ${sitemapPath}`)
console.log(`📅 Daily content entries added: ${30} days`)
console.log(`🔗 Total URLs: ${35 + 30} (main pages + daily content)`)
