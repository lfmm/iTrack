import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { Keyboard } from '@ionic-native/keyboard';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { HomeModule } from './home/home.module';
import { AboutModule } from './about/about.module';
import { TrackerModule } from './tracker/tracker.module';
import { MoneyModule } from './money/money.module';
import { LoginModule } from './login/login.module';

// state
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';
import { OptimizedRouterStateSerializer } from './core/state/router/router.state';
import { RouterEffects } from './core/state/router/router.effects';
import { UndoredoEffects } from './core/state/undoredo/undoredo';
import { UndoredoService} from './core/state/undoredo/undoredo.service';
import { reducers, metaReducers } from './core/state';
import { StoreDevtools } from '@ngrx/store-devtools/src/devtools';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    TranslateModule.forRoot(),
    BrowserAnimationsModule,
    MaterialModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument({ maxAge: 25 }),
    StoreRouterConnectingModule.forRoot(),
    EffectsModule.forRoot([RouterEffects, UndoredoEffects]),
    CoreModule,
    SharedModule,
    HomeModule,
    AboutModule,
    TrackerModule,
    MoneyModule,
    LoginModule,
    AppRoutingModule
  ],
  declarations: [AppComponent],
  providers: [
    Keyboard,
    StatusBar,
    SplashScreen,
    { provide: RouterStateSerializer, useClass: OptimizedRouterStateSerializer },
    UndoredoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
