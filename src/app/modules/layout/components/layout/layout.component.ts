import { Component } from '@angular/core';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  user$ = this.authService.user$;

  constructor(
    private authService: AuthService
  ) { }
}
