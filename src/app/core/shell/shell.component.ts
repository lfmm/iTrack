import { Component, OnInit, OnDestroy, ViewChild, Renderer2 } from '@angular/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { MatSidenav } from '@angular/material';
import { filter } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import * as fromTheme from '../state/theme/theme.state';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit, OnDestroy {

  @ViewChild('sidenav') sidenav: MatSidenav;

  private _theme: Subscription;

  constructor(private media: ObservableMedia, private renderer: Renderer2,
    private store: Store<fromTheme.State>) { }

  ngOnInit() {
    // Automatically close side menu on screens > sm breakpoint
    this.media.asObservable()
      .pipe(filter((change: MediaChange) => (change.mqAlias !== 'xs' && change.mqAlias !== 'sm')))
      .subscribe(() => {
        this.sidenav.mode = 'over';
        this.sidenav.close();
      });
    // Selected theme
    this._theme = this.store.select(fromTheme.selectAll).subscribe((t: fromTheme.Theme[]) => {
      if (t && t.length > 0) {
        // remove all themes
        this.renderer.setAttribute(document.body, 'class', '');
        // add new theme if any
        const theme: string = t[0].class;
        if (theme) {
          this.renderer.setAttribute(document.body, 'class', theme);
        }
      }
    });
  }

  ngOnDestroy() {
    if (this._theme) { this._theme.unsubscribe(); }
  }

}
