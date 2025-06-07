// Hệ thống SEO tự động cho Author Website
class AuthorSEO {
    constructor(config = {}) {
        this.config = {
            authorName: config.authorName || 'Tác giả',
            genre: config.genre || 'romantic suspense',
            defaultLanguage: config.defaultLanguage || 'vi',
            siteName: config.siteName || '',
            domain: config.domain || window.location.hostname,
            socialMedia: config.socialMedia || {},
            ...config
        };
        
        this.init();
    }
    
    init() {
        // Tự động phát hiện loại trang và áp dụng SEO
        this.detectPageType();
        this.setupDynamicSEO();
    }
    
    // Phát hiện loại trang dựa trên URL và nội dung
    detectPageType() {
        const path = window.location.pathname.toLowerCase();
        const url = window.location.href.toLowerCase();
        
        if (path === '/' || path === '/index.html') {
            this.pageType = 'homepage';
        } else if (path.includes('/book') || path.includes('/sach')) {
            this.pageType = 'book';
        } else if (path.includes('/blog') || path.includes('/tin-tuc')) {
            this.pageType = 'blog';
        } else if (path.includes('/about') || path.includes('/gioi-thieu')) {
            this.pageType = 'about';
        } else if (path.includes('/contact') || path.includes('/lien-he')) {
            this.pageType = 'contact';
        } else if (path.includes('/series') || path.includes('/bo-sach')) {
            this.pageType = 'series';
        } else {
            this.pageType = 'general';
        }
    }
    
    // Tạo SEO động dựa trên loại trang
    setupDynamicSEO() {
        const seoData = this.generateSEOData();
        this.applySEO(seoData);
    }
    
    // Tạo dữ liệu SEO cho từng loại trang
    generateSEOData() {
        const baseData = {
            domain: this.config.domain,
            siteName: this.config.siteName,
            authorName: this.config.authorName,
            genre: this.config.genre,
            url: window.location.href,
            image: this.findBestImage(),
            language: this.config.defaultLanguage
        };
        
        switch (this.pageType) {
            case 'homepage':
                return this.generateHomepageSEO(baseData);
            case 'book':
                return this.generateBookSEO(baseData);
            case 'blog':
                return this.generateBlogSEO(baseData);
            case 'about':
                return this.generateAboutSEO(baseData);
            case 'contact':
                return this.generateContactSEO(baseData);
            case 'series':
                return this.generateSeriesSEO(baseData);
            default:
                return this.generateGeneralSEO(baseData);
        }
    }
    
    // SEO cho trang chủ
    generateHomepageSEO(baseData) {
        const title = `${baseData.authorName} - Tác giả tiểu thuyết ${baseData.genre}`;
        const description = `Khám phá thế giới ${baseData.genre} đầy kịch tính qua những tác phẩm của ${baseData.authorName}. Đọc online, tải về miễn phí các tiểu thuyết hay nhất.`;
        
        return {
            ...baseData,
            title,
            description,
            keywords: [
                baseData.authorName,
                baseData.genre,
                'tiểu thuyết',
                'truyện tình cảm',
                'tiểu thuyết trinh thám',
                'sách online',
                'đọc truyện miễn phí'
            ],
            type: 'website',
            structuredData: this.generateAuthorStructuredData(baseData)
        };
    }
    
    // SEO cho trang sách
    generateBookSEO(baseData) {
        const bookTitle = this.extractBookTitle();
        const bookDescription = this.extractBookDescription();
        const bookImage = this.findBookImage();
        
        const title = bookTitle ? 
            `${bookTitle} - ${baseData.authorName} | Tiểu thuyết ${baseData.genre}` :
            `Sách mới - ${baseData.authorName}`;
            
        const description = bookDescription || 
            `Đọc "${bookTitle}" - tác phẩm ${baseData.genre} đầy hấp dẫn của ${baseData.authorName}. Cốt truyện gay cấn, nhân vật sống động.`;
        
        return {
            ...baseData,
            title,
            description,
            image: bookImage || baseData.image,
            keywords: [
                bookTitle,
                baseData.authorName,
                baseData.genre,
                'tiểu thuyết hay',
                'truyện tình cảm',
                'đọc online miễn phí'
            ],
            type: 'book',
            structuredData: this.generateBookStructuredData({
                ...baseData,
                bookTitle,
                bookDescription,
                bookImage
            })
        };
    }
    
