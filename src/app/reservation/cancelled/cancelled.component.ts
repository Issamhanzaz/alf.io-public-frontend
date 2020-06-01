import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cancelled',
  templateUrl: './cancelled.component.html',
  styleUrls: ['./cancelled.component.scss']
})
export class CancelledComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  backClicked() {
    this.router.navigate([`/`]);
  }
}
