import { DOCUMENT } from '@angular/common';
import { Component, Inject, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tech-shop';

  constructor(@Inject(DOCUMENT) private document: Document, private renderer: Renderer2){}

  switchModeHandler(darkMode: boolean) {
    const hostClass = darkMode ? 'mat-typography dark-app-theme' : 'mat-typography';
    this.renderer.setAttribute(this.document.body, 'class', hostClass);
  }
}
