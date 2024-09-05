import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-game-controller',
  standalone: true,
  imports: [],
  templateUrl: './game-controller.component.html',
  styleUrl: './game-controller.component.scss',
})
export class GameControllerComponent {
  @Input() isControlDisabled: boolean = true;

  @Output() turboOn = new EventEmitter<void>();
  @Output() turboOff = new EventEmitter<void>();
  @Output() actionLeft = new EventEmitter<void>();
  @Output() actionRight = new EventEmitter<void>();

  constructor() {}

  onTurboOn() {
    this.turboOn.emit();
  }

  onTurboOff() {
    this.turboOff.emit();
  }

  onActionLeft() {
    this.actionLeft.emit();
  }

  onActionRight() {
    this.actionRight.emit();
  }
}
