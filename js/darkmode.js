// ============================================
// DARK MODE TOGGLE - PERSISTENT
// ============================================

class DarkModeManager {
    constructor() {
        this.darkModeClass = 'dark-mode';
        this.storageKey = 'portfolioDarkMode';
        this.init();
    }

    init() {
        // Apply dark mode immediately before content renders (prevent flashing)
        const isDarkMode = localStorage.getItem(this.storageKey) === 'true';
        if (isDarkMode) {
            document.documentElement.classList.add(this.darkModeClass);
            this.updateEmojiDisplay(true);
        } else {
            this.updateEmojiDisplay(false);
        }

        // Setup toggle after page load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupToggle());
        } else {
            this.setupToggle();
        }
    }

    setupToggle() {
        const toggle = document.getElementById('darkModeToggle');
        if (toggle) {
            const isDarkMode = localStorage.getItem(this.storageKey) === 'true';
            toggle.checked = isDarkMode;
            toggle.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.enableDarkMode();
                } else {
                    this.disableDarkMode();
                }
            });
        }
    }

    updateEmojiDisplay(isDarkMode) {
        const emoji = document.getElementById('darkModeEmoji');
        if (emoji) {
            emoji.textContent = isDarkMode ? '🌙' : '☀️';
        }
    }

    enableDarkMode() {
        document.documentElement.classList.add(this.darkModeClass);
        const toggle = document.getElementById('darkModeToggle');
        if (toggle) {
            toggle.checked = true;
        }
        const emoji = document.getElementById('darkModeEmoji');
        if (emoji) {
            emoji.textContent = '🌙';
            this.triggerEmojiAnimation(emoji);
        }
        localStorage.setItem(this.storageKey, 'true');
    }

    disableDarkMode() {
        document.documentElement.classList.remove(this.darkModeClass);
        const toggle = document.getElementById('darkModeToggle');
        if (toggle) {
            toggle.checked = false;
        }
        const emoji = document.getElementById('darkModeEmoji');
        if (emoji) {
            emoji.textContent = '☀️';
            this.triggerEmojiAnimation(emoji);
        }
        localStorage.setItem(this.storageKey, 'false');
    }

    triggerEmojiAnimation(emoji) {
        emoji.style.animation = 'none';
        // Trigger reflow to restart animation
        void emoji.offsetWidth;
        emoji.style.animation = 'emojiToggle 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards';
    }

    toggle() {
        const isDarkMode = document.documentElement.classList.contains(this.darkModeClass);
        if (isDarkMode) {
            this.disableDarkMode();
        } else {
            this.enableDarkMode();
        }
    }
}

// Initialize immediately (not on DOMContentLoaded)
const darkModeManager = new DarkModeManager();
