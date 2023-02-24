import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private startTime: number = 0;
  private elapsedTime: number = 0;
  private timerInterval: any;
  public timerPaused: boolean = true;
  public timerReset: Subject<void> = new Subject<void>();

  constructor() {}

  startTimer() {
    if (this.timerPaused) {
      this.startTime = Date.now() - this.elapsedTime;
      this.timerPaused = false;
    }

    this.timerInterval = setInterval(() => {
      this.elapsedTime = Date.now() - this.startTime;
    }, 10);
  }

  pauseTimer() {
    clearInterval(this.timerInterval);
    this.timerPaused = true;
  }

  resetTimer() {
    clearInterval(this.timerInterval);
    this.elapsedTime = 0;
    this.timerPaused = true;
    this.timerReset.next();
  }

  getElapsedTime(): number {
    return this.elapsedTime;
  }
}
