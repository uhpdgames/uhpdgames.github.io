const finalConfig = { ...defaultConfig, ...config };
    
    // Khởi tạo SEO khi DOM đã sẵn sàng
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.authorSEO = new AuthorSEO(finalConfig);
        });
    } else {
        window.authorSEO = new AuthorSEO(finalConfig);
    }
    
    // Thêm methods tiện ích
    window.authorSEO.updateForBlog = function(blogData) {
        this.updateSEO({
            ...blogData,
            pageType: 'blog'
        });
    };
    
    window.authorSEO.updateForBook = function(bookData) {
        this.updateSEO({
            ...bookData,
            pageType: 'book'
        });
    };
    
    // Auto-refresh SEO khi có thay đổi content
    if (typeof MutationObserver !== 'undefined') {
        const observer = new MutationObserver(() => {
            clearTimeout(window.seoUpdateTimeout);
            window.seoUpdateTimeout = setTimeout(() => {
                if (window.authorSEO) {
                    window.authorSEO.setupDynamicSEO();
                }
            }, 1000);
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['data-book-title', 'data-category', 'data-tag']
        });
    }
}

// Hàm tiện ích để cập nhật SEO cho từng trang
window.updatePageSEO = function(type, data = {}) {
    if (!window.authorSEO) return;
    
    switch (type) {
        case 'blog':
            window.authorSEO.pageType = 'blog';
            break;
        case 'book':
            window.authorSEO.pageType = 'book';
            break;
        case 'homepage':
            window.authorSEO.pageType = 'homepage';
            break;
        default:
            window.authorSEO.pageType = type;
    }
    
    window.authorSEO.updateSEO(data);
};

// Hàm đặc biệt cho blog posts - tối ưu cho thu hút người dùng
window.optimizeBlogSEO = function(postData = {}) {
    if (!window.authorSEO) return;
    
    // Tự động tạo title hấp dẫn nếu chưa có
    if (postData.title && !postData.optimizedTitle) {
        const attractiveWords = ['Bí mật', 'Cách', '5 Lý do', 'Kinh nghiệm', 'Hướng dẫn'];
        const randomWord = attractiveWords[Math.floor(Math.random() * attractiveWords.length)];
        postData.optimizedTitle = `${randomWord}: ${postData.title}`;
    }
    
    // Tự động thêm keywords thu hút traffic
    const blogKeywords = window.authorSEO.config.blogKeywords || [];
    postData.keywords = [...(postData.keywords || []), ...blogKeywords];
    
    window.updatePageSEO('blog', postData);
};

// Export cho sử dụng
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AuthorSEO, initAuthorSEO, updatePageSEO, optimizeBlogSEO };
}

