// This class is a service for managing Pokémon data. Here's what each method does:
// getPokemonList(): Retrieves a list of Pokémon.
// getPokemonById(pokemonId): Retrieves a Pokémon by its ID.
// getPokemonByName(pokemonName): Retrieves a Pokémon by its name.
// getPokemonTypesList(): Retrieves a list of Pokémon types.
// updatePokemon(pokemon): Updates a Pokémon's information.
// addPokemon(pokemon): Adds a new Pokémon.
// deletePokemon(pokemonId): Deletes a Pokémon.

import { Injectable } from '@angular/core';
import { Pokemon } from './pokemon';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, delay, map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  uri: string = 'http://localhost:3000/apipokemons';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  /**
   * Logs the given response using console.table.
   *
   * @param {Pokemon[] | Pokemon | string} response - The response to be logged
   * @return {void}
   */
  private log(response: Pokemon[] | Pokemon | string): void {
    console.table(response);
  }

  /**
   * A function that handles errors for a given operation.
   *
   * @param {string} operation - the name of the operation
   * @param {T} result - the result of the operation
   * @return {(error: Pokemon | undefined | []) => Observable<T>} a function that takes an error and returns an Observable of type T
   */
  private handleError<T>(
    operation: string = 'operation',
    result?: T
  ): (error: Pokemon | undefined | []) => Observable<T> {
    return (error) => {
      if (error) {
        console.error(error);
        this.log(`${operation} failed: ${error}`);
      }
      return of(result as T);
    };
  }

  /**
   * Retrieves a list of pokemons from the server.
   *
   * @return {Observable<Pokemon[]>} an observable of the list of pokemons
   */
  getPokemonList(): Observable<Pokemon[]> {
    return this.http.get<Pokemon[]>(this.uri).pipe(
      tap(() => this.log('fetched pokemons')),
      catchError(this.handleError('GET pokemons list failed', []))
    );
  }

  /**
   * Get a Pokemon by its ID.
   *
   * @param {number} pokemonId - The ID of the Pokemon to retrieve.
   * @return {Observable<Pokemon | undefined>} An observable of the Pokemon or undefined.
   */
  getPokemonById(pokemonId: number): Observable<Pokemon | undefined> {
    return this.http.get<Pokemon>(`${this.uri}/${pokemonId}`).pipe(
      tap(() => this.log(`fetched pokemon id=${pokemonId}`)),
      catchError(this.handleError('GET a pokemon by id failed', undefined))
    );
  }

  /**
   * Retrieves a Pokemon by name using the specified `pokemonName`.
   *
   * @param {string} pokemonName - The name of the Pokemon to retrieve.
   * @return {Observable<Pokemon[] | undefined>} An observable of Pokemon array or undefined.
   */
  getPokemonByName(pokemonName: string): Observable<Pokemon[] | undefined> {
    return this.http.get<Pokemon[]>(`${this.uri}?name=${pokemonName}`).pipe(
      delay(500), // simulate server latency for educational purposes and to show loading component
      tap(() => this.log(`fetched pokemon name=${pokemonName}`)),
      catchError(this.handleError('GET a pokemon by name failed', undefined))
    );
  }

  /**
   * Retrieves a list of Pokemon types from the server.
   *
   * @return {Observable<string[]>} Observable of string array containing Pokemon types
   */
  getPokemonTypesList(): Observable<string[]> {
    return this.http.get<Pokemon[]>(this.uri).pipe(
      tap(() => this.log('fetched pokemons list to get types')),
      catchError(this.handleError('GET pokemons list failed', [])),
      map((pokemonsList) => pokemonsList.flatMap((pokemon) => pokemon.types)),
      map((types) => [...new Set(types)] as string[])
    );
  }

  /**
   * Update a Pokemon.
   *
   * @param {Pokemon} pokemon - The Pokemon to update
   * @return {Observable<Pokemon | undefined>} The updated Pokemon, or undefined if the update failed
   */
  updatePokemon(pokemon: Pokemon): Observable<Pokemon | undefined> {
    return this.http
      .put<Pokemon>(`${this.uri}/${pokemon.id}`, pokemon, this.httpOptions)
      .pipe(
        tap(() => this.log(`updated hero id=${pokemon.id}`)),
        catchError(this.handleError('UPDATE a pokemon failed', undefined))
      );
  }

  /**
   * Adds a new Pokemon to the database.
   *
   * @param {Pokemon} pokemon - the Pokemon to be added
   * @return {Observable<Pokemon>} an observable of the added Pokemon
   */
  addPokemon(pokemon: Pokemon): Observable<Pokemon> {
    return this.http.post<Pokemon>(this.uri, pokemon, this.httpOptions).pipe(
      tap((newPokemon: Pokemon) =>
        this.log(`added hero w/ id=${newPokemon.id}`)
      ),
      catchError(this.handleError('ADD a pokemon failed', pokemon))
    );
  }

  /**
   * Delete a pokemon by its ID.
   *
   * @param {number} pokemonId - The ID of the pokemon to be deleted
   * @return {Observable<null>} An observable of null
   */
  deletePokemon(pokemonId: number): Observable<null> {
    return this.http
      .delete<null>(`${this.uri}/${pokemonId}`, this.httpOptions)
      .pipe(
        tap(() => this.log(`deleted pokemon id=${pokemonId}`)),
        catchError(this.handleError('DELETE a pokemon failed', null))
      );
  }

  /**
   * Search for pokemons by name.
   *
   * @param {string} term - The name of the pokemon to search for
   * @return {Observable<Pokemon[]>} An observable of pokemons matching the search term
   */
  searchPokemonByName(term: string): Observable<Pokemon[]> {
    if (!term.trim()) {
      return of([]);
    }

    const termTrimmed = term.trim();

    const searchList = this.http.get<Pokemon[]>(`${this.uri}`).pipe(
      tap(() => this.log(`found pokemons matching "${term}"`)),
      catchError(this.handleError('search pokemons failed', []))
    );

    return searchList.pipe(
      map((pokemons) => {
        return pokemons.filter((pokemon) =>
          pokemon.name.toLowerCase().includes(termTrimmed.toLowerCase())
        );
      })
    );
  }
}