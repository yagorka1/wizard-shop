import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SelectModule } from 'primeng/select';

interface Language {
  code: string;
  name: string;
}

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [SelectModule, FormsModule],
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.scss'
})
export class LanguageSelectorComponent {
  private translateService = inject(TranslateService);

  languages: Language[] = [
    { code: 'en', name: 'English' },
    { code: 'ru', name: 'Русский' }
  ];

  selectedLanguage: string = 'en';

  constructor() {
    const savedLang = this.getSavedLanguage();
    if (savedLang) {
      this.selectedLanguage = savedLang;
      this.translateService.use(savedLang);
    }
  }

  onLanguageChange(langCode: string): void {
    this.translateService.use(langCode);
    this.saveLanguage(langCode);
  }

  private getSavedLanguage(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('language');
    }
    return null;
  }

  private saveLanguage(lang: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  }
}