// Ví dụ sử dụng chi tiết
/*
<script>
// Cấu hình cơ bản
initAuthorSEO({
    authorName: 'Ung Hoang Phi Dang',
    genre: 'romantic suspense',
    siteName: 'Ung Hoang Phi Dang Official',
    
    // Thông tin chi tiết
    authorBio: 'Tác giả chuyên viết tiểu thuyết tình cảm bí ẩn',
    authorPhoto: 'https://uhpd.shop/author-photo.jpg',
    
    // Social media
    socialMedia: {
        facebook: 'https://facebook.com/PhiDangUngHoangAuthor',
        twitter: '@PhiDangUngHoang',
        amazon: 'https://amazon.com/author/phidangunghoang'
    },
    
    // Cấu hình sách
    isbn: 'B0FB51KH6M',
    price: '2.99',
    rating: {
        value: '4.5',
        count: '12'
    },
    
    // Facebook App ID cho tracking
    facebookAppId: 'YOUR_FB_APP_ID'
});

// Tối ưu SEO cho blog post cụ thể
optimizeBlogSEO({
    title: 'Làm sao để viết cảnh lãng mạn không sến',
    category: 'Kỹ thuật viết',
    tags: ['viết lãng mạn', 'kỹ thuật', 'cảnh tình cảm'],
    description: 'Chia sẻ bí quyết viết cảnh lãng mạn tự nhiên và cảm động...'
});

// Cập nhật SEO khi chuyển trang
// Cho trang sách
updatePageSEO('book', {
    bookTitle: 'Massé Life',
    bookDescription: 'Câu chuyện tình yêu đầy bí ẩn...',
    isbn: 'B0FB51KH6M'
});

// Cho trang blog
updatePageSEO('blog', {
    postTitle: 'Cảm hứng sáng tác từ đâu?',
    category: 'Chia sẻ kinh nghiệm'
});
</script>
*/// Hệ thống SEO tự động cho Author Website
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
    
    // SEO cho blog/tin tức - tối ưu cho thu hút người dùng
    generateBlogSEO(baseData) {
        const postTitle = this.extractPostTitle();
        const postDescription = this.extractPostDescription();
        const postImage = this.findPostImage();
        const publishDate = this.extractPublishDate();
        const modifiedDate = this.extractModifiedDate();
        const category = this.extractCategory();
        const tags = this.extractTags();
        
        // Tạo title hấp dẫn cho blog
        let title;
        if (postTitle) {
            // Thêm từ khóa hấp dẫn cho blog thu hút người dùng
            const attractiveWords = ['Bí mật', 'Cách', 'Hướng dẫn', 'Kinh nghiệm', 'Chia sẻ'];
            const hasAttractiveWord = attractiveWords.some(word => postTitle.includes(word));
            
            if (!hasAttractiveWord && postTitle.length < 50) {
                title = `${postTitle} - Kinh nghiệm từ ${baseData.authorName}`;
            } else {
                title = `${postTitle} | Blog ${baseData.authorName}`;
            }
        } else {
            title = `Blog - ${baseData.authorName} | Chia sẻ về ${baseData.genre}`;
        }
        
        // Tạo description hấp dẫn
        let description = postDescription;
        if (!description || description.length < 120) {
            description = `Khám phá những chia sẻ thú vị từ ${baseData.authorName} về nghệ thuật sáng tác ${baseData.genre}. Cảm hứng, kỹ thuật viết và những câu chuyện hậu trường đầy bất ngờ.`;
        }
        
        // Keywords cho blog thu hút traffic
        const blogKeywords = [
            postTitle,
            baseData.authorName,
            'blog tác giả',
            'cách viết truyện',
            'kỹ thuật sáng tác',
            baseData.genre,
            'cảm hứng viết truyện',
            'chia sẻ tác giả',
            'nghệ thuật kể chuyện',
            'viết tiểu thuyết',
            ...tags
        ].filter(Boolean);
        
        return {
            ...baseData,
            title,
            description,
            image: postImage || baseData.image,
            keywords: blogKeywords,
            type: 'article',
            publishDate,
            modifiedDate,
            category,
            tags,
            readingTime: this.calculateReadingTime(),
            structuredData: this.generateBlogStructuredData({
                ...baseData,
                postTitle,
                postDescription: description,
                postImage,
                publishDate,
                modifiedDate,
                category,
                tags
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
            ogTags['og:image:width'] = '1200';
            ogTags['og:image:height'] = '630';
            ogTags['og:image:type'] = 'image/jpeg';
        }
        
        if (seoData.publishDate) {
            ogTags['article:published_time'] = seoData.publishDate;
            ogTags['article:modified_time'] = seoData.modifiedDate || seoData.publishDate;
            ogTags['article:author'] = seoData.authorName;
            ogTags['article:section'] = 'Literature';
            ogTags['article:tag'] = seoData.genre;
            
            // Thêm tags cho blog posts
            if (this.pageType === 'blog') {
                ogTags['article:tag'] = 'writing tips';
                ogTags['article:tag'] = 'author insights';
                ogTags['article:tag'] = 'creative writing';
            }
        }
        
        // Facebook App ID nếu có
        if (this.config.facebookAppId) {
            ogTags['fb:app_id'] = this.config.facebookAppId;
        }
        
        // Book-specific tags
        if (seoData.type === 'book') {
            ogTags['book:author'] = seoData.authorName;
            ogTags['book:isbn'] = seoData.isbn || '';
            ogTags['book:release_date'] = seoData.publishDate;
            ogTags['book:tag'] = seoData.genre;
        }
        
        Object.entries(ogTags).forEach(([property, content]) => {
            if (content) {
                this.setOrUpdateMeta('property', property, content);
            }
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
            twitterTags['twitter:image:alt'] = seoData.title;
        }
        
        // Thêm Twitter labels cho rich data
        if (seoData.type === 'book') {
            twitterTags['twitter:label1'] = 'Thể loại';
            twitterTags['twitter:data1'] = seoData.genre;
            twitterTags['twitter:label2'] = 'Tác giả';
            twitterTags['twitter:data2'] = seoData.authorName;
        } else if (this.pageType === 'blog') {
            twitterTags['twitter:label1'] = 'Thời gian đọc';
            twitterTags['twitter:data1'] = this.calculateReadingTime() + ' phút';
            twitterTags['twitter:label2'] = 'Chủ đề';
            twitterTags['twitter:data2'] = 'Sáng tác';
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
    
    // Tạo Structured Data cho tác giả - nâng cao
    generateAuthorStructuredData(data) {
        return {
            "@context": "https://schema.org",
            "@type": "Person",
            "@id": `${data.url}/author#person`,
            "name": data.authorName,
            "givenName": this.config.givenName || data.authorName.split(' ').slice(-1)[0],
            "familyName": this.config.familyName || data.authorName.split(' ').slice(0, -1).join(' '),
            "jobTitle": "Novelist",
            "description": this.config.authorBio || `Vietnamese author specializing in ${data.genre} and psychological thrillers`,
            "genre": data.genre,
            "url": data.url,
            "image": this.config.authorPhoto || data.image,
            "birthPlace": this.config.birthPlace || "Vietnam",
            "nationality": "Vietnamese",
            "knowsLanguage": ["Vietnamese", "English"],
            "alumniOf": this.config.education || "",
            "award": this.config.awards || "",
            "worksFor": {
                "@type": "Organization",
                "name": "Independent Author"
            },
            "sameAs": Object.values(this.config.socialMedia).filter(url => url),
            "mainEntityOfPage": data.url,
            "hasOccupation": {
                "@type": "Occupation",
                "name": "Author",
                "occupationLocation": {
                    "@type": "Country",
                    "name": "Vietnam"
                }
            }
        };
    }
    
    // Tạo Structured Data cho sách - chi tiết hơn
    generateBookStructuredData(data) {
        return {
            "@context": "https://schema.org",
            "@type": "Book",
            "@id": `${data.url}#book`,
            "name": data.bookTitle,
            "alternateName": this.config.bookAlternateName || "",
            "author": {
                "@type": "Person",
                "@id": `${data.domain}/author#person`,
                "name": data.authorName
            },
            "description": data.bookDescription,
            "isbn": this.config.isbn || "",
            "bookFormat": "https://schema.org/EBook",
            "inLanguage": data.language,
            "originalLanguage": this.config.originalLanguage || "vi",
            "numberOfPages": this.config.numberOfPages || "",
            "genre": Array.isArray(data.genre) ? data.genre : [data.genre],
            "datePublished": this.config.datePublished || new Date().toISOString().split('T')[0],
            "copyrightYear": new Date().getFullYear().toString(),
            "publisher": {
                "@type": "Organization", 
                "name": this.config.publisher || "Amazon Kindle Direct Publishing"
            },
            "offers": {
                "@type": "Offer",
                "url": this.config.buyUrl || data.url,
                "priceCurrency": this.config.currency || "USD",
                "price": this.config.price || "2.99",
                "availability": "https://schema.org/InStock",
                "validFrom": this.config.datePublished || new Date().toISOString().split('T')[0],
                "seller": {
                    "@type": "Organization",
                    "name": "Amazon"
                }
            },
            "aggregateRating": this.config.rating ? {
                "@type": "AggregateRating",
                "ratingValue": this.config.rating.value || "4.5",
                "reviewCount": this.config.rating.count || "12",
                "bestRating": "5",
                "worstRating": "1"
            } : undefined,
            "image": data.bookImage || data.image,
            "url": data.url,
            "mainEntityOfPage": data.url,
            "keywords": Array.isArray(data.keywords) ? data.keywords.join(', ') : data.keywords,
            "about": [
                { "@type": "Thing", "name": data.genre },
                { "@type": "Thing", "name": "Literature" },
                { "@type": "Thing", "name": "Fiction" }
            ]
        };
    }
    
    // Tạo Structured Data cho blog - tối ưu cho SEO
    generateBlogStructuredData(data) {
        return {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "@id": `${data.url}#article`,
            "headline": data.postTitle,
            "description": data.postDescription,
            "author": {
                "@type": "Person",
                "@id": `${data.domain}/author#person`,
                "name": data.authorName
            },
            "publisher": {
                "@type": "Organization",
                "name": data.siteName || data.authorName,
                "logo": {
                    "@type": "ImageObject",
                    "url": this.config.logo || data.image
                }
            },
            "datePublished": data.publishDate,
            "dateModified": data.modifiedDate || data.publishDate,
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": data.url
            },
            "image": {
                "@type": "ImageObject",
                "url": data.postImage || data.image,
                "width": 1200,
                "height": 630
            },
            "articleSection": data.category || "Writing",
            "keywords": data.tags ? data.tags.join(', ') : data.keywords,
            "wordCount": this.calculateWordCount(),
            "timeRequired": `PT${data.readingTime}M`,
            "url": data.url,
            "isPartOf": {
                "@type": "Blog",
                "name": `${data.authorName} Blog`,
                "url": `${data.domain}/blog`
            },
            "about": [
                { "@type": "Thing", "name": "Creative Writing" },
                { "@type": "Thing", "name": "Author Insights" },
                { "@type": "Thing", "name": data.genre }
            ]
        };
    }
    
    // Utility functions bổ sung
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
    
    // Helper cho link tags
    setLinkTag(attribute, rel, href, type = null, title = null) {
        if (!href) return;
        
        let link = document.querySelector(`link[${attribute}="${rel}"]`);
        if (!link) {
            link = document.createElement('link');
            link.setAttribute(attribute, rel);
            document.head.appendChild(link);
        }
        link.href = href;
        if (type) link.type = type;
        if (title) link.title = title;
    }
    
    // Thiết lập preloading cho performance
    setupPreloading(seoData) {
        // Preload ảnh chính
        if (seoData.image) {
            this.setLinkTag('rel', 'preload', seoData.image, null, null);
            const link = document.querySelector(`link[rel="preload"][href="${seoData.image}"]`);
            if (link) link.as = 'image';
        }
        
        // Preload fonts
        const fonts = this.config.criticalFonts || [];
        fonts.forEach(font => {
            this.setLinkTag('rel', 'preload', font, 'font/woff2', null);
            const link = document.querySelector(`link[rel="preload"][href="${font}"]`);
            if (link) {
                link.as = 'font';
                link.crossOrigin = 'anonymous';
            }
        });
    }
    
    // Thiết lập DNS prefetch
    setupDNSPrefetch() {
        const domains = [
            'amazon.com',
            'google.com', 
            'facebook.com',
            'twitter.com',
            'instagram.com',
            'goodreads.com',
            'm.media-amazon.com',
            'images-na.ssl-images-amazon.com'
        ];
        
        domains.forEach(domain => {
            this.setLinkTag('rel', 'dns-prefetch', `//${domain}`);
        });
    }
    
    // Tính thời gian đọc
    calculateReadingTime() {
        const text = document.body.textContent || '';
        const words = text.trim().split(/\s+/).length;
        const readingSpeed = 200; // từ/phút cho tiếng Việt
        return Math.ceil(words / readingSpeed);
    }
    
    // Tính số từ
    calculateWordCount() {
        const text = document.body.textContent || '';
        return text.trim().split(/\s+/).length;
    }
    
    // Trích xuất category
    extractCategory() {
        return document.querySelector('.post-category')?.textContent?.trim() ||
               document.querySelector('[data-category]')?.getAttribute('data-category') ||
               document.querySelector('.category')?.textContent?.trim() ||
               'Writing';
    }
    
    // Trích xuất tags
    extractTags() {
        const tagElements = document.querySelectorAll('.post-tag, .tag, [data-tag]');
        const tags = Array.from(tagElements).map(el => 
            el.textContent?.trim() || el.getAttribute('data-tag')
        ).filter(Boolean);
        
        return tags.length > 0 ? tags : ['writing', 'author', this.config.genre];
    }
    
    // Trích xuất ngày chỉnh sửa
    extractModifiedDate() {
        const modifiedElement = document.querySelector('[data-modified]') ||
                               document.querySelector('.modified-date') ||
                               document.querySelector('meta[property="article:modified_time"]');
        
        if (modifiedElement) {
            return modifiedElement.getAttribute('data-modified') ||
                   modifiedElement.getAttribute('datetime') ||
                   modifiedElement.content ||
                   modifiedElement.textContent;
        }
        
        return null;
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