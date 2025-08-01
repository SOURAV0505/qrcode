/**
 * QR Code Generator with Multiple Themes
 * 
 * A feature-rich QR code generator that allows users to create, customize,
 * download, and share QR codes with various visual themes and effects.
 * 
 * Features:
 * - Generate QR codes from any text or URL
 * - Apply various visual themes with SVG filters
 * - Filter themes by categories (popular, modern, creative, best)
 * - Download QR codes as PNG images
 * - Share QR codes via social media or copy link
 * 
 * Dependencies:
 * - qrcode.js - For QR code generation
 * - html-to-image - For capturing QR code as image
 */

document.addEventListener('DOMContentLoaded', function() {
    // ===== DOM Elements =====
    // References to all interactive elements in the UI
    
    // Input section elements
    const qrText = document.getElementById('qrText');
    
    // Theme section elements
    const categoryBtns = document.querySelectorAll('.category-btn');
    const themeOptions = document.querySelectorAll('.theme');
    
    // Result section elements
    const qrCodeDiv = document.getElementById('qrcode');
    const downloadBtn = document.getElementById('downloadBtn');
    const shareBtn = document.getElementById('shareBtn');
    
    // Modal elements
    const shareModal = document.getElementById('shareModal');
    const closeModal = document.querySelector('.close-modal');
    const shareOptions = document.querySelectorAll('.share-option');
    const qrLinkInput = document.getElementById('qr-link');
    const copyLinkBtn = document.getElementById('copy-link-btn');
    
    // Toast notification elements
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    // ===== State Variables =====
    // Track current application state
    let currentTheme = 'normal'; // Default theme
    let qrCode = null;           // QR code instance
    let qrCodeImg = null;        // Generated QR code image HTML
    
    // ===== Theme Filter Functions =====
    /**
     * Creates SVG filter definitions for each theme
     * Each filter applies unique visual effects to the QR code
     * 
     * @param {string} theme - The theme name to create filter for
     * @param {string} filterId - The unique ID for the SVG filter
     * @returns {string} SVG filter definition as HTML string
     */
    function createFilterForTheme(theme, filterId) {
        let filterHTML = '';
        
        switch(theme) {
            case 'normal':
                filterHTML = `
                    <filter id="${filterId}">
                        <feComponentTransfer>
                            <feFuncR type="linear" slope="1.05" intercept="0"/>
                            <feFuncG type="linear" slope="1.05" intercept="0"/>
                            <feFuncB type="linear" slope="1.05" intercept="0"/>
                        </feComponentTransfer>
                        <feConvolveMatrix order="3" kernelMatrix="0 -0.2 0 -0.2 1.8 -0.2 0 -0.2 0" result="sharpen"/>
                    </filter>
                `;
                break;
                
            case 'neon':
                filterHTML = `
                    <filter id="${filterId}">
                        <feGaussianBlur stdDeviation="1.2" result="blur"/>
                        <feFlood flood-color="#42dcff" flood-opacity="0.8" result="color"/>
                        <feComposite in="color" in2="blur" operator="in" result="glow"/>
                        <feBlend in="SourceGraphic" in2="glow" mode="screen"/>
                        <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="1" result="noise" seed="0"/>
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G"/>
                    </filter>
                `;
                break;
                
            case '3d-modern':
                filterHTML = `
                    <filter id="${filterId}">
                        <feConvolveMatrix order="3" kernelMatrix="1 0 0 0 1.2 0 0 0 1" result="emboss"/>
                        <feOffset in="emboss" dx="3" dy="3" result="shadow"/>
                        <feGaussianBlur in="shadow" stdDeviation="0.5" result="blurredShadow"/>
                        <feComposite in="SourceGraphic" in2="blurredShadow" operator="over"/>
                        <feComponentTransfer>
                            <feFuncR type="linear" slope="1.1" intercept="0"/>
                            <feFuncG type="linear" slope="1.1" intercept="0"/>
                            <feFuncB type="linear" slope="1.1" intercept="0"/>
                        </feComponentTransfer>
                    </filter>
                `;
                break;
                
            case 'gradient':
                filterHTML = `
                    <filter id="${filterId}">
                        <feComponentTransfer>
                            <feFuncR type="linear" slope="1.3" intercept="-0.1"/>
                            <feFuncG type="linear" slope="1.1" intercept="0"/>
                            <feFuncB type="linear" slope="1.5" intercept="-0.1"/>
                        </feComponentTransfer>
                        <feColorMatrix type="hueRotate" values="60"/>
                        <feGaussianBlur stdDeviation="0.3" result="blur"/>
                        <feBlend in="SourceGraphic" in2="blur" mode="multiply" result="softened"/>
                        <feComposite in="softened" in2="SourceGraphic" operator="lighter"/>
                    </filter>
                `;
                break;
                
            case 'retro':
                filterHTML = `
                    <filter id="${filterId}">
                        <feColorMatrix type="matrix" values="
                            0.9 0.1 0.1 0 0
                            0.1 0.8 0.1 0 0
                            0.1 0.1 0.5 0 0
                            0 0 0 1 0"/>
                        <feComponentTransfer>
                            <feFuncR type="table" tableValues="0.2 0.8"/>
                            <feFuncG type="table" tableValues="0.2 0.7"/>
                            <feFuncB type="table" tableValues="0.1 0.5"/>
                        </feComponentTransfer>
                    </filter>
                `;
                break;
                
            case 'cyberpunk':
                filterHTML = `
                    <filter id="${filterId}">
                        <feFlood flood-color="#ff2a6d" flood-opacity="0.3" result="color1"/>
                        <feFlood flood-color="#00ffff" flood-opacity="0.3" result="color2"/>
                        <feOffset in="SourceGraphic" dx="-2" dy="0" result="off1"/>
                        <feOffset in="SourceGraphic" dx="2" dy="0" result="off2"/>
                        <feComposite in="color1" in2="off1" operator="in" result="comp1"/>
                        <feComposite in="color2" in2="off2" operator="in" result="comp2"/>
                        <feMerge>
                            <feMergeNode in="comp1"/>
                            <feMergeNode in="comp2"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                `;
                break;
                
            case 'minimal':
                filterHTML = `
                    <filter id="${filterId}">
                        <feColorMatrix type="saturate" values="0.8"/>
                        <feComponentTransfer>
                            <feFuncR type="linear" slope="1.1" intercept="-0.05"/>
                            <feFuncG type="linear" slope="1.1" intercept="-0.05"/>
                            <feFuncB type="linear" slope="1.1" intercept="-0.05"/>
                        </feComponentTransfer>
                    </filter>
                `;
                break;
                
            case 'blueprint':
                filterHTML = `
                    <filter id="${filterId}">
                        <feColorMatrix type="matrix" values="
                            0.1 0 0 0 0
                            0 0.3 0 0 0
                            0 0 0.9 0 0
                            0 0 0 1 0"/>
                    </filter>
                `;
                break;
                
            case 'galaxy':
                filterHTML = `
                    <filter id="${filterId}">
                        <feGaussianBlur stdDeviation="0.5" result="blur"/>
                        <feFlood flood-color="#8a2be2" flood-opacity="0.5" result="color"/>
                        <feComposite in="color" in2="blur" operator="in" result="glow"/>
                        <feBlend in="SourceGraphic" in2="glow" mode="screen"/>
                        <feColorMatrix type="hueRotate" values="270"/>
                    </filter>
                `;
                break;
                
            case 'neon-pink':
                filterHTML = `
                    <filter id="${filterId}">
                        <feGaussianBlur stdDeviation="1" result="blur"/>
                        <feFlood flood-color="#ff69b4" flood-opacity="0.7" result="color"/>
                        <feComposite in="color" in2="blur" operator="in" result="glow"/>
                        <feBlend in="SourceGraphic" in2="glow" mode="screen"/>
                    </filter>
                `;
                break;
                
            case 'matrix':
                filterHTML = `
                    <filter id="${filterId}">
                        <feColorMatrix type="matrix" values="
                            0 0 0 0 0
                            0 1 0 0 0
                            0 0.5 0 0 0
                            0 0 0 1 0"/>
                        <feComponentTransfer>
                            <feFuncG type="linear" slope="1.5" intercept="-0.2"/>
                        </feComponentTransfer>
                    </filter>
                `;
                break;
                
            case 'sunset':
                filterHTML = `
                    <filter id="${filterId}">
                        <feColorMatrix type="matrix" values="
                            1.2 0 0 0 0
                            0.2 0.8 0 0 0
                            0 0 0.8 0 0
                            0 0 0 1 0"/>
                        <feComponentTransfer>
                            <feFuncR type="linear" slope="1.2" intercept="-0.1"/>
                        </feComponentTransfer>
                    </filter>
                `;
                break;

            case 'aqua':
                filterHTML = `
                    <filter id="${filterId}">
                        <feColorMatrix type="matrix" values="
                            0.2 0 0 0 0
                            0 0.8 0 0 0
                            0 0 1.2 0 0
                            0 0 0 1 0"/>
                        <feGaussianBlur stdDeviation="0.5" result="blur"/>
                        <feFlood flood-color="#00ccff" flood-opacity="0.5" result="color"/>
                        <feComposite in="color" in2="blur" operator="in" result="glow"/>
                        <feBlend in="SourceGraphic" in2="glow" mode="screen"/>
                    </filter>
                `;
                break;

            case 'vintage':
                filterHTML = `
                    <filter id="${filterId}">
                        <feColorMatrix type="matrix" values="
                            0.9 0.1 0.1 0 0
                            0.1 0.8 0.1 0 0
                            0.1 0.1 0.5 0 0
                            0 0 0 1 0"/>
                        <feComponentTransfer>
                            <feFuncR type="table" tableValues="0.2 0.6"/>
                            <feFuncG type="table" tableValues="0.2 0.5"/>
                            <feFuncB type="table" tableValues="0.1 0.3"/>
                        </feComponentTransfer>
                        <feConvolveMatrix order="3" kernelMatrix="0 -1 0 -1 5 -1 0 -1 0" result="sharpen"/>
                    </filter>
                `;
                break;

            case 'neon-green':
                filterHTML = `
                    <filter id="${filterId}">
                        <feGaussianBlur stdDeviation="1" result="blur"/>
                        <feFlood flood-color="#39ff14" flood-opacity="0.7" result="color"/>
                        <feComposite in="color" in2="blur" operator="in" result="glow"/>
                        <feBlend in="SourceGraphic" in2="glow" mode="screen"/>
                    </filter>
                `;
                break;

            case 'holographic':
                filterHTML = `
                    <filter id="${filterId}">
                        <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise"/>
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G"/>
                        <feColorMatrix type="hueRotate" values="90"/>
                        <feComponentTransfer>
                            <feFuncR type="linear" slope="1.2" intercept="-0.1"/>
                            <feFuncG type="linear" slope="1.2" intercept="-0.1"/>
                            <feFuncB type="linear" slope="1.2" intercept="-0.1"/>
                        </feComponentTransfer>
                    </filter>
                `;
                break;

            case 'midnight':
                filterHTML = `
                    <filter id="${filterId}">
                        <feColorMatrix type="matrix" values="
                            0.1 0 0 0 0
                            0 0.1 0 0 0
                            0 0 0.3 0 0
                            0 0 0 1 0"/>
                        <feGaussianBlur stdDeviation="0.5" result="blur"/>
                        <feFlood flood-color="#191970" flood-opacity="0.5" result="color"/>
                        <feComposite in="color" in2="blur" operator="in" result="glow"/>
                        <feBlend in="SourceGraphic" in2="glow" mode="screen"/>
                    </filter>
                `;
                break;
                
            case 'cosmic':
                filterHTML = `
                    <filter id="${filterId}">
                        <feGaussianBlur stdDeviation="0.8" result="blur"/>
                        <feFlood flood-color="#7b68ee" flood-opacity="0.6" result="color"/>
                        <feComposite in="color" in2="blur" operator="in" result="glow"/>
                        <feBlend in="SourceGraphic" in2="glow" mode="screen"/>
                        <feColorMatrix type="hueRotate" values="270"/>
                        <feComponentTransfer>
                            <feFuncR type="linear" slope="1.2" intercept="-0.1"/>
                            <feFuncG type="linear" slope="1.1" intercept="0"/>
                            <feFuncB type="linear" slope="1.3" intercept="-0.1"/>
                        </feComponentTransfer>
                    </filter>
                `;
                break;
                
            case 'neon-pulse':
                filterHTML = `
                    <filter id="${filterId}">
                        <feGaussianBlur stdDeviation="1.2" result="blur"/>
                        <feFlood flood-color="#ff00ff" flood-opacity="0.8" result="color"/>
                        <feComposite in="color" in2="blur" operator="in" result="glow"/>
                        <feBlend in="SourceGraphic" in2="glow" mode="screen"/>
                        <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="1" result="noise" seed="0"/>
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G"/>
                    </filter>
                `;
                break;
                
            case 'forest':
                filterHTML = `
                    <filter id="${filterId}">
                        <feColorMatrix type="matrix" values="
                            0.2 0 0 0 0
                            0 0.8 0 0 0
                            0 0.3 0 0 0
                            0 0 0 1 0"/>
                        <feGaussianBlur stdDeviation="0.5" result="blur"/>
                        <feFlood flood-color="#2e8b57" flood-opacity="0.5" result="color"/>
                        <feComposite in="color" in2="blur" operator="in" result="glow"/>
                        <feBlend in="SourceGraphic" in2="glow" mode="screen"/>
                    </filter>
                `;
                break;
                
            case 'golden':
                filterHTML = `
                    <filter id="${filterId}">
                        <feColorMatrix type="matrix" values="
                            1.2 0 0 0 0
                            0.8 0.8 0 0 0
                            0.3 0.3 0.3 0 0
                            0 0 0 1 0"/>
                        <feGaussianBlur stdDeviation="0.5" result="blur"/>
                        <feFlood flood-color="#daa520" flood-opacity="0.5" result="color"/>
                        <feComposite in="color" in2="blur" operator="in" result="glow"/>
                        <feBlend in="SourceGraphic" in2="glow" mode="screen"/>
                    </filter>
                `;
                break;
                
            default:
                filterHTML = `<filter id="${filterId}"></filter>`;
        }
        
        return filterHTML;
    }
    
    // ===== Core QR Code Functions =====
    /**
     * Generates a QR code based on the input text
     * Applies styling and SVG filters to the generated QR code
     * 
     * @param {string} text - The text to encode in the QR code
     */
    function generateQRCode(text) {
        // Clear previous QR code and SVG filters
        qrCodeDiv.innerHTML = '';
        
        const existingSvgFilters = document.getElementById('qr-svg-filters');
        if (existingSvgFilters) {
            document.body.removeChild(existingSvgFilters);
        }
        
        // Show placeholder if no text is provided
        if (!text) {
            qrCodeDiv.innerHTML = '<div style="text-align: center;"><p style="color: var(--text-color-secondary); margin-bottom: 10px;">Enter text to generate QR code</p><i class="fas fa-qrcode" style="font-size: 60px; color: var(--surface-color-light); opacity: 0.5;"></i></div>';
            downloadBtn.disabled = true;
            shareBtn.disabled = true;
            return;
        }
        
        // Generate QR code using qrcode.js library
        qrCode = qrcode(0, 'L'); // Level L error correction
        try {
            qrCode.addData(text);
            qrCode.make();
            
            // Create QR code image with higher quality
            qrCodeImg = qrCode.createImgTag(10); // Size multiplier for better quality
            qrCodeDiv.innerHTML = qrCodeImg;
            
            const imgElement = qrCodeDiv.querySelector('img');
            
            if (imgElement) {
                // Apply base styling to QR code image
                imgElement.style.display = 'inline-block';
                imgElement.style.maxWidth = '100%';
                imgElement.style.height = 'auto';
                
                imgElement.classList.add('qr-img-styled');
                imgElement.alt = 'QR Code for: ' + text.substring(0, 30) + (text.length > 30 ? '...' : '');
                
                // Remove white background and add styling
                imgElement.style.backgroundColor = 'transparent';
                imgElement.style.borderRadius = '8px';
                imgElement.style.padding = '5px';
                imgElement.style.transition = 'filter 0.3s ease, transform 0.3s ease';
                
                // Apply SVG filter for visual effects
                const svgFilterId = 'qr-filter-' + currentTheme;
                const existingFilter = document.getElementById(svgFilterId);
                
                if (!existingFilter) {
                    // Create SVG filter element if it doesn't exist
                    const svgFilter = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    svgFilter.id = 'qr-svg-filters';
                    svgFilter.style.width = '0';
                    svgFilter.style.height = '0';
                    svgFilter.style.position = 'absolute';
                    svgFilter.style.visibility = 'hidden';
                    
                const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
                const filterHTML = createFilterForTheme(currentTheme, svgFilterId);
                defs.innerHTML = filterHTML;
                svgFilter.appendChild(defs);
                
                document.body.appendChild(svgFilter);
                }
                
                // Apply the filter to the QR code image
                imgElement.style.filter = 'url(#' + svgFilterId + ')';
                imgElement.classList.add('qr-img-' + currentTheme);
            }
            
            // Apply theme styling to container
            applyTheme(currentTheme);
            
            // Enable action buttons
            downloadBtn.disabled = false;
            shareBtn.disabled = false;
        } catch (error) {
            qrCodeDiv.innerHTML = '<p style="color: var(--text-color-secondary);">Error generating QR code</p>';
            console.error('Error generating QR code:', error);
        }
    }
    
    // ===== Theme Management Functions =====
    /**
     * Applies a theme to the QR code and updates UI
     * Creates and applies SVG filters for visual effects
     * 
     * @param {string} theme - The theme to apply
     */
    function applyTheme(theme) {
        // Reset container classes and add theme class
        qrCodeDiv.parentElement.className = 'qr-container';
        qrCodeDiv.parentElement.classList.add('qr-' + theme);
        
        // Update active theme button
        themeOptions.forEach(option => {
            if (option.dataset.theme === theme) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
        
        // Apply styling to QR code image if it exists
        if (qrCodeDiv.querySelector('img')) {
            const qrImg = qrCodeDiv.querySelector('img');
            
            // Reset classes and add theme-specific class
            qrImg.className = 'qr-img-styled';
            qrImg.classList.add('qr-img-' + theme);
            
            // Ensure proper styling
            qrImg.style.backgroundColor = 'transparent';
            qrImg.style.display = 'inline-block';
            
            // Create a unique filter ID for this theme
            const filterId = 'qr-filter-' + theme;
            
            // Check if filter already exists
            let filterElement = document.getElementById(filterId);
            
            // If filter doesn't exist, create it
            if (!filterElement) {
                let svgFilters = document.getElementById('qr-svg-filters');
                if (!svgFilters) {
                    svgFilters = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    svgFilters.id = 'qr-svg-filters';
                    svgFilters.style.width = '0';
                    svgFilters.style.height = '0';
                    svgFilters.style.position = 'absolute';
                    svgFilters.style.visibility = 'hidden';
                    document.body.appendChild(svgFilters);
                }
                
                let defs = svgFilters.querySelector('defs');
                if (!defs) {
                    defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
                    svgFilters.appendChild(defs);
                }
                
                // Add the filter definition
                const filterHTML = createFilterForTheme(theme, filterId);
                defs.innerHTML += filterHTML;
            }
            
            // Apply the filter to the QR code image
            qrImg.style.filter = `url(#${filterId})`;
        }
        
        // Update current theme
        currentTheme = theme;
    }
    
    /**
     * Filters themes by category and updates UI
     * 
     * @param {string} category - The category to filter by
     */
    function filterThemes(category) {
        // Update active category button
        categoryBtns.forEach(btn => {
            if (btn.dataset.category === category) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Show all themes if category is 'all'
        if (category === 'all') {
            themeOptions.forEach(option => {
                option.style.display = 'flex';
            });
            return;
        }
        
        // Define theme categories for filtering
        const themeCategories = {
            'popular': ['gradient', 'neon', 'minimal', 'galaxy', 'neon-pink', 'aqua', 'holographic', 'cosmic', 'retro', 'cyberpunk', 'blueprint', 'matrix', 'vintage'],
            'modern': ['3d-modern', 'minimal', 'gradient', 'blueprint', 'sunset', 'midnight', 'aqua', 'neon-pulse'],
            'creative': ['cyberpunk', 'retro', 'neon', '3d-modern', 'matrix', 'galaxy', 'neon-green', 'vintage', 'holographic'],
            'best': ['holographic', 'cosmic', 'neon-pulse', 'forest', 'golden', 'aqua', 'vintage', 'neon-green', 'midnight']
        };
        
        // Show/hide themes based on selected category
        themeOptions.forEach(option => {
            if (themeCategories[category].includes(option.dataset.theme)) {
                option.style.display = 'flex';
            } else {
                option.style.display = 'none';
            }
        });
    }
    
    // ===== Action Functions =====
    /**
     * Downloads the QR code as a PNG image
     * Uses html-to-image library to capture the styled QR code
     */
    function downloadQRCode() {
        if (!qrCodeImg) return;
        
        // Show loading state
        downloadBtn.classList.add('loading');
        
        // Create a container with the themed QR code for download
        const container = document.createElement('div');
        const qrContainer = qrCodeDiv.parentElement.cloneNode(true);
        
        // Set proper dimensions and styling
        qrContainer.style.width = '300px';
        qrContainer.style.height = '300px';
        qrContainer.style.margin = '0';
        qrContainer.style.padding = '20px';
        qrContainer.style.backgroundColor = 'transparent';
        
        // Ensure the QR image has all the styling
        const qrImg = qrContainer.querySelector('img');
        if (qrImg) {
            qrImg.className = 'qr-img-styled';
            qrImg.classList.add('qr-img-' + currentTheme);
            
            // Apply the SVG filter
            const filterId = 'qr-filter-' + currentTheme;
            qrImg.style.filter = `url(#${filterId})`;
            
            // Additional styling for download
            qrImg.style.backgroundColor = 'transparent';
            qrImg.style.borderRadius = '8px';
            qrImg.style.padding = '5px';
            qrImg.style.mixBlendMode = 'multiply';
        }
        
        // Create an invisible container for capturing
        const hiddenContainer = document.createElement('div');
        hiddenContainer.style.position = 'absolute';
        hiddenContainer.style.left = '-9999px';
        hiddenContainer.style.top = '-9999px';
        hiddenContainer.style.opacity = '0';
        hiddenContainer.appendChild(qrContainer);
        document.body.appendChild(hiddenContainer);
        
        // Use html-to-image to capture the styled QR code
        htmlToImage.toPng(qrContainer, { quality: 1.0, pixelRatio: 2 })
            .then(function(dataUrl) {
                // Create download link
                const link = document.createElement('a');
                link.download = 'qrcode-' + currentTheme + '.png';
                link.href = dataUrl;
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                
                // Clean up
                document.body.removeChild(hiddenContainer);
                document.body.removeChild(link);
                downloadBtn.classList.remove('loading');
                showToast('QR Code downloaded successfully!');
            })
            .catch(function(error) {
                console.error('Error downloading QR code:', error);
                document.body.removeChild(hiddenContainer);
                downloadBtn.classList.remove('loading');
                showToast('Failed to download QR code', 'error');
            });
    }
    
    /**
     * Prepares QR code for sharing and displays share modal
     * Generates image data URL for sharing options
     */
    function shareQRCode() {
        // Show loading state
        shareBtn.classList.add('loading');
        
        // Set current URL in the input field
        qrLinkInput.value = window.location.href;
        
        // Create a container with the themed QR code for sharing
        const container = document.createElement('div');
        container.innerHTML = qrCodeImg;
        container.className = 'qr-' + currentTheme;
        container.style.padding = '20px';
        container.style.display = 'inline-block';
        container.style.backgroundColor = getComputedStyle(qrCodeDiv.parentElement).backgroundColor;
        container.style.borderRadius = '12px';
        
        // Create an invisible container for capturing
        const hiddenContainer = document.createElement('div');
        hiddenContainer.style.position = 'absolute';
        hiddenContainer.style.left = '-9999px';
        hiddenContainer.style.top = '-9999px';
        hiddenContainer.style.opacity = '0';
        hiddenContainer.appendChild(container);
        document.body.appendChild(hiddenContainer);
        
        // Generate image data URL for sharing
        htmlToImage.toPng(container)
            .then(function(dataUrl) {
                // Store the data URL for sharing
                window.qrImageDataUrl = dataUrl;
                
                // Clean up
                document.body.removeChild(hiddenContainer);
                
                // Remove loading state
                shareBtn.classList.remove('loading');
                
                // Show share modal
                shareModal.style.display = 'flex';
            })
            .catch(function(error) {
                console.error('Error preparing QR code for sharing:', error);
                document.body.removeChild(hiddenContainer);
                shareBtn.classList.remove('loading');
                showToast('Error preparing QR code for sharing', 'error');
            });
    }
    
    // ===== Utility Functions =====
    /**
     * Shows a toast notification
     * 
     * @param {string} message - The message to display
     * @param {string} type - The type of toast (success or error)
     */
    function showToast(message, type = 'success') {
        toast.className = type === 'success' ? 'toast success' : 'toast error';
        toastMessage.textContent = message;
        toast.style.display = 'flex';
        
        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }
    
    /**
     * Copies text to clipboard with loading indicator
     * 
     * @param {string} text - The text to copy
     */
    function copyToClipboard(text) {
        // Add loading indicator
        copyLinkBtn.classList.add('loading');
        
        navigator.clipboard.writeText(text)
            .then(() => {
                setTimeout(() => {
                    copyLinkBtn.classList.remove('loading');
                    showToast('Link copied to clipboard!');
                }, 300); // Short delay for loading animation
            })
            .catch(err => {
                copyLinkBtn.classList.remove('loading');
                showToast('Failed to copy link!', 'error');
                console.error('Could not copy text: ', err);
            });
    }
    
    // ===== Event Listeners =====
    
    // Input Section Event Listeners
    qrText.addEventListener('input', function() {
        generateQRCode(this.value);
    });
    
    // Theme Section Event Listeners
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const theme = this.dataset.theme;
            applyTheme(theme);
        });
    });
    
    // Category Section Event Listeners
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            filterThemes(category);
        });
    });
    
    // Action Buttons Event Listeners
    downloadBtn.addEventListener('click', downloadQRCode);
    shareBtn.addEventListener('click', shareQRCode);
    
    // Modal Event Listeners
    closeModal.addEventListener('click', function() {
        shareModal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === shareModal) {
            shareModal.style.display = 'none';
        }
    });
    
    // Share Options Event Listeners
    shareOptions.forEach(option => {
        option.addEventListener('click', function() {
            const platform = this.dataset.platform;
            let shareUrl = '';
            
            // Show loading indicator
            this.classList.add('loading');
            
            // Share based on platform with a slight delay to show loading
            setTimeout(() => {
                switch (platform) {
                    case 'facebook':
                        shareUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href);
                        window.open(shareUrl, '_blank');
                        break;
                    case 'twitter':
                        shareUrl = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent('Check out my QR code!') + '&url=' + encodeURIComponent(window.location.href);
                        window.open(shareUrl, '_blank');
                        break;
                    case 'whatsapp':
                        shareUrl = 'https://api.whatsapp.com/send?text=' + encodeURIComponent('Check out my QR code! ' + window.location.href);
                        window.open(shareUrl, '_blank');
                        break;
                    case 'email':
                        shareUrl = 'mailto:?subject=' + encodeURIComponent('QR Code') + '&body=' + encodeURIComponent('Check out my QR code! ' + window.location.href);
                        window.location.href = shareUrl;
                        break;
                }
                
                // Remove loading indicator and hide modal
                this.classList.remove('loading');
                shareModal.style.display = 'none';
                showToast('QR Code shared successfully!');
            }, 800); // Delay to show loading animation
        });
    });
    
    // Copy Link Event Listener
    copyLinkBtn.addEventListener('click', function() {
        copyToClipboard(qrLinkInput.value);
    });
    
    // ===== Initialization =====
    
    // Initialize with empty input and placeholder
    qrText.value = '';
    generateQRCode('');
    
    // Initialize with default theme after a small delay
    setTimeout(() => {
        applyTheme('normal');
        filterThemes('popular');
    }, 100);
    
    /**
     * QR Code Generator
     * Created by @CodingWriter2.0
     */
});