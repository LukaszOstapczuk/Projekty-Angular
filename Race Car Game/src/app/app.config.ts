import { ApplicationConfig, Component } from '@angular/core';
import { provideRouter } from '@angular/router';
import { IntroPageComponent } from './intro-page/intro-page.component';
import { GamePageComponent } from './game-page/game-page.component';
import { provideHttpClient } from '@angular/common/http';
import { AuthGuard } from './player-data.guard';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([
      { path: 'intro-page', component: IntroPageComponent },
      {
        path: 'game-page',
        component: GamePageComponent,
        canActivate: [AuthGuard],
      },
      { path: '**', redirectTo: 'intro-page' },
    ]),
    provideHttpClient(),
    AuthGuard,
  ],
};
