/**
 * @module Kiwi
 */
module Kiwi {
	/**
	 * A Camera is used to render a particular section of the game world on the stage. Each Camera has a coordinates which are held in the transform property, and a width/height. Note: This class should never be directly instantiated but instead should be made through a CameraManager's 'create' method.
	 *
	 * @class Camera
	 * @namespace Kiwi
	 * @constructor
	 * @param game {Kiwi.Game} The game that this camera belongs to.
	 * @param id {Number} A unique ID for this camera
	 * @param name {String} The name this camera goes by
	 * @param x {Number} The x coordinate of the camera
	 * @param y {Number} The y coordinate of the camera
	 * @param width {Number} The width of the camera
	 * @param height {Number} The cameras height
	 * @return {Kiwi.Camera}
	 *
	 */
	export class Camera extends Kiwi.Transformable {

		/**
		 * The width of this camara.
		 * @property width
		 * @type Number
		 * @public
		 */
		public width: number;

		/**
		 * The height of this camera.
		 * @property height
		 * @type Number
		 * @public
		 */
		public height: number;

		/**
		 * If true then the camera will be resized to fit the stage when the stage is resized
		 * @property fitToStage
		 * @type boolean
		 * @default true
		 * @public
		 */
		public fitToStage: boolean = true;

		/**
		 * The game this Group belongs to
		 * @property game
		 * @type Kiwi.Game
		 * @private
		 */
		private _game: Kiwi.Game;

		/**
		 * A unique identifier for this Layer within the game used internally by the framework. See the name property for a friendly version.
		 * @property id
		 * @type number
		 * @public
		 */
		public id: number;

		/**
		 * A name for this Camera. This is not checked for uniqueness within the Game, but is very useful for debugging.
		 * @property name
		 * @type string
		 * @public
		 */
		public name: string;

		/**
		 * Controls whether this Camera is rendered
		 * @property _visible
		 * @type boolean
		 * @private
		 */
		private _enabled: boolean;
		public get enabled(): boolean { return this._enabled; }
		public set enabled(val: boolean) { this._enabled = val; }

		constructor(game: Kiwi.Game, id: number, name: string,x:number,y:number,width:number,height:number) {
			super();

			this.transform.setXY(x, y);

			this._game = game;
			this.id = id;
			this.name = name;

			this.width = width;
			this.height = height;
			this._updatedStageSize(width, height);
			this._game.stage.onResize.add(this._updatedStageSize, this);
		}

		/**
		 * Updates the width/height of this camera. Is used when the stage resizes.
		 * @method _updatedStageSize
		 * @param width {Number} The new width of the camera.
		 * @param height {Number} The new height of the camera.
		 * @private
		 */
		private _updatedStageSize(width: number, height: number) {
			this.width = width;
			this.height = height;
			this.transform.setOrigin(-width / 2, -height / 2);
			this.transform.setPivotPoint(-width / 2, -height / 2);
		}

		/**
		 * Scratch matrix used in geometry calculations
		 *
		 * @property _scratchMatrix
		 * @type Kiwi.Geom.Matrix
		 * @private
		 * @since 1.3.1
		 */
		private _scratchMatrices = {inverted: new Kiwi.Geom.Matrix(), normal: new Kiwi.Geom.Matrix()};

		/**
		 * Convert from screen coordinates to world coordinates.
		 * Apply this camera's inverted matrix to an object with x and y
		 * properties representing a point and return the transformed point.
		 * Useful for calculating coordinates with the mouse.
		 * @method transformPoint
		 * @param pt {Kiwi.Geom.Point}
		 * @param copy boolean Return a copy or in place
		 * @return {Kiwi.Geom.Point} Transformed clone of the original Point.
		 * @public
		 */
		public transformStageToWorld( pt: Kiwi.Geom.Point, copy: boolean = true ): Kiwi.Geom.Point {
			if(this.dirty)
				this.clean();

			if(copy)
				return this._scratchMatrices.inverted.transformPoint(pt);

			this._scratchMatrices.inverted.transformPointInPlace(pt);
			return pt;
		}

		/**
		 * Convert from world coordinates to screen coordinates.
		 * Useful for assessing visibility.
		 * Similar to "transformPoint", but in reverse.
		 * @method transformPointToScreen
		 * @param pt {Kiwi.Geom.Point}
		 * @param copy boolean
		 * @return {Kiwi.Geom.Point} Transformed clone of the original Point.
		 * @public
		 * @since 1.2.0
		 */
		public transformWorldToStage( pt: Kiwi.Geom.Point, copy: boolean = true ): Kiwi.Geom.Point {
			if(this.dirty)
				this.clean();

			if(copy)
				return this._scratchMatrices.normal.transformPoint(pt);

			this._scratchMatrices.normal.transformPointInPlace(pt);
			return pt;
		}

		private clean() {
			this._scratchMatrices.normal.setToMatrix(this.transform.getConcatenatedMatrix());
			this._scratchMatrices.inverted.setToMatrix(this._scratchMatrices.normal).invert();
			this.dirty = false;
		}

		/**
		 * The update loop that is executed every frame.
		 * @method update
		 * @public
		 */
		public update() {
			// Do nothing
		}

		public zero() {
			this.transform.x = 0;
			this.transform.y = 0;
			this.transform.rotation = 0;
			this.transform.setScale(1, 1);
			this._updatedStageSize(this.width, this.height);
		}

		public destroy(...params) {
			super.destroy(params);
			delete this._scratchMatrices.normal;
			delete this._scratchMatrices.inverted;
			delete this._scratchMatrices;
		}

		/**
		 * The render loop that is executed whilst the game is playing.
		 * @method render
		 * @public
		 */
		public render() {
			this._game.renderer.render(this);
		}

		/**
		 * The type of object this is.
		 * @method objType
		 * @return {String} "Camera"
		 * @public
		 */
		public objType() {
			return "Camera";
		}
	}
}
