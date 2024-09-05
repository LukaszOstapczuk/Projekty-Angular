import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { PlayerDataService } from '../service/player-data.service';

@Component({
  selector: 'app-player-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './player-form.component.html',
  styleUrl: './player-form.component.scss',
})
export class PlayerFormComponent implements OnInit {
  form: FormGroup;

  @Output() startGameEvent = new EventEmitter<{
    playerName: string;
    playerEmail: string;
    token: string;
  }>();

  constructor(
    private fb: FormBuilder,
    private playerDataService: PlayerDataService
  ) {
    this.form = this.fb.group({
      playerName: ['', [Validators.required, Validators.minLength(5)]],
      playerEmail: ['', [Validators.required, Validators.email]],
      token: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  ngOnInit() {
    const playerName = this.playerDataService.getPlayerName();
    const playerEmail = this.playerDataService.getPlayerEmail();
    this.form.patchValue({ playerName, playerEmail });
  }

  onSubmit() {
    if (this.form.valid) {
      const { playerName, playerEmail, token } = this.form.value;
      this.playerDataService.setPlayerData(playerName, playerEmail);
      this.startGameEvent.emit({ playerName, playerEmail, token });
    } else {
      alert('Please fill out the form correctly!');
    }
  }
}