    // SEO cho blog/tin tức
    generateBlogSEO(baseData) {
        const postTitle = this.extractPostTitle();
        const postDescription = this.extractPostDescription();
        const postImage = this.findPostImage();
        const publishDate = this.extractPublishDate();
        
        const title = postTitle ? 
            `${postTitle} | Blog ${baseData.authorName}` :
            `Blog - ${baseData.authorName}`;
            
        const description = postDescription || 
            `Chia sẻ từ ${baseData.authorName} về quá trình sáng tác, cảm hứng viết truyện ${baseData.genre} và những câu chuyện thú vị.`;
        
        return {
            ...baseData,
            title,
            description,
            image: postImage || baseData.image,
            keywords: [
                postTitle,
                baseData.authorName,
                'blog tác giả',
                'chia sẻ sáng tác',
                baseData.genre,
                'cảm hứng viết truyện'
            ],
            type: 'article',
            publishDate,
            structuredData: this.generateArticleStructuredData({
                ...baseData,
                postTitle,
                postDescription,
                postImage,
                publishDate
            })
        };
    }
    
    // SEO cho trang giới thiệu
    generateAboutSEO(baseData) {
        return {
            ...baseData,
            title: `Giới thiệu ${baseData.authorName} - Tác giả ${baseData.genre}`,
            description: `Tìm hiểu về ${baseData.authorName}, tác giả chuyên viết ${baseData.genre}. Hành trình sáng tác, tác phẩm nổi bật và phong cách viết độc đáo.`,
            keywords: [
                baseData.authorName,
                'tiểu sử tác giả',
                'hành trình sáng tác',
                baseData.genre,
                'phong cách viết'
            ],
            type: 'profile'
        };
    }
    
    // Áp dụng SEO vào trang
    applySEO(seoData) {
        this.setTitle(seoData.title);
        this.setMetaDescription(seoData.description);
        this.setMetaKeywords(seoData.keywords);
        this.setOpenGraph(seoData);
        this.setTwitterCard(seoData);
        this.setCanonicalURL(seoData.url);
        this.setLanguage(seoData.language);
        this.setStructuredData(seoData.structuredData);
        this.setAdditionalMeta(seoData);
    }
    
    // Thiết lập title
    setTitle(title) {
        document.title = title;
        this.setOrUpdateMeta('property', 'og:title', title);
        this.setOrUpdateMeta('name', 'twitter:title', title);
    }
    
    // Thiết lập meta description
    setMetaDescription(description) {
        this.setOrUpdateMeta('name', 'description', description);
        this.setOrUpdateMeta('property', 'og:description', description);
        this.setOrUpdateMeta('name', 'twitter:description', description);
    }
    
    // Thiết lập meta keywords
    setMetaKeywords(keywords) {
        if (Array.isArray(keywords)) {
            keywords = keywords.join(', ');
        }
        this.setOrUpdateMeta('name', 'keywords', keywords);
    }
    
    // Thiết lập Open Graph
    setOpenGraph(seoData) {
        const ogTags = {
            'og:type': seoData.type || 'website',
            'og:url': seoData.url,
            'og:site_name': seoData.siteName,
            'og:locale': seoData.language === 'vi' ? 'vi_VN' : 'en_US'
        };
        
        if (seoData.image) {
            ogTags['og:image'] = seoData.image;
            ogTags['og:image:alt'] = seoData.title;
        }
        
        if (seoData.publishDate) {
            ogTags['article:published_time'] = seoData.publishDate;
            ogTags['article:author'] = seoData.authorName;
        }
        
        Object.entries(ogTags).forEach(([property, content]) => {
            this.setOrUpdateMeta('property', property, content);
        });
    }
    
