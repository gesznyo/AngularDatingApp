import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

export interface AppUser {
  id: number;
  userName: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'The Dating app';
  users: AppUser[];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getUser();
  }

  private getUser() {
    this.http.get<AppUser[]>('https://localhost:5001/api/users').subscribe(
      (response) => {
        this.users = response;
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
