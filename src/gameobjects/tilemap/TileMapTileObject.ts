/**
 *
 * @module GameObjects
 * @submodule Tilemap
 *
 */

module Kiwi.GameObjects.Tilemap {
	/**
	 * TODO: write this
	 *
	 * @class TileObject
	 * @namespace Kiwi.GameObjects.Tilemap
	 * @constructor
	 * @param tileType {Number} The tile type.
	 * @return {TileObject}
	 */
	export class TileObject/* extends Kiwi.Entity*/ {
		protected _tileType = 0;

		constructor() {

		}

		public get tileType(): number {
			return this._tileType;
		}
	}
}