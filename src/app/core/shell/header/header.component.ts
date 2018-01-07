import { Title } from '@angular/platform-browser';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material';

import { AuthenticationService } from '../../authentication/authentication.service';
import { I18nService } from '../../i18n.service';

import { Store } from '@ngrx/store';
import * as fromTheme from '../../state/theme/theme.state';
import * as fromRouterState from '../../state/router/router.state';
import * as fromRouterActions from '../../state/router/router.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() sidenav: MatSidenav;

  constructor(private router: Router,
              private titleService: Title,
              private authenticationService: AuthenticationService,
              private i18nService: I18nService,
              private themeStore: Store<fromTheme.State>,
              private routerStore: Store<fromRouterState.RouterStateUrl>) { }

  ngOnInit() { }

  back() {
    this.routerStore.dispatch(new fromRouterActions.Back());
  }

  forward() {
    this.routerStore.dispatch(new fromRouterActions.Forward());
  }

  setTheme(theme: string) {
    this.themeStore.dispatch(new fromTheme.Change('1', { id: '1', class: theme }));
  }

  setLanguage(language: string) {
    this.i18nService.language = language;
  }

  logout() {
    this.authenticationService.logout()
      .subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }

  get currentLanguage(): string {
    return this.i18nService.language;
  }

  get languages(): string[] {
    return this.i18nService.supportedLanguages;
  }

  get username(): string {
    const credentials = this.authenticationService.credentials;
    return credentials ? credentials.username : null;
  }

  get title(): string {
    return this.titleService.getTitle();
  }

}
