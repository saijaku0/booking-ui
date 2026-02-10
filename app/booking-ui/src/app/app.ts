import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { ConfigService } from './app.config.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('booking-ui');
  private configService = inject(ConfigService);

  ngOnInit() {
    console.log('Компонент загрузился, отправляю запрос...');
  }
}
