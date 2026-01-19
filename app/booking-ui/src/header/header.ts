import { Component, inject } from '@angular/core';
import { BasicComponentInjection } from '../app/component-injection.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private componentInjection = inject(BasicComponentInjection);
}
