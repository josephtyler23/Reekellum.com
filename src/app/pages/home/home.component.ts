import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  isMuted: boolean = true; // Default to muted
  isPlaying: boolean = false;

  constructor() { }

  ngOnInit(): void {
    // Initialization logic here
  }

  ngAfterViewInit(): void {
    // Force video to play after component is fully loaded
    this.playVideo();
    
    // Add additional event listeners to try playing the video
    document.addEventListener('DOMContentLoaded', () => this.playVideo());
    window.addEventListener('load', () => this.playVideo());
    
    // Try playing video on user interaction (many browsers require this)
    document.addEventListener('click', () => this.playVideo(), { once: true });
    
    // Set up event listeners to detect actual video state
    const video = document.getElementById('background-video') as HTMLVideoElement;
    if (video) {
      video.addEventListener('play', () => {
        this.isPlaying = true;
        console.log('Video playing');
      });
      
      video.addEventListener('pause', () => {
        this.isPlaying = false;
        console.log('Video paused');
      });
    }
    
    // Add scroll down functionality
    const scrollDownElement = document.querySelector('.scroll-down');
    if (scrollDownElement) {
      scrollDownElement.addEventListener('click', this.scrollDown);
    }
    
    // Initialize mute button state
    setTimeout(() => {
      this.updateMuteIcon();
    }, 500);
  }

  ngOnDestroy(): void {
    // Clean up event listeners when component is destroyed
    const scrollDownElement = document.querySelector('.scroll-down');
    if (scrollDownElement) {
      scrollDownElement.removeEventListener('click', this.scrollDown);
    }
    
    // Remove video event listeners
    const video = document.getElementById('background-video') as HTMLVideoElement;
    if (video) {
      video.removeEventListener('play', () => {});
      video.removeEventListener('pause', () => {});
    }
    
    // Remove document listeners
    document.removeEventListener('DOMContentLoaded', () => this.playVideo());
    window.removeEventListener('load', () => this.playVideo());
  }
  
  playVideo(): void {
    setTimeout(() => {
      const video = document.getElementById('background-video') as HTMLVideoElement;
      if (video) {
        video.muted = this.isMuted; // Use component state for mute
        
        // Try playing with promise handling
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
          playPromise.then(() => {
            this.isPlaying = true;
            console.log('Video started playing');
          }).catch(error => {
            console.warn("Video play was prevented by browser:", error);
            this.isPlaying = false;
            // We'll try again on user interaction, which is already set up
          });
        }
      }
    }, 300); // Small delay to ensure DOM is ready
  }

  // Scroll down button functionality
  scrollDown = (): void => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  }

  toggleMute(): void {
    // Get direct reference to the video element
    const video = document.getElementById('background-video') as HTMLVideoElement;
    
    if (video) {
      // Toggle the mute state
      this.isMuted = !this.isMuted;
      video.muted = this.isMuted;
      
      // If unmuting and video isn't playing, try to play it
      if (!this.isMuted && !this.isPlaying) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            this.isPlaying = true;
            console.log('Video started after unmute');
          }).catch(error => {
            console.warn('Could not play video after unmute:', error);
          });
        }
      }
      
      // Update the icon immediately after changing state
      this.updateMuteIcon();
      
      console.log("Mute toggled. Current state:", this.isMuted ? "Muted" : "Unmuted");
    } else {
      console.error("Video element not found");
    }
  }

  updateMuteIcon(): void {
    const icon = document.getElementById('mute-icon');
    if (icon) {
      // Remove all existing classes first to prevent build-up
      icon.className = '';
      // Add the appropriate icon class
      icon.className = this.isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
    }
  }
}