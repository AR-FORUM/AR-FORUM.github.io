# AR-FORUM.github.io Project Overview

## Main Website Structure

This is the website for Aditi Raghunathan's FORUM (Foundations of Robust Machine Learning) Lab at CMU.

### Key Files
- `index.html` - Homepage with lab description and news widget
- `people.html` - Team members page
- `publications.html` - Research publications with filtering and abstracts
- `contact.html` - Contact information
- `header.html` - Shared navigation header loaded dynamically (uses class="main-header")
- `CLAUDE.md` - This documentation file for AI assistants

### Styles & Scripts
- `styles/style.css` - Main stylesheet with minimal, academic design
- `styles/font.css` - Font definitions
- `scripts/header.js` - Dynamically loads header with path-aware navigation
- `scripts/people.js` - Renders team member data
- `scripts/publications.js` - Handles publication filtering and display
- `scripts/news.js` - News widget functionality

### Design Philosophy
- Minimal, clean academic aesthetic
- Palatino font family
- Blue primary color (#0047AB)
- Max width of 1000px for content (1200px on large screens)
- Fully responsive design with breakpoints at 480px, 768px, and 1200px

### Responsive Design
- **Mobile (≤480px)**: Horizontal navigation maintained, smaller fonts (28px header), minimal gaps
- **Tablet (≤768px)**: Adjusted font sizes, responsive people cards with no gap
- **Desktop (>768px)**: Full layout with proper spacing
- **Large (≥1200px)**: Extended max-width for better space usage

## Blog Subsystem

The blog is built with Jekyll and lives in the `blog_src/` directory.

### Blog Structure
```
blog_src/
├── _layouts/          # Jekyll layouts
│   ├── default.html   # Base layout
│   ├── home.html      # Blog index layout
│   ├── post.html      # Individual post layout
│   └── page.html      # Static page layout
├── _posts/            # Blog posts (YYYY-MM-DD-title.markdown)
├── assets/
│   ├── styles/        # Blog-specific styles
│   │   └── blog.css
│   ├── styles_sync/   # Synced from main site (auto-generated)
│   └── scripts_sync/  # Synced from main site (auto-generated)
├── _config.yml        # Jekyll configuration
├── build.sh           # Build script
└── index.markdown     # Blog homepage
```

### Building the Blog

Run the build script from the `blog_src/` directory:
```bash
cd blog_src
./build.sh
```

This script:
1. Syncs styles and scripts from the main site to `assets/styles_sync/` and `assets/scripts_sync/`
2. Copies `header.html` for consistent navigation
3. Runs `jekyll build` to generate the static blog in `../blog/`

### Blog Features
- **Clean URLs**: Posts use `/:title/` format without dates
- **TLDR Support**: Add `tldr: "summary"` to post front matter
- **Categories**: Displayed inline with post date
- **Shared Styling**: Uses main site's styles with blog-specific additions
- **Dynamic Navigation**: Header adjusts links based on directory depth

### Creating Blog Posts

1. Create a new file in `blog_src/_posts/` with format `YYYY-MM-DD-title.markdown`
2. Add front matter:
```yaml
---
layout: post
title: "Your Post Title"
date: YYYY-MM-DD HH:MM:SS -0500
categories: category1 category2
tldr: "Brief one-sentence summary of the post"
---
```
3. Write content in Markdown
4. Run `./build.sh` to build

### Key Design Decisions
- Blog reuses main site header/navigation for consistency
- Minimal design with focus on readability
- Max width of 700px for blog posts (within site's 1000px)
- Path-aware navigation that works at any directory depth
- Synced assets ensure blog stays consistent with main site updates
- Clean URLs without dates (e.g., `/blog/post-title/`)
- TLDR support for quick post summaries
- Categories displayed inline with post date

### Testing Commands
- Build blog: `cd blog_src && ./build.sh`
- Serve locally: `cd blog_src && jekyll serve`
- Check output: Files are generated in `blog/` directory

## Recent Updates
- Fixed responsive design issues across all pages
- Consolidated duplicate CSS definitions
- Added comprehensive media queries for mobile/tablet/desktop
- Changed fixed widths to max-widths for better responsiveness
- Updated header.js to dynamically adjust navigation links based on path depth
- Blog system fully integrated with main site styling
- Kept horizontal navigation on mobile (no vertical stacking)
- Reduced gaps to 0px on mobile/tablet for tighter layouts
- Footer becomes relative (not fixed) on mobile devices