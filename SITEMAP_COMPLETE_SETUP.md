# Sitemap Configuration - Complete Setup

## ✅ What's Included in sitemap.xml

### 1. Static Pages (7 pages)
- Homepage (priority: 1.0)
- Categories page (priority: 0.9)
- Blog page (priority: 0.8)
- Add Business (priority: 0.7)
- About (priority: 0.6)
- Contact (priority: 0.5)
- Developer (priority: 0.4)

### 2. City Pages (Dynamic)
- All cities from CITIES list
- Priority: 0.85
- Change frequency: daily
- Example: `/cities/karachi`, `/cities/lahore`, `/cities/islamabad`, etc.

### 3. Category Pages (Dynamic)
- All categories from CATEGORIES list
- Priority: 0.85
- Change frequency: daily
- Example: `/categories/restaurants`, `/categories/real-estate`, `/categories/technology`, etc.

### 4. Location Pages (City + Category Combinations)
- All combinations of cities and categories
- Priority: 0.8
- Change frequency: daily
- Example: `/locations/karachi/restaurants`, `/locations/lahore/real-estate`, etc.

### 5. Blog Posts (Up to 15)
- **Current count:** 8 active blog posts
- **Maximum allowed:** 15 blog posts
- **Priority:** 0.7
- **Change frequency:** monthly
- **Status:** Automatically excludes hidden posts
- **How it works:**
  - Filters `blog-data.ts` posts where `hidden: false`
  - Includes only first 15 posts
  - Updates on next deployment after blog changes

### 6. Business Pages (All Approved)
- All businesses with `status: 'approved'` from Firebase
- Priority: 0.75
- Change frequency: weekly
- Each business gets its own page in sitemap

## 📋 Current Blog Posts in Sitemap

1. ID: 3 - "Best Business Directory for Karachi Businesses"
2. ID: 2 - "Top 10 Fast-Growing Business Sectors in Pakistan for 2026"
3. ID: 1 - "How Local Business Directories Help Small Businesses Grow..."
4. ID: 3 (duplicate) - "Top 10 Business Opportunities in Karachi for 2026"
5. ID: 4 - "How to Find Reliable Suppliers in Lahore for Your Business"
6. ID: 5 - "Digital Marketing Tips for Pakistani Small Businesses in 2026"

**Total: 6 active posts (capacity for 9 more up to limit of 15)**

## 🎯 Daily Blog Post Management

### To Add a Blog Post to Sitemap:
```
1. Open: /lib/blog-data.ts
2. Find the blog post object
3. Set: hidden: false (or remove hidden property)
4. Deploy/rebuild
5. Post appears in sitemap within minutes
```

### To Remove a Blog Post from Sitemap:
```
1. Open: /lib/blog-data.ts
2. Find the blog post object
3. Set: hidden: true
4. Deploy/rebuild
5. Post is excluded from sitemap
```

### Example Blog Post Structure:
```typescript
{
  id: 6,
  title: "Your Blog Title Here",
  slug: "your-blog-title-slug",
  excerpt: "Brief description...",
  content: "Full HTML content...",
  author: "Author Name",
  date: "March 17, 2026",
  readTime: "5 min read",
  category: "Category Name",
  featured: false,
  hidden: false,  // ← Set to true to exclude from sitemap
  keywords: [...],
  tags: [...]
}
```

## 🔄 Sitemap Update Process

1. **Blog Post Changes** → Edit blog-data.ts (set hidden: true/false)
2. **Deployment/Build** → Sitemap regenerates automatically
3. **Cache Update** → Typically within 5-10 minutes
4. **Search Engines** → Google re-crawls within 24-48 hours

## 📊 Sitemap Statistics

- **Total Static Pages:** 7
- **Dynamic City Pages:** ~50+ (varies by CITIES list)
- **Dynamic Category Pages:** ~12 (varies by CATEGORIES list)
- **City + Category Combinations:** 600+ (50 cities × 12 categories)
- **Blog Posts:** Up to 15 (currently 6)
- **Business Pages:** All approved businesses (variable)

**Total URLs in sitemap:** 700+ URLs

## 🔍 Verify Sitemap

### Check in Browser:
```
https://pakbizbranhces.online/sitemap.xml
```

### Expected Output:
- XML format with all URLs listed
- Proper lastModified dates
- Correct priority levels
- Valid change frequencies

### GSC Integration:
1. Submit to Google Search Console: https://search.google.com/search-console
2. Monitor crawl stats
3. Check for any errors

## ⚙️ How Hidden Posts Work

When you set `hidden: true` on a blog post:
- ✗ NOT displayed on `/blog` homepage
- ✗ NOT included in blog page filters
- ✗ NOT added to sitemap
- ✓ Still accessible via direct URL
- ✓ Can be used for drafts or scheduled content

## 🚀 Best Practices

1. **Don't exceed 15 blog posts** in sitemap for optimal SEO quality
2. **Update 1-2 posts daily** to keep content fresh
3. **Monitor which posts** perform best before including
4. **Keep active posts** relevant and up-to-date
5. **Hide poor-performing** posts to maintain quality
6. **Verify sitemap weekly** in Google Search Console

## 📝 Notes

- All pages have proper XML formatting
- Timestamps are automatically generated
- Change frequencies guide search engine crawl rates
- Priorities help search engines focus on important pages
- Sitemap is auto-generated (no manual XML editing needed)
