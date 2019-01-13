/**
 *
 * @module Kiwi
 * @submodule Components
 *
 */

module Kiwi.Components {

	/**
	 * Box 2
	 *
	 * @class Box
	 * @extends Kiwi.Component
	 * @namespace Kiwi.Components
	 * @constructor
	 * @param parent {Kiwi.Entity} The entity that this box belongs to.
	 * @param [x=0] {Number} Its position on the x axis
	 * @param [y=0] {Number} Its position on the y axis
	 * @param [width=0] {Number} The width of the box.
	 * @param [height=0] {Number} The height of the box.
	 * @return {Kiwi.Components.Box}
	 */
	export class Box2 extends Component {

		constructor(parent: Entity, offsetX: number = 0, offsetY: number = 0, width: number = 0, height: number = 0) {
			super(parent, 'Box2');

			this._offset = new Kiwi.Geom.Point(offsetX, offsetY);
			this._dimensions = new Kiwi.Geom.Point(width, height);

			this._dirty = true;
		}


		/**
		 * The type of object that this is.
		 *
		 * @return {string} "Box2"
		 * @public
		 */
		public objType() {
			return "Box2";
		}


		/**
		 * Indicates whether or not this component needs re-rendering/updating or not.
		 *
		 * @type boolean
		 * @public
		 */
		public _dirty: boolean;


		/**
		* Contains offset point for the hitbox
		 *
		* @type Kiwi.Geom.Point
		* @private
		*/
		private _offset: Kiwi.Geom.Point;


		/**
		* Returns the offset value of the hitbox as a point.
		* Pre transform
		*
		* @type Kiwi.Geom.Point
		* @readonly
		* @public
		*/
		public get offset(): Kiwi.Geom.Point {
			return this._offset;
		}


		/**
		 * Contains dimension point for the hitbox
		 *
		 * @type Kiwi.Geom.Point
		 * @private
		 */
		private _dimensions: Kiwi.Geom.Point;


		/**
		 * Returns the dimensions of the hitbox as a point for the.
		 * Pre transformation.
		 *
		 * @type Kiwi.Geom.Point
		 * @readonly
		 * @public
		 */
		public get dimensions(): Kiwi.Geom.Point {
			return this._dimensions;
		}


		/**
		 * The transformed or 'normal' hitbox for the entity. This is its box after rotation/scale.
		 *
		 * @type Kiwi.Geom.Rectangle
		 * @private
		 */
		private _transformedHitbox: Kiwi.Geom.Rectangle;
		private _invertedTransformMatrix: Kiwi.Geom.Matrix;


		public set hitbox(value: Kiwi.Geom.Rectangle) {
			throw 'Not yet implemented';
			// this._offset.x = value.x;
			// this._offset.y = value.y;
			//
			// this._rawHitbox = value;
			//
			// this._rawHitbox.x += this._rawBounds.x;
			// this._rawHitbox.y += this._rawBounds.y;
		}

		private clean() {
			this._invertedTransformMatrix = this.owner.transform.getConcatenatedMatrix().invertCopy();
			// this._invertedTransformMatrix.tx -= this.owner.transform.rotPointX;
			// this._invertedTransformMatrix.ty -= this.owner.transform.rotPointY;
			// this._invertedTransformMatrix.invert();
		}

		/**
		 * Check if a point is inside hitbox
		 *
		 * @param pt
		 */
		public check(pt: any) {
			// Transform external space into local space
			if(this._dirty) {
				this.clean();
			}

			var localPt = this._invertedTransformMatrix.transformPoint(pt);
			return localPt.x > this._offset.x && localPt.x < this._dimensions.x && localPt.y > this._offset.y && localPt.y < this._dimensions.y;
		}


		/**
		* Draws the various bounds on a context that is passed. Useful for debugging and using in combination with the debug canvas.
		* @method draw
		* @param ctx {CanvasRenderingContext2D} Context of the canvas that this box component is to be rendered on top of.
		* @param [camera] {Kiwi.Camera} A camera that should be taken into account before rendered. This is the default camera by default.
		* @public
		*/
		public draw(ctx: CanvasRenderingContext2D, camera: Kiwi.Camera = this.game.cameras.defaultCamera) {
			throw 'Not yet implemented';
			// var t: Kiwi.Geom.Transform = this.entity.transform;
			// var ct: Kiwi.Geom.Transform = camera.transform;
			//
			// // Draw raw bounds and raw center
			// ctx.strokeStyle = "red";
			// ctx.fillRect(this.rawCenter.x + ct.x - 1, this.rawCenter.y + ct.y - 1, 3, 3);
			// ctx.strokeRect(t.x + ct.x + t.rotPointX - 3, t.y + ct.y + t.rotPointY - 3, 7, 7);
			//
			// // Draw bounds
			// ctx.strokeStyle = "blue";
			// ctx.strokeRect(this.bounds.x + ct.x, this.bounds.y + ct.y, this.bounds.width, this.bounds.height);
			//
			// // Draw hitbox
			// ctx.strokeStyle = "green";
			// ctx.strokeRect(this.hitbox.x + ct.x, this.hitbox.y + ct.y, this.hitbox.width, this.hitbox.height);
			//
			// // Draw raw hitbox
			// ctx.strokeStyle = "white";
			// ctx.strokeRect(this.rawHitbox.x + ct.x, this.rawHitbox.y + ct.y, this.rawHitbox.width, this.rawHitbox.height);
			//
			// // Draw world bounds
			// ctx.strokeStyle = "purple";
			// ctx.strokeRect(this.worldBounds.x, this.worldBounds.y, this.worldBounds.width, this.worldBounds.height);
			//
			// // Draw world hitbox
			// ctx.strokeStyle = "cyan";
			// ctx.strokeRect(this.worldHitbox.x, this.worldHitbox.y, this.worldHitbox.width, this.worldHitbox.height);
		}


		/**
		* Destroys this component and all of the links it may have to other objects.
		* @method destroy
		* @public
		*/
		public destroy() {
			super.destroy();
		}
	}
}
