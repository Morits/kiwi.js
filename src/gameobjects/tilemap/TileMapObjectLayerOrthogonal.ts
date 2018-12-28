/**
* 
* @module GameObjects
* @submodule Tilemap
* 
*/

module Kiwi.GameObjects.Tilemap {


	/**
    * Contains the code for managing and rendering Orthogonal types of TileMaps. 
    * This class should not be directly created, but instead should be created via methods on the TileMap class.
    * 
	* @class TileMapLayerOrthogonal
	* @extends Kiwi.GameObjects.Tilemap.TileMapLayer
	* @namespace Kiwi.GameObjects.Tilemap
    * @since 1.3.0
	* @constructor
	* @param tilemap {Kiwi.GameObjects.Tilemap.TileMap} The TileMap that this layer belongs to.
	* @param name {String} The name of this TileMapLayer.
	* @param atlas {Kiwi.Textures.TextureAtlas} The texture atlas that should be used when rendering this TileMapLayer onscreen.
	* @param data {Number[]} The information about the tiles.
	* @param tw {Number} The width of a single tile in pixels. Usually the same as the TileMap unless told otherwise.
	* @param th {Number} The height of a single tile in pixels. Usually the same as the TileMap unless told otherwise.
	* @param [x=0] {Number} The x coordinate of the tilemap in pixels.
	* @param [y=0] {Number} The y coordinate of the tilemap in pixels.
	* @param [w=0] {Number} The width of the whole tilemap in tiles. Usually the same as the TileMap unless told otherwise.
	* @param [h=0] {Number} The height of the whole tilemap in tiles. Usually the same as the TileMap unless told otherwise.
	* @return {TileMapLayer}
	*/
    export class TileMapObjectLayerOrthogonal extends TileMapLayerOrthogonal {

		/**
		* The type of object that it is.
		* @method objType
		* @return {String} "TileMapLayer"
		* @public
		*/
        public objType() {
            return "TileMapObjectLayer";
        }

		/**
		 * Returns the TileType for a tile that is at a particular set of coordinates passed.
		 * If no tile is found the null is returned instead.
		 * Coordinates passed are in tiles.
		 * @method getTileFromXY
		 * @param x {Number}
		 * @param y {Number}
		 * @return {Kiwi.GameObjects.Tilemap.TileType}
		 * @public
		 * @override
		 */
		public getTileFromXY(x: number, y: number): TileType {
			var t = this.getIndexFromXY(x, y);
			return (t !== -1) ? this.tilemap.tileTypes[ this._data[t].tileType ] : null;
		}

		/**
		 * Returns the total number of tiles. Either for a particular type if passed, otherwise of any type if not passed.
		 * @method countTiles
		 * @param [type] {Number} The type of tile you want to count.
		 * @return {Number} The number of tiles on this layer.
		 * @public
		 * @override
		 */
		public countTiles(type?:number):number {

			var cnt = 0;

			for (var i = 0; i < this._data.length; i++) {
				if (type == undefined && this._data[i].tileType !== 0) cnt++;
				else if (type === this._data[i].tileType) cnt++;
			}

			return cnt;
		}

		/**
		 * Returns the indexes of every tile of a type you pass.
		 * @method getIndexsByType
		 * @param type {Number}
		 * @return {Number[]}
		 * @public
		 * @override
		 */
		public getIndexesByType(type: number): number[] {
			var tiles = [];
			for (var i = 0; i < this._data.length; i++) {
				if (this._data[i].tileType == type) tiles.push(i);
			}
			return tiles;
		}

		/**
		 * Returns the TileType of a tile by an index passed.
		 * Thanks to @rydairegames
		 *
		 * @method getTileFromIndex
		 * @param index {Number}
		 * @return {Kiwi.GameObjects.Tilemap.TileType}
		 * @public
		 * @override
		 */
		public getTileFromIndex(index: number): TileType {
			return (index !== -1) ? this.tilemap.tileTypes[this._data[index].tileType] : null;
		}

		/**
		 * Returns the TileType for a tile that is at a particular coordinate passed.
		 * If no tile is found then null is returned instead.
		 * Coordinates passed are in pixels and use the world coordinates of the tilemap.
		 *
		 * @method getTileFromCoords
		 * @param x {Number}
		 * @param y {Number}
		 * @return {Kiwi.GameObjects.Tilemap.TileType}
		 * @public
		 * @override
		 */
		public getTileFromCoords(x: number, y: number): TileType {

			var t = this.getIndexFromCoords(x, y);
			return (t !== -1) ? this.tilemap.tileTypes[this._data[t].tileType] : null;

		}

		/**
		 * Randomizes the types of tiles used in an area of the layer. You can choose which types of tiles to use, and the area.
		 * Default tile types used are everyone avaiable.
		 * @method randomizeTiles
		 * @param [types] {Number[]} A list of TileTypes that can be used. Default is every tiletype on the TileMap.
		 * @param [x=0] {Number} The starting tile on the x axis to fill.
		 * @param [y=0] {Number} The starting tile on the y axis to fill.
		 * @param [width=this.width] {Number} How far across you want to go.
		 * @param [height=this.height] {Number} How far down you want to go.
		 * @public
		 * @override
		 */
		public randomizeTiles(types?: number[], x: number= 0, y: number= 0, width: number= this.width, height: number= this.height) {
			Kiwi.Log.log("Not implemented.", '#tilemap');
		}

		/**
		 * Replaces all tiles of typeA to typeB in the area specified. If no area is specified then it is on the whole layer.
		 * @method replaceTiles
		 * @param typeA {Number} The type of tile you want to be replaced.
		 * @param typeB {Number} The type of tile you want to be used instead.
		 * @param [x=0] {Number} The starting tile on the x axis to fill.
		 * @param [y=0] {Number} The starting tile on the y axis to fill.
		 * @param [width=this.width] {Number} How far across you want to go.
		 * @param [height=this.height] {Number} How far down you want to go.
		 * @public
		 * @override
		 */
		public replaceTiles(typeA: number, typeB: number, x:number=0, y:number=0, width:number=this.width,height:number=this.height) {
			Kiwi.Log.log("Not implemented.", '#tilemap');
		}

		/**
		 * Swaps all the tiles that are typeA -> typeB and typeB -> typeA inside the area specified. If no area is specified then it is on the whole layer.
		 * @method swapTiles
		 * @param typeA {number} The type of tile you want to be replaced with typeB.
		 * @param typeB {number} The type of tile you want to be replaced with typeA.
		 * @param [x=0] {number} The starting tile on the x axis to fill.
		 * @param [y=0] {number} The starting tile on the y axis to fill.
		 * @param [width=this.width] {number} How far across you want to go.
		 * @param [height=this.height] {number} How far down you want to go.
		 * @public
		 * @override
		 */
		public swapTiles(typeA: number, typeB: number, x: number= 0, y: number= 0, width: number= this.width, height: number= this.height) {
			Kiwi.Log.log("Not implemented.", '#tilemap');
		}
    }
}
