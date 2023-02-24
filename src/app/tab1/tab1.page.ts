import { Component } from '@angular/core';
import { interval } from 'rxjs';
import { TimerService } from '../service/timer';
import { Subscription } from 'rxjs';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
    public nombreZones: number = 0;
    public tempsBrossage: number = 0
    public tempsAttente: number = 0
    public name: string = '';
    private startTime: number = 0;
    private timerSubscription: Subscription;
    public zonesNettoyees: number = 0;
    public timerActive: boolean = false;
    public currentZone: number = 0;
    public isRunning = false;
    public restSeconds: number = 10;
    public minutes = 0;
    public seconds = 0;
    public isPaused = true;
    public isRestTime: boolean = false;

    constructor() {
    this.timerSubscription = new Subscription();
    }

  startTimer() {
    this.isPaused = false;
    if (this.currentZone == this.nombreZones) {
      this.resetTimer();
      return;
    }
    if (this.timerActive) {
      return;
    }
    this.timerActive = true;
    let interval = setInterval(() => {
      if (this.seconds === 0) {
        if (this.minutes === 0) {
          if (this.isRestTime) {
            this.isRestTime = false;
            this.seconds = this.tempsBrossage;
            this.minutes = 0;
            this.currentZone++;
            this.zonesNettoyees++;
          } else {
            this.isRestTime = true;
            this.restSeconds = this.tempsAttente; // initialisation de restSeconds avec tempsAttente
            this.seconds = 0;
            this.minutes = 0;
          }
        } else {
          this.minutes--;
          this.seconds = 59;
        }
      } else {
        this.seconds--;
      }
    }, 1000);
  }



  startRestTimer() {
    this.timerActive = true;
    let restInterval = setInterval(() => {
      if (this.restSeconds === 0) {
        clearInterval(restInterval);
        this.timerActive = false;
        this.startTimer();
      } else {
        this.restSeconds--;
      }
    }, 1000);
  }




    resetTimer() {
      this.isPaused = true;
      this.timerSubscription.unsubscribe();
      this.seconds = this.tempsBrossage;
      this.minutes = 0;
      this.zonesNettoyees = 0;
      this.currentZone = 0;
      this.timerActive = false;
    }

//     nextZone() {
//       if (this.currentZone <= this.nombreZones) {
//         this.currentZone++;
//         this.startTimer();
//       } else  if (this.currentZone == this.nombreZones){
//         this.timerActive = false;
//         this.isPaused = true;
//       }
//     }

  async ionViewWillEnter() {
      const nombreZones = await Preferences.get({ key: 'nombreZones' });
      const tempsBrossage = await Preferences.get({ key: 'tempsBrossage' });
      const tempsAttente = await Preferences.get({ key: 'tempsAttente' });
      const name = await Preferences.get({ key: 'name' });

      this.nombreZones = nombreZones.value ? Number(nombreZones.value) : 15;
      this.tempsBrossage = tempsBrossage.value ? Number(tempsBrossage.value) : 16;
      this.tempsAttente = tempsAttente.value ? Number(tempsAttente.value) : 6;
      this.name = name.value || 'mon petit marco';
  }
}