    // Thiết lập Twitter Card
    setTwitterCard(seoData) {
        const twitterTags = {
            'twitter:card': 'summary_large_image',
            'twitter:site': this.config.socialMedia.twitter || '',
            'twitter:creator': this.config.socialMedia.twitter || ''
        };
        
        if (seoData.image) {
            twitterTags['twitter:image'] = seoData.image;
        }
        
        Object.entries(twitterTags).forEach(([name, content]) => {
            if (content) {
                this.setOrUpdateMeta('name', name, content);
            }
        });
    }
    
    // Thiết lập Canonical URL
    setCanonicalURL(url) {
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }
        canonical.href = url;
    }
    
    // Thiết lập ngôn ngữ
    setLanguage(language) {
        document.documentElement.lang = language;
        this.setOrUpdateMeta('name', 'language', language);
    }
    
    // Thiết lập Structured Data (JSON-LD)
    setStructuredData(structuredData) {
        if (!structuredData) return;
        
        let script = document.querySelector('script[type="application/ld+json"]');
        if (!script) {
            script = document.createElement('script');
            script.type = 'application/ld+json';
            document.head.appendChild(script);
        }
        script.textContent = JSON.stringify(structuredData, null, 2);
    }
    
    // Tạo Structured Data cho tác giả
    generateAuthorStructuredData(data) {
        return {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": data.authorName,
            "jobTitle": "Author",
            "genre": data.genre,
            "url": data.url,
            "image": data.image,
            "sameAs": Object.values(this.config.socialMedia).filter(url => url)
        };
    }
    
    // Tạo Structured Data cho sách
    generateBookStructuredData(data) {
        return {
            "@context": "https://schema.org",
            "@type": "Book",
            "name": data.bookTitle,
            "author": {
                "@type": "Person",
                "name": data.authorName
            },
            "description": data.bookDescription,
            "genre": data.genre,
            "url": data.url,
            "image": data.bookImage
        };
    }
    
    // Tạo Structured Data cho bài viết
    generateArticleStructuredData(data) {
        return {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": data.postTitle,
            "description": data.postDescription,
            "author": {
                "@type": "Person",
                "name": data.authorName
            },
            "datePublished": data.publishDate,
            "url": data.url,
            "image": data.postImage
        };
    }
    
    // Utility functions
    setOrUpdateMeta(attribute, name, content) {
        if (!content) return;
        
        let meta = document.querySelector(`meta[${attribute}="${name}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute(attribute, name);
            document.head.appendChild(meta);
        }
        meta.content = content;
    }
    
    // Trích xuất thông tin từ trang
    extractBookTitle() {
        return document.querySelector('h1')?.textContent?.trim() ||
               document.querySelector('.book-title')?.textContent?.trim() ||
               document.querySelector('[data-book-title]')?.textContent?.trim();
    }
    
    extractBookDescription() {
        return document.querySelector('.book-description')?.textContent?.trim() ||
               document.querySelector('[data-book-description]')?.textContent?.trim() ||
               document.querySelector('meta[name="description"]')?.content;
    }
    
    extractPostTitle() {
        return document.querySelector('h1')?.textContent?.trim() ||
               document.querySelector('.post-title')?.textContent?.trim() ||
               document.querySelector('article h1')?.textContent?.trim();
    }
    
    extractPostDescription() {
        return document.querySelector('.post-excerpt')?.textContent?.trim() ||
               document.querySelector('.post-description')?.textContent?.trim() ||
               document.querySelector('article p')?.textContent?.trim()?.substring(0, 160);
    }
    
    extractPublishDate() {
        const dateElement = document.querySelector('[datetime]') ||
                           document.querySelector('.post-date') ||
                           document.querySelector('[data-date]');
        
        if (dateElement) {
            return dateElement.getAttribute('datetime') || 
                   dateElement.textContent || 
                   dateElement.getAttribute('data-date');
        }
        
        return new Date().toISOString();
    }
    
    findBestImage() {
        const selectors = [
            'meta[property="og:image"]',
            '.featured-image img',
            '.book-cover img',
            'article img',
            'main img',
            'img'
        ];
        
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
                return element.src || element.content;
            }
        }
        
        return '';
    }
    
    findBookImage() {
        return document.querySelector('.book-cover img')?.src ||
               document.querySelector('[data-book-image]')?.src ||
               this.findBestImage();
    }
    
    findPostImage() {
        return document.querySelector('.featured-image img')?.src ||
               document.querySelector('article img')?.src ||
               this.findBestImage();
    }
    
    // Meta bổ sung cho SEO
    setAdditionalMeta(seoData) {
        // Robots meta
        this.setOrUpdateMeta('name', 'robots', 'index, follow');
        
        // Author meta
        this.setOrUpdateMeta('name', 'author', seoData.authorName);
        
        // Generator meta
        this.setOrUpdateMeta('name', 'generator', 'Author SEO System');
        
        // Viewport (responsive)
        if (!document.querySelector('meta[name="viewport"]')) {
            this.setOrUpdateMeta('name', 'viewport', 'width=device-width, initial-scale=1.0');
        }
        
        // Theme color
        if (!document.querySelector('meta[name="theme-color"]')) {
            this.setOrUpdateMeta('name', 'theme-color', '#2c3e50');
        }
    }
    
    // Cập nhật SEO động khi nội dung thay đổi
    updateSEO(newData = {}) {
        Object.assign(this.config, newData);
        this.setupDynamicSEO();
    }
    
    // Phân tích SEO hiện tại
    analyzeSEO() {
        const analysis = {
            title: {
                exists: !!document.title,
                length: document.title.length,
                optimal: document.title.length >= 30 && document.title.length <= 60
            },
            description: {
                exists: !!document.querySelector('meta[name="description"]'),
                length: document.querySelector('meta[name="description"]')?.content?.length || 0,
                optimal: false
            },
            openGraph: {
                title: !!document.querySelector('meta[property="og:title"]'),
                description: !!document.querySelector('meta[property="og:description"]'),
                image: !!document.querySelector('meta[property="og:image"]'),
                url: !!document.querySelector('meta[property="og:url"]')
            },
            structuredData: !!document.querySelector('script[type="application/ld+json"]'),
            canonical: !!document.querySelector('link[rel="canonical"]')
        };
        
        const descLength = analysis.description.length;
        analysis.description.optimal = descLength >= 120 && descLength <= 160;
        
        return analysis;
    }
}

// Sử dụng hệ thống SEO
function initAuthorSEO(config = {}) {
    // Cấu hình mặc định cho website tác giả
    const defaultConfig = {
        authorName: 'Tên Tác Giả',
        genre: 'romantic suspense',
        siteName: 'Website Tác Giả',
        defaultLanguage: 'vi',
        socialMedia: {
            facebook: '',
            twitter: '',
            instagram: '',
            youtube: ''
        }
    };
    
    const finalConfig = { ...defaultConfig, ...config };
    
    // Khởi tạo SEO khi DOM đã sẵn sàng
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.authorSEO = new AuthorSEO(finalConfig);
        });
    } else {
        window.authorSEO = new AuthorSEO(finalConfig);
    }
}

// Export cho sử dụng
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AuthorSEO, initAuthorSEO };
}

// Sử dụng cơ bản - thêm vào cuối file HTML
/*
<script>
initAuthorSEO({
    authorName: 'Tên Bạn',
    genre: 'romantic suspense',
    siteName: 'Website Tác Giả',
    socialMedia: {
        facebook: 'https://facebook.com/yourpage',
        twitter: '@youraccount'
    }
});
</script>
*/