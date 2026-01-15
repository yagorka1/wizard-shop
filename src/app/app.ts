import { AfterViewInit, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit {
  protected readonly title = signal('wizard-shop');

  public ngAfterViewInit(): void {
    const video = document.querySelector('video');

    if (video) {
      video.muted = true;
      video.volume = 0;
      video.play();
    }
  }
}
