/**
 * Slider class to create a carousel slider with navigation controls and dots.
 */
class Slider {
    /**
     * @param {string|Element} selector - CSS selector or DOM element identifying the container of the slider.
     * @param {Object} options - Settings for the slider.
     * @param {boolean} [options.autoplay=false] - Whether slides automatically transition.
     * @param {number} [options.duration=3000] - Duration of the slide transition in milliseconds.
     */
    constructor(selector, options = {}) {
        // Determine container based on the selector
        this.container = typeof selector === 'string' ? document.querySelector(selector) : selector;
        // Find all slides inside the container
        this.slides = this.container.querySelectorAll('.slide');
        // Initialize index to 0
        this.index = 0;
        // Merge options with defaults
        this.options = {
            autoplay: options.autoplay || false,
            duration: options.duration || 3000,
        };
        // Create navigation controls
        this.createNavigation();
        // Start autoplay if enabled
        if (this.options.autoplay) {
            this.startAutoplay();
        }
    }

    /**
     * Creates navigation controls and dots for the slider.
     */
    createNavigation() {
        // Create container for navigation buttons
        this.navigationContainer = document.createElement('div');
        this.navigationContainer.className = 'slider-navigation';

        // Create and set up next button
        this.nextButton = document.createElement('button');
        this.nextButton.className = 'slider-next';
        this.nextButton.innerHTML = '>';
        this.nextButton.addEventListener('click', () => this.next());

        // Create and set up previous button
        this.prevButton = document.createElement('button');
        this.prevButton.className = 'slider-prev';
        this.prevButton.innerHTML = '<';
        this.prevButton.addEventListener('click', () => this.prev());

        // Append buttons to navigation container
        this.navigationContainer.appendChild(this.prevButton);
        this.navigationContainer.appendChild(this.nextButton);
        this.container.appendChild(this.navigationContainer);

        // Create container for dots and add click listeners to jump to respective slides
        this.dotsContainer = document.createElement('div');
        this.dotsContainer.className = 'slider-dots';
        this.slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.addEventListener('click', () => this.goTo(i));
            this.dotsContainer.appendChild(dot);
        });
        this.container.appendChild(this.dotsContainer);
        this.index = 0;
        this.updateDots();
    }

    /**
     * Resets the slider to the first slide with a transition effect.
     */
    resetToFirst() {
        const firstSlideClone = this.slides[0].cloneNode(true);
        firstSlideClone.style.transform = 'translateX(100%)';

        this.container.appendChild(firstSlideClone);

        setTimeout(() => {
            firstSlideClone.style.transform = 'translateX(0)';
        }, 0);

        setTimeout(() => {
            this.slides.forEach(slide => slide.style.transition = 'none');
            for (let i = 1; i < this.slides.length; i++) {
                this.slides[i].style.transform = 'translateX(100%)';
            }
            this.slides[0].style.transform = 'translateX(0)';
            this.container.removeChild(firstSlideClone);
            setTimeout(() => {
                this.slides.forEach(slide => slide.style.transition = 'transform 0.5s ease');
            }, 500);
        }, 500);

        this.index = 0;
        this.updateDots();
    }

    /**
     * Transitions to the next slide.
     */
    next() {
        // Move current slide out of view
        this.slides[this.index].style.transform = 'translateX(-100%)';
        // Increment slide index
        this.index++;
        // If reached end, reset to the first
        if (this.index >= this.slides.length) {
            this.resetToFirst();
        } else {
            // Else, move next slide into view
            this.slides[this.index].style.transform = 'translateX(0)';
        }
        // Update dots to reflect the new current slide
        this.updateDots();
    }

    /**
     * Transitions to the previous slide.
     */
    prev() {
        // Move current slide out of view in the opposite direction
        this.slides[this.index].style.transform = 'translateX(100%)';
        // Decrement slide index
        this.index--;
        // If reached beginning, reset to the last
        if (this.index < 0) {
            this.resetToLast();
        } else {
            // Else, move previous slide into view
            this.slides[this.index].style.transform = 'translateX(0)';
        }
        // Update dots to reflect the new current slide
        this.updateDots();
    }

    /**
     * Resets the slider to the last slide with a transition effect.
     */
    resetToLast() {
        const lastSlideClone = this.slides[this.slides.length - 1].cloneNode(true);
        lastSlideClone.style.transform = 'translateX(-100%)';

        this.container.appendChild(lastSlideClone);

        setTimeout(() => {
            lastSlideClone.style.transform = 'translateX(0)';
        }, 0);

        setTimeout(() => {
            this.slides.forEach(slide => slide.style.transition = 'none');
            for (let i = 0; i < this.slides.length - 1; i++) {
                this.slides[i].style.transform = 'translateX(-100%)';
            }
            this.slides[this.slides.length - 1].style.transform = 'translateX(0)';
            this.container.removeChild(lastSlideClone);
            setTimeout(() => {
                this.slides.forEach(slide => slide.style.transition = 'transform 0.5s ease');
            }, 500);
        }, 500);
        this.index = this.slides.length - 1;
        this.updateDots();
    }

    /**
     * Jumps to a specific slide by index.
     * @param {number} index - Index of the slide to navigate to.
     */
    goTo(index) {
        // Determine the direction and move current slide accordingly
        if (index > this.index) {
            this.slides[this.index].style.transform = 'translateX(-100%)';
        } else {
            this.slides[this.index].style.transform = 'translateX(100%)';
        }
        // Update index and move target slide into view
        this.index = index;
        this.slides[this.index].style.transform = 'translateX(0)';
        // Update dots to reflect the new current slide
        this.updateDots();
    }

    /**
     * Updates the active status of the dots to match the current slide.
     */
    updateDots() {
        // Iterate through dots and mark the current one as active
        Array.from(this.dotsContainer.children).forEach((dot, i) => {
            dot.className = i === this.index ? 'active' : '';
        });
    }

    /**
     * Starts autoplay feature to automatically transition between slides.
     */
    startAutoplay() {
        // Set an interval to call the next method based on the specified duration
        this.interval = setInterval(() => this.next(), this.options.duration);
    }

    /**
     * Stops the autoplay feature.
     */
    stopAutoplay() {
        // Clear the interval to stop the autoplay
        clearInterval(this.interval);
    }
}
