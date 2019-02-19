﻿/**
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
    export class TileMapLayerDynamicOrthogonal extends TileMapLayer {
		private offset: Kiwi.Geom.Point = new Kiwi.Geom.Point();
        constructor(tilemap: Kiwi.GameObjects.Tilemap.TileMap, name: string, atlas: Kiwi.Textures.TextureAtlas, data: number[], tw: number, th: number, x: number = 0, y: number = 0, w: number = 0, h: number = 0) {
            super(tilemap, name, atlas, data, tw, th, 0, 0, w, h);
            this.offset.setTo(x, y);
			// TODO: convert data into hashmap. Include x: y coords into
			this._data.forEach((e, i) => {
				var yM = Math.floor(i / w);
				var xM = i - yM * w;
				yM += y;
				xM += x;
				this._data2[`${xM}|${yM}`] = e;
			});
			this._data = [];
        }

        private _data2 = {};

		public getTileFromXY(x, y) {
        	return this.tilemap.tileTypes[ this._data2[`${x}|${y}`] ];
		}

		/**
		* The type of object that it is.
		* @method objType
		* @return {String} "TileMapLayer"
		* @public
		*/
        public objType() {
            return "TileMapLayer";
        }

		/**
		* The orientation of the of tilemap. 
		* TileMaps can be either 'orthogonal' (normal) or 'isometric'.
		* @property orientation
		* @type String
		* @default 'orthogonal'
		* @public
		*/
        public orientation: string = ORTHOGONAL;

		/**
		* Returns the index of the tile based on the x and y pixel coordinates that are passed. 
		* If no tile is a the coordinates given then -1 is returned instead.
		* Coordinates are in pixels not tiles and use the world coordinates of the tilemap.
		*
		* @method getIndexFromCoords
		* @param x {Number} The x coordinate of the Tile you would like to retrieve. 
		* @param y {Number} The y coordinate of the Tile you would like to retrieve.
		* @return {Number} Either the index of the tile retrieved or -1 if none was found.
		* @public
		*/
        // public getIndexFromCoords(x: number, y: number): number {
		//
        // 	// TODO: reimplemnt this method
        // 	// TODO: culling of tiles outside camera
        //     //Not with the bounds?
        //     // if (x > this.transform.worldX + this.widthInPixels || y > this.transform.worldY + this.heightInPixels || x < this.transform.worldX || y < this.transform.worldY)
        //     //     return -1;
		//
        //     //Is so get the tile
        //     var tx = Kiwi.Utils.GameMath.snapToFloor(x - this.transform.worldX, this.tileWidth) / this.tileWidth;
        //     var ty = Kiwi.Utils.GameMath.snapToFloor(y - this.transform.worldY, this.tileHeight) / this.tileHeight;
		//
        //     return this.getIndexFromXY(tx, ty);
        // }


		/**
		* Returns the tiles which overlap with a provided entities hitbox component. 
		* Only collidable tiles on ANY side will be returned unless you pass a particular side.
		* 
		* @method getOverlappingTiles
		* @param entity {Kiwi.Entity} The entity you would like to check for the overlap.
		* @param [collisionType=ANY] {Number} The particular type of collidable tiles which you would like to check for.
		* @return {Object[]} Returns an Array of Objects containing information about the tiles which were found. Index/X/Y information is contained within each Object. 
		* @public
		*/
        // public getOverlappingTiles(entity: Kiwi.Entity, collisionType: number = Kiwi.Components.ArcadePhysics.ANY): any {
		//
        //     //Do they have a box?
        //     if (entity.components.hasComponent("Box") == false)
        //         return [];
		//
        //     //Get the box off them
        //     var b: Kiwi.Geom.Rectangle = entity.components.getComponent('Box').worldHitbox;
		//
        //     var worldX = this.transform.worldX;
        //     var worldY = this.transform.worldY;
		//
        //     //Is the person within the map's bounds?
        //     if (b.left > worldX + this.widthInPixels || b.right < worldX || b.bottom < worldY || b.top > worldY + this.heightInPixels)
        //         return [];
		//
		//
        //     var nx = b.x - worldX;
        //     var ny = b.y - worldY;
		//
        //     //Get starting location and now many tiles from there we will check.
        //     var x = Kiwi.Utils.GameMath.snapToFloor(nx, this.tileWidth) / this.tileWidth;
        //     var y = Kiwi.Utils.GameMath.snapToFloor(ny, this.tileHeight) / this.tileHeight;
        //     var w = Kiwi.Utils.GameMath.snapToCeil(b.width, this.tileWidth) / this.tileWidth;
        //     var h = Kiwi.Utils.GameMath.snapToCeil(b.height, this.tileHeight) / this.tileHeight;
		//
        //     //Add one, because we want to include the very end tile.
        //     var tiles = this.getCollidableTiles(x, y, w + 1, h + 1, collisionType);
		//
        //     //Loop through the tiles and make sure they are actually overlapping with the Entity.
        //     for (var i = 0; i < tiles.length; i++) {
        //         var t = tiles[i];
		//
        //         if (t.x + worldX > b.right || t.x + this.tileWidth + worldX < b.left || t.y + worldY > b.bottom || t.y + this.tileHeight + worldY < b.top) {
        //             tiles.splice(i, 1);
        //             i--;
        //         }
        //     }
		//
        //     return tiles;
		//
        // }

		/**
		* Used to calculate the position of the tilemap on the stage as well as how many tiles can fit on the screen. 
		* All coordinates calculated are stored as temporary properties (maxX/Y, startX/Y).
		*
		* @method _calculateBoundaries
		* @param camera {Camera}
		* @param matrix {matrix}
		* @protected
		*/
        protected _calculateBoundaries(camera: Kiwi.Camera, matrix: Kiwi.Geom.Matrix) {
            //If we are calculating the coordinates for 'regular' then we can do that rather easy

            // Account for camera and object transformation
            // Initialise corners...
            this._corner1.setTo(0, 0);
            this._corner2.setTo(this.game.stage.width, 0);
            this._corner3.setTo(this.game.stage.width, this.game.stage.height);
            this._corner4.setTo(0, this.game.stage.height);

            // TODO: Transform corners by camera...
            camera.transformStageToWorld(this._corner1, false);
            camera.transformStageToWorld(this._corner2, false);
            camera.transformStageToWorld(this._corner3, false);
            camera.transformStageToWorld(this._corner4, false);

            // Transform corners by object...
            var m = matrix.clone();
            m.invert();
            m.transformPointInPlace(this._corner1);
            m.transformPointInPlace(this._corner2);
            m.transformPointInPlace(this._corner3);
            m.transformPointInPlace(this._corner4);

            // Find min/max values in X and Y...
            this._startX = Math.min(this._corner1.x, this._corner2.x, this._corner3.x, this._corner4.x);
            this._startY = Math.min(this._corner1.y, this._corner2.y, this._corner3.y, this._corner4.y);
            this._maxX = Math.max(this._corner1.x, this._corner2.x, this._corner3.x, this._corner4.x);
            this._maxY = Math.max(this._corner1.y, this._corner2.y, this._corner3.y, this._corner4.y);

            // Convert to tile units...
            this._startX /= this.tileWidth;
            this._startY /= this.tileHeight;
            this._maxX /= this.tileWidth;
            this._maxY /= this.tileHeight;

            // Truncate units...
            this._startX = Math.floor(this._startX);
            this._startY = Math.floor(this._startY);
            this._maxX = Math.ceil(this._maxX);
            this._maxY = Math.ceil(this._maxY);

            // Clamp values to tilemap range...
            this._startX = Kiwi.Utils.GameMath.clamp(this._startX, this.width + this.offset.x, this.offset.x );
            this._startY = Kiwi.Utils.GameMath.clamp(this._startY, this.height + this.offset.y, this.offset.y);
            this._maxX = Kiwi.Utils.GameMath.clamp(this._maxX, this.width + this.offset.x, this.offset.x);
            this._maxY = Kiwi.Utils.GameMath.clamp(this._maxY, this.height + this.offset.y, this.offset.y);
        }


		/** 
		* The render loop which is used when using the Canvas renderer.
		* @method render
		* @param camera {Camera}
		* @public
		*/
        public render(camera: Kiwi.Camera) {
        	throw "Not yet implemented";
        }

        public renderGL(gl: WebGLRenderingContext, camera: Kiwi.Camera, params: any = null) {
            //Setup
            var vertexItems = [];
			
            //Transform/Matrix
            var t: Kiwi.Geom.Transform = this.transform;
            var m: Kiwi.Geom.Matrix = t.getConcatenatedMatrix(); 


            //Find which ones we need to render.
            this._calculateBoundaries(camera, m);

            //Loop through the tiles.
            for (var y = this._startY; y < this._maxY; y++) {
                for (var x = this._startX; x < this._maxX; x++) {
					
                    //Get the tile type
                    this._temptype = this.getTileFromXY(x, y);

                    //Skip tiletypes that don't use a cellIndex.
                    if (this._temptype.cellIndex == -1) continue;

                    //Get the cell index
                    var cell = this.atlas.cells[this._temptype.cellIndex];

                    // TODO: should tile offset be used?
                    var tx = x * this.tileWidth + this._temptype.offset.x;
                    var ty = y * this.tileHeight + this._temptype.offset.y;


                    //Set up the points
                    this._corner1.setTo(tx, ty); // TODO: if you figure out if this is needed give a comment: ty - (cell.h - this.tileHeight)
                    this._corner2.setTo(tx + cell.w, ty); // ty - (cell.h - this.tileHeight)
                    this._corner3.setTo(tx + cell.w, ty + cell.h); // cell.h - (cell.h - this.tileHeight)
                    this._corner4.setTo(tx, ty + cell.h); // cell.h - (cell.h - this.tileHeight)


                    //Add on the matrix to the points
                    m.transformPointInPlace( this._corner1 );
                    m.transformPointInPlace( this._corner2 );
                    m.transformPointInPlace( this._corner3 );
                    m.transformPointInPlace( this._corner4 );

                    //Append to the xyuv array
                    vertexItems.push(
                        this._corner1.x, this._corner1.y, cell.x, cell.y, this.alpha,                   //Top Left Point
                        this._corner2.x, this._corner2.y, cell.x + cell.w -1, cell.y, this.alpha,          //Top Right Point
                        this._corner3.x, this._corner3.y, cell.x + cell.w -1, cell.y + cell.h -1, this.alpha, //Bottom Right Point
                        this._corner4.x, this._corner4.y, cell.x, cell.y + cell.h - 1, this.alpha           //Bottom Left Point
                        );
                }
            }

            //Concat points to the Renderer.
            (<Kiwi.Renderers.TextureAtlasRenderer>this.glRenderer).concatBatch(vertexItems);
        }

    }
}
