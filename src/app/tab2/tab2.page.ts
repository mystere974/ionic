import { Component, EventEmitter, Output } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
   public nombreZones: number = 15;
   public tempsBrossage: number = 16;
   public tempsAttente: number = 6;
   public name: string = 'mon petit marco';

  errorMessage: string = '';

  @Output() preferencesSaved = new EventEmitter();

  constructor() {}

  async ionViewWillEnter() {
      this.loadPreferences();
    }

  async loadPreferences() {
      const nombreZones = await Preferences.get({ key: 'nombreZones' });
      const tempsBrossage = await Preferences.get({ key: 'tempsBrossage' });
      const tempsAttente = await Preferences.get({ key: 'tempsAttente' });
      const name = await Preferences.get({ key: 'name' });

      this.nombreZones = nombreZones.value ? Number(nombreZones.value) : this.nombreZones;
      this.tempsBrossage = tempsBrossage.value ? Number(tempsBrossage.value) : this.tempsBrossage;
      this.tempsAttente = tempsAttente.value ? Number(tempsAttente.value) : this.tempsAttente;
      this.name = name.value || this.name;
    }


   async savePreferences() {
      if (this.nombreZones < 0) {
        this.nombreZones = 0;
        alert('Nombre de zones > 0 obligatoire');
        return;
      }
      if (this.tempsBrossage < 0) {
        this.tempsBrossage = 0;
        alert('Temps de brossage > 0 obligatoire');
        return;
      }
      if (this.tempsAttente < 0) {
        this.tempsAttente = 0;
        alert('Temps d\'attente > 0 obligatoire');
        return;
      }
      if (this.name.length > 20) {
        alert('Texte trop long');
        return;
      }

      await Preferences.set({ key: 'nombreZones', value: this.nombreZones.toString() });
      await Preferences.set({ key: 'tempsBrossage', value: this.tempsBrossage.toString() });
      await Preferences.set({ key: 'tempsAttente', value: this.tempsAttente.toString() });
      await Preferences.set({ key: 'name', value: this.name });

      console.log('Preferences saved');
      this.preferencesSaved.emit();
    }
  }



