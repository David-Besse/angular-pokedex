import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf, NgFor, NgStyle, DatePipe } from '@angular/common';
import { Pokemon } from '../pokemon';
import { PokemonService } from '../pokemon.service';
import { PokemonTypeColorPipe } from '../pokemon-type-color.pipe';
import { BorderCardDirective } from '../border-card.directive';
import { SearchPokemonComponent } from '../search-pokemon/search-pokemon.component';
import { LoaderComponent } from '../loader/loader.component';
import { InformationBoxService } from '../../information-box/service/information-box.service';
import { InformationBoxComponent } from '../../information-box/information-box.component';
import { BrowserSessionStorageService } from '../../browser-storage.service';

@Component({
  selector: 'app-list-pokemon',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgStyle,
    DatePipe,
    PokemonTypeColorPipe,
    BorderCardDirective,
    RouterLink,
    SearchPokemonComponent,
    LoaderComponent,
    InformationBoxComponent,
  ],
  templateUrl: './list-pokemon.component.html',
  styleUrl: './list-pokemon.component.scss',
})
export default class ListPokemonComponent implements OnInit, AfterViewInit {
  pokemonList: Pokemon[] | [];
  lsInformationBox: string | null;
  @ViewChild(InformationBoxComponent)
  informationBoxComponent!: InformationBoxComponent;

  constructor(
    private pokemonService: PokemonService,
    private informationBoxService: InformationBoxService,
    private sessionStorageService: BrowserSessionStorageService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.pokemonService
      .getPokemonList()
      .subscribe((pokemonList: Pokemon[] | []) => {
        this.pokemonList = pokemonList;
      });
    this.lsInformationBox = this.sessionStorageService.get('informationBox');
  }

  ngAfterViewInit() {
    if (!this.lsInformationBox) {
      this.informationBoxService.setText(
        'Welcome ! The server response time has been forced to 0.5s to display the loader in some cases (edit/detail).'
      );
      this.informationBoxComponent.open();
      this.sessionStorageService.set('informationBox', 'true');
    }
    this.cd.detectChanges(); // To avoid ExpressionChangedAfterItHasBeenCheckedError
  }
}
