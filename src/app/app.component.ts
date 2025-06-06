// src/app/app.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription, filter, map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public showMenu = true;
  private routerSub!: Subscription;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.routerSub = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          // Navegamos por la jerarquía de ActivatedRoute hasta la ruta más interna
          let route = this.activatedRoute.firstChild;
          while (route?.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        map(route => {
          // Leemos 'hideMenu' de data; si no existe, asumimos false (es decir, mostrar menú)
          return route?.snapshot.data['hideMenu'] ?? false;
        })
      )
      .subscribe(hideMenu => {
        this.showMenu = !hideMenu;
      });
  }

  ngOnDestroy(): void {
    this.routerSub.unsubscribe();
  }
}
