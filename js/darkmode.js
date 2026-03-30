// ============================================
// DARK MODE TOGGLE - PERSISTENT
// ============================================

class DarkModeManager {
    constructor() {
        this.darkModeClass = 'dark-mode';
        this.storageKey = 'portfolioDarkMode';
        this.transitionClass = 'theme-transition';
        this.transitionDurationMs = 500;
        this.transitionTimer = null;
        this.pullTimer = null;
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
                this.applyTheme(e.target.checked);
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
        this.applyTheme(true);
    }

    disableDarkMode() {
        this.applyTheme(false);
    }

    applyTheme(isDarkMode) {
        this.startThemeTransition();

        if (isDarkMode) {
            document.documentElement.classList.add(this.darkModeClass);
        } else {
            document.documentElement.classList.remove(this.darkModeClass);
        }

        const toggle = document.getElementById('darkModeToggle');
        if (toggle) {
            toggle.checked = isDarkMode;
        }

        const emoji = document.getElementById('darkModeEmoji');
        if (emoji) {
            emoji.textContent = isDarkMode ? '🌙' : '☀️';
            this.triggerPullAnimation(emoji);
        }

        localStorage.setItem(this.storageKey, String(isDarkMode));
    }

    startThemeTransition() {
        const root = document.documentElement;
        root.classList.add(this.transitionClass);

        if (this.transitionTimer) {
            clearTimeout(this.transitionTimer);
        }

        this.transitionTimer = setTimeout(() => {
            root.classList.remove(this.transitionClass);
            this.transitionTimer = null;
        }, this.transitionDurationMs);
    }

    triggerPullAnimation(emoji) {
        emoji.classList.remove('is-pulled');
        void emoji.offsetWidth;
        emoji.classList.add('is-pulled');

        if (this.pullTimer) {
            clearTimeout(this.pullTimer);
        }

        this.pullTimer = setTimeout(() => {
            emoji.classList.remove('is-pulled');
            this.pullTimer = null;
        }, 520);
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
