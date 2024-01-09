import { Component } from '@angular/core';
import { User } from '@ticket-trade-workspace/domain';

@Component({
  selector: 'ticket-trade-workspace-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'ticket-trade-app';

  user! : User;
}
