/**
 *
 * @module Kiwi
 * @submodule Geom
 */

module Kiwi.Geom {

	/**
	 * Represents position, scale, rotation and pivotPoint of an Entity.
	 * - Values can be transformed with a 3x3 affine transformation Matrix, which each Transform is assigned.
	 * - A tranform can be assigned a parent, which may in turn have it's own parent, thereby creating a tranform inheritence heirarchy
	 * - A concatenated transformation Matrix, representing the combined matrices of the Transform and its ancestors.
	 *
	 * @class Transform
	 * @namespace Kiwi.Geom
	 * @constructor
	 * @param [x=0] {Number} X position of the Transform.
	 * @param [y=0] {Number} Y position of the Transform.
	 * @param [scaleX=1] {Number} X scaling of the Transform.
	 * @param [scaleY=1] {Number} Y scaling of the Transform.
	 * @param [rotation=0] {Number} Rotation of the Transform in radians.
	 * @param [rotX=0] {Number} pivotPoint offset on X axis.
	 * @param [rotY=0] {Number} pivotPoint offset on Y axis.
	 * @return {Transform} This object.
	 *
	 */
	export class Transform {
		/**
		 * Whether the transform has been altered since the last time
		 * it was used to create a Matrix. Used to determine whether to rebuild
		 * the Matrix or not.
		 *
		 * @property _dirty
		 * @type boolean
		 * @default true
		 * @private
		 * @since 1.3.1
		 */
		private _dirty: boolean = true;
		public set dirty(val: boolean) {
			// Muddy all the descendants
			if(val) {
				this._dirty = true;
				this._children.forEach(e => {
					if(e !== this)
						e.dirty = true;
				});
			}

			// Clean only your self
			else
				this._dirty = false;

		}
		public get dirty() { return this._dirty; }


		private _origin: Point = new Point(0, 0);
		public get origin() { return this._origin; }
		public set origin(val) { this._origin = val; this.dirty = true; }
		public setOrigin(x: number, y: number) {
			this._origin.x = x;
			this._origin.y = y;
			this.dirty = true;
		}


		private _pivotPoint: Point = new Point(0, 0);
		public get pivotPoint() { return this._pivotPoint; }
		public set pivotPoint(val) { this._pivotPoint = val; this.dirty = true;}


		private _scale: Point = new Point(1, 1);
		public get scale() { return this._scale; }
		public set scaleX(value: number) { this._scale.x = value; this.dirty = true; }
		public get scaleX():number { return this._scale.x; }
		public set scaleY(value: number) { this._scale.y = value; this.dirty = true; }
		public get scaleY(): number { return this._scale.y; }
		public set scale(val: any) {
			if(val.x)
				this._scale.xy = val;

			else {
				this._scale.x = val;
				this._scale.y = val;
			}

			this.dirty = true;
		}


		private _xy: Point = new Point(0, 0);
		public get xy(): Point { return this._xy; }
		public set xy(val: Point) { this._xy = val; this.dirty = true; }
		public set x(value: number) { this._xy.x = value; this.dirty = true; }
		public get x():number { return this._xy.x; }
		public set y(value: number) { this._xy.y = value; this.dirty = true; }
		public get y(): number { return this._xy.y; }
		public setXY(x: number, y: number) {
			this._xy.setTo(x, y);
			this.dirty = true;
		}

		/**
		 * Rotation of the transform in radians.
		 * @property _rotation
		 * @type Number
		 * @default 0
		 * @private
		 */
		private _rotation: number = 0;
		public set rotation(value: number) { this._rotation = Kiwi.Utils.GameMath.degreesToRadians(value); this.dirty = true; }
		public get rotation():number { return this._rotation; }
		public set rotationRad(value: number) { this._rotation = value; this.dirty = true; }


		/**
		 * A 3x3 transformation Matrix object that can be use this tranform to manipulate points or the context transformation.
		 * @property _Matrix
		 * @type Kiwi.Geom.Matrix
		 * @private
		 */
		private _matrix: Matrix;
		public get matrix(): Matrix { return this._matrix; }

		/**
		 * The most recently calculated Matrix from getConcatenatedMatrix.
		 *
		 * @property _cachedConcatenatedMatrix
		 * @type Kiwi.Geom.Matrix
		 * @private
		 */
		private _cachedConcatenatedMatrix: Matrix;

		private _children: Transform[] = [];

		/**
		 * The parent transform. If set to null there is no parent. Otherwise this is used by getConcatenatedMatrix to offset the current transforms by the another Matrix
		 * @property _parent
		 * @type Kiwi.Geom.Transform
		 * @default null
		 * @private
		 */
		private _parent: Transform = null;
		public get parent(): Transform { return this._parent; }
		public set parent(value: Transform) {
			if(value)
				value._children.push(this);

			if(!this.checkAncestor(value)) {
				this._parent = value;
				this.dirty = true;
			}
		}

