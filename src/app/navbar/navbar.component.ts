import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isHomePage: boolean = false;

  constructor(
    public router: Router,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    // Check initial route
    this.checkHomePage(this.router.url);

    // Listen for route changes
    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.checkHomePage(event.url);
    });
  }

  private checkHomePage(url: string) {
    this.isHomePage = url === '/';
  }
  
  /**
   * Close the mobile menu when a nav item is clicked
   */
  closeMenu() {
    // Only execute on mobile view when the navbar is expanded
    if (window.innerWidth < 992) {
      // Get the navbar toggler button
      const navbarToggler = this.document.querySelector('.navbar-toggler') as HTMLElement;
      
      // Check if the navbar is expanded
      if (navbarToggler && navbarToggler.getAttribute('aria-expanded') === 'true') {
        // Trigger a click on the toggler to collapse it
        navbarToggler.click();
      }
    }
  }
}