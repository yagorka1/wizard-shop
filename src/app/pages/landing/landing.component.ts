import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageSelectorComponent } from '../../components/language-selector/language-selector.component';

@Component({
  selector: 'app-landing',
  imports: [RouterModule, TranslatePipe, LanguageSelectorComponent],
  templateUrl: './landing.component.html',
})
export class LandingComponent {

}
