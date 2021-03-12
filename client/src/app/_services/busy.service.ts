import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Spinner } from 'ngx-spinner/lib/ngx-spinner.enum';

@Injectable({
  providedIn: 'root',
})
export class BusyService {
  private busyRequestCount = 0;

  constructor(private spinner: NgxSpinnerService) {}

  busy() {
    this.busyRequestCount++;

    const spinnerOptions: Spinner = {
      type: 'line-scale-party',
      bdColor: 'rgba(255,255,255,0',
      color: '#E95420',
      size: 'medium',
    };

    this.spinner.show(undefined, spinnerOptions);
  }

  idle() {
    this.busyRequestCount--;
    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      this.spinner.hide();
    }
  }
}
