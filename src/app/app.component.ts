import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'reek-ellum';
  isMuted: boolean = true; // Default to muted
  isPlaying: boolean = false;

  constructor(private cdr: ChangeDetectorRef) { }

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
        this.cdr.detectChanges();
      });
      
      video.addEventListener('pause', () => {
        this.isPlaying = false;
        console.log('Video paused');
        this.cdr.detectChanges();
      });
    }
    
    // Add direct click handler to mute button 
    const muteButton = document.getElementById('mute-btn');
    if (muteButton) {
      console.log('Mute button found, adding direct event listener');
      muteButton.addEventListener('click', (event) => {
        console.log('Mute button clicked via direct event listener');
        this.toggleMute();
        event.stopPropagation();
      });
    } else {
      console.error('Mute button not found!');
    }
    
    // Initialize mute button state
    setTimeout(() => {
      this.updateMuteIcon();
    }, 500);
  }

  ngOnDestroy(): void {
    // Remove video event listeners
    const video = document.getElementById('background-video') as HTMLVideoElement;
    if (video) {
      video.removeEventListener('play', () => {});
      video.removeEventListener('pause', () => {});
    }
    
    // Remove document listeners
    document.removeEventListener('DOMContentLoaded', () => this.playVideo());
    window.removeEventListener('load', () => this.playVideo());
    
    // Remove mute button direct listener
    const muteButton = document.getElementById('mute-btn');
    if (muteButton) {
      muteButton.removeEventListener('click', () => {});
    }
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
            this.cdr.detectChanges();
          }).catch(error => {
            console.warn("Video play was prevented by browser:", error);
            this.isPlaying = false;
            this.cdr.detectChanges();
            // We'll try again on user interaction, which is already set up
          });
        }
      }
    }, 300); // Small delay to ensure DOM is ready
  }

  toggleMute(): void {
    console.log('toggleMute called!');
    
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
            this.cdr.detectChanges();
          }).catch(error => {
            console.warn('Could not play video after unmute:', error);
            this.cdr.detectChanges();
          });
        }
      }
      
      // Update the icon immediately after changing state
      this.updateMuteIcon();
      
      console.log("Mute toggled. Current state:", this.isMuted ? "Muted" : "Unmuted");
      this.cdr.detectChanges();
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
    } else {
      console.error('Mute icon element not found');
    }
  }
}