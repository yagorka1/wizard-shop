import { AfterViewInit, Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  protected readonly title = signal('wizard-shop');
  private platformId = inject(PLATFORM_ID);

  public ngAfterViewInit(): void {
    let video = null;

    if (isPlatformBrowser(this.platformId)) {
      video = document.querySelector('video');
    }

    if (video) {
      video.muted = true;
      video.volume = 0;
      video.play();
    }
  }
}
