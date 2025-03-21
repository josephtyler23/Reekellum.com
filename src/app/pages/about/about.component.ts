import { Component, ElementRef, OnInit, OnDestroy, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit, OnDestroy {
  // Current slide index for the slideshow
  currentSlide = 0;
  private slideInterval: any;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    // Make sure the background video is visible
    const bgVideo = document.getElementById('background-video');
    if (bgVideo && bgVideo.parentElement) {
      this.renderer.setStyle(bgVideo.parentElement, 'display', 'block');
      this.renderer.setStyle(bgVideo.parentElement, 'opacity', '1');
      this.renderer.setStyle(bgVideo.parentElement, 'z-index', '-1');
    }
    
    this.startSlideshow();
    this.setupAnimations();
    
    // Add a class to body for page-specific styling
    this.renderer.addClass(document.body, 'about-page-active');
  }

  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
    
    // Reset video styles when leaving
    const bgVideo = document.getElementById('background-video');
    if (bgVideo && bgVideo.parentElement) {
      this.renderer.removeStyle(bgVideo.parentElement, 'opacity');
      this.renderer.removeStyle(bgVideo.parentElement, 'z-index');
    }
    
    // Remove the body class
    this.renderer.removeClass(document.body, 'about-page-active');
  }

  startSlideshow() {
    // Start with first slide active
    this.currentSlide = 0;
    
    // Change slides every 5 seconds
    this.slideInterval = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % 4; // 4 slides total
    }, 5000);
    
    // Process each image for best display
    setTimeout(() => {
      const slides = this.el.nativeElement.querySelectorAll('.slideshow-image');
      slides.forEach((img: HTMLImageElement) => {
        // If image is already loaded, set proper styling
        if (img.complete) {
          const isPortrait = img.naturalHeight > img.naturalWidth;
          if (isPortrait) {
            this.renderer.setStyle(img, 'object-position', 'center 15%');
          }
        } else {
          // Otherwise wait for load event
          img.onload = () => {
            const isPortrait = img.naturalHeight > img.naturalWidth;
            if (isPortrait) {
              this.renderer.setStyle(img, 'object-position', 'center 15%');
            }
          };
        }
      });
    }, 100);
  }

  setupAnimations() {
    // Set initial opacity for animation targets
    const animationTargets = [
      this.el.nativeElement.querySelector('.about-content'),
      ...this.el.nativeElement.querySelectorAll('.feature-box'),
      this.el.nativeElement.querySelector('.slideshow-section')
    ];
    
    // Set initial state for animations
    animationTargets.forEach(element => {
      if (element) {
        this.renderer.setStyle(element, 'opacity', '0');
        this.renderer.setStyle(element, 'transform', 'translateY(20px)');
      }
    });
    
    // Create observer for scroll-based animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.renderer.addClass(entry.target, 'animate');
        }
      });
    }, { threshold: 0.1 });
    
    // Observe elements for animation
    animationTargets.forEach(element => {
      if (element) {
        observer.observe(element);
      }
    });
  }
}