import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Import your page components
import { HomeComponent } from './pages/home/home.component';
import { LocationComponent } from './pages/location/location.component';
import { AboutComponent } from './pages/about/about.component';
import { ReviewsComponent } from './pages/reviews/reviews.component';
import { ServicesComponent } from './pages/services/services.component';

const routes: Routes = [
  { path: '', component: HomeComponent }, // Homepage (Default Route)
  { path: 'location', component: LocationComponent },
  { path: 'about', component: AboutComponent },
  { path: 'reviews', component: ReviewsComponent },
  { path: 'services', component: ServicesComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' } // Redirect unknown routes to home
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