		constructor() {
			this.setTransform(0, 0, 1, 1, 0, 0, 0);

			this._matrix = new Matrix();
			this._cachedConcatenatedMatrix = new Matrix();
		}

		private _performTransformation() {
			var cos = Math.cos(this.rotation);
			var sin = Math.sin(this.rotation);

			// Translation, then Scaling around origin, then rotation around pivotPoint
			// T(x,y) * T(origin) * T(scale) * T(-origin) * T(pivot) * T(rotation) * T(-pivot)
			this._matrix.setTo(
				cos * this._scale.x,
				-sin * this._scale.y,
				sin * this._scale.x,
				cos * this._scale.y,
				(((-this._pivotPoint.x * cos + -this._pivotPoint.y * sin + this._pivotPoint.x) * this._scale.x) + (-this._origin.x * this._scale.x + this._origin.x)) + this._xy.x,
				(((-this._pivotPoint.x * -sin + -this._pivotPoint.y * cos + this._pivotPoint.y) * this._scale.y) + (-this._origin.y * this._scale.y + this._origin.y)) + this._xy.y
			);
		}

		/**
		 * Translate the X and Y value of the transform by point components.
		 * @method translatePositionFromPoint
		 * @param point {Kiwi.Geom.Point} point.
		 * @return {Kiwi.Geom.Transform} This object.
		 * @public
		 */
		public translate(point: any): Transform {
			this._xy.x += point.x;
			this._xy.y += point.y;
			this.dirty = true;

			return this;
		}

		/**
		 * Set the core properties of the transform.
		 *
		 * @method setTransform
		 * @param [x=0] {Number} X position of the transform.
		 * @param [y=0] {Number} Y position of the transform.
		 * @param [scaleX=1] {Number} X scaling of the transform.
		 * @param [scaleY=1] {Number} Y scaling of the transform.
		 * @param [rotation=0] {Number} Rotation of the transform in radians.
		 * @param [originX=0] {Number} origin on X axis.
		 * @param [originY=0] {Number} origin on Y axis.
		 * @return {Kiwi.Geom.Transform} This object.
		 * @public
		 */
		public setTransform(x: number = 0, y: number = 0, scaleX: number = 1, scaleY: number = 1, rotation: number = 0, originX: number = 0, originY: number = 0): Transform {
			this._xy.x = x;
			this._xy.y = y;
			this._scale.x = scaleX;
			this._scale.y = scaleY;
			this._rotation = rotation;
			this._origin.x = originX;
			this._origin.y = originY;
			this.dirty = true;

			return this;
		}

		/**
		 * Return the transformation Matrix that concatenates this transform
		 * with all ancestor transforms. If there is no parent then this will
		 * return a Matrix the same as this transform's Matrix.
		 * @method getConcatenatedMatrix
		 * @return {Kiwi.Geom.Matrix} The concatenated Matrix.
		 * @public
		 */
		public getConcatenatedMatrix(): Matrix {
			if ( this.dirty ) {
				this._performTransformation();
				this._cachedConcatenatedMatrix.setToMatrix(this._matrix);

				// Apply parent transform
				if (this._parent)
					this._cachedConcatenatedMatrix = this._parent.getConcatenatedMatrix().multiplyMatrix(this._cachedConcatenatedMatrix);

				this.dirty = false;
			}

			return this._cachedConcatenatedMatrix;
		}

		/**
		 * Recursively check that a transform does not appear as its own ancestor
		 * @method checkAncestor
		 * @param transform {Kiwi.Geom.Transform} The Transform to check.
		 * @return {boolean} Returns true if the given transform is the same as this or an ancestor, otherwise false.
		 * @TODO: implement this
		 * @public
		 */
		public checkAncestor(transform: Transform): boolean {
			/*if (transform === this)
			{
				return true
			}

			if (transform.parent !== null)
			{
				return (this.checkAncestor(transform._parent))
			}*/

			return false;
		}

		/**
		 * Return a string represention of this object.
		 * @method toString
		 * @return {String} A string represention of this object.
		 * @public
		 */
		public get toString(): string {
			return "[{Transform (x=" + this._xy.x + " y=" + this._xy.y + " scale= { " + this._scale.x + ", " + this._scale.y + " } rotation=" + this._rotation + " origin= { " + this._origin.x + ", " + this.origin.y + " } Matrix=" + this._matrix + ")}]";
		}

		/**
		 * The type of this object.
		 * @method objType
		 * @return {String} "Transform"
		 * @public
		 */
		public objType() {
			return "Transform";
		}
	}
}
