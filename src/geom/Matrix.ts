/**
 *
 * @module Kiwi
 * @submodule Geom
 */

module Kiwi.Geom {

	/**
	 * Represents a 2d transformation Matrix. This can be used to map points
	 * between different coordinate spaces. Matrices are used by Transform
	 * objects to represent translation, scale and rotation transformations,
	 * and to determine where objects are in world space or camera space.
	 * Objects such as entities and groups may be nested, and their associated
	 * transforms may represent how they are scaled, translated and rotated
	 * relative to a parent transform. By concatenating an object's
	 * transformation Matrix with its ancestors matrices, it is possible to
	 * determine the absolute position of the object in world space.
	 * See
	 * http://en.wikipedia.org/wiki/Transformation_Matrix#Examples_in_2D_graphics
	 * for an in depth discussion of 2d tranformation matrices.
	 *
	 * <pre>
	 *  a c tx
	 *  b d ty
	 *  0 0 1
	 * </pre>
	 *
	 * @class Matrix
	 * @namespace Kiwi.Geom
	 * @constructor
	 * @param [a=1] {Number}  position 0,0 of the Matrix,
	 *	affects scaling and rotation.
	 * @param [b=0] {Number}  position 0,1 of the Matrix,
	 *	affects scaling and rotation.
	 * @param [c=0] {Number}  position 1,0 of the Matrix,
	 *	affects scaling and rotation.
	 * @param [d=1] {Number}  position 1,1 of the Matrix,
	 *	affects scaling and rotation.
	 * @param [tx=0] {Number}  position 2,0 of the Matrix,
	 *	affects translation on x axis.
	 * @param [ty=0] {Number}  position 2,1 of the Matrix,
	 *	affects translation on y axis.
	 * @return (Object) This object.
	 *
	 */
	export class Matrix {
		constructor(a: number = 1, b: number = 0, c: number = 0, d: number = 1, tx: number = 0, ty: number = 0) {
			this.setTo(a, b, c, d, tx, ty);
		}

		/**
		 * The type of object this is.
		 * @method objType
		 * @return {String} "Matrix"
		 * @public
		 */
		public objType() {
			return "Matrix";
		}

		/**
		 * Position 0,0 of the Matrix, affects scaling and rotation
		 * @property a
		 * @type Number
		 * @default 1
		 * @public
		 */
		public a: number = 1;

		/**
		 * Position 0,1 of the Matrix, affects scaling and rotation.
		 * @property b
		 * @type Number
		 * @default 0
		 * @public
		 */
		public b: number = 0;

		/**
		 * Position 1,0 of the Matrix, affects scaling and rotation.
		 * @property c
		 * @type Number
		 * @default 0
		 * @public
		 */
		public c: number = 0;

		/**
		 * Position 1,1 of the Matrix, affects scaling and rotation.
		 * @property d
		 * @type Number
		 * @default 1
		 * @public
		 */
		public d: number = 1;

		/**
		 * Position 2,0 of the Matrix, affects translation on x axis.
		 * @property tx
		 * @type Number
		 * @default 0
		 * @public
		 */
		public tx: number = 0;

		/**
		 * Position 2,1 of the Matrix, affects translation on y axis.
		 * @property ty
		 * @type Number
		 * @default 0
		 * @public
		 */
		public ty: number = 0;

		public set xy(pt: Point) {
			this.tx = pt.x;
			this.ty = pt.y;
		}
		public get xy(): Point {
			return new Point(this.tx, this.ty);
		}

		/**
		 * Set all Matrix values
		 * @method setTo
		 * @param [a=1] {Number} position 0,0 of the Matrix, affects scaling and rotation.
		 * @param [b=0] {Number} position 0,1 of the Matrix, affects scaling and rotation.
		 * @param [c=0] {Number} position 1,0 of the Matrix, affects scaling and rotation.
		 * @param [d=1] {Number} position 1,1 of the Matrix, affects scaling and rotation.
		 * @param [tx=0] {Number} position 2,0 of the Matrix, affects translation on x axis.
		 * @param [ty=0] {Number} position 2,1 of the Matrix, affects translation on y axis.
		 * @return {Kiwi.Geom.Matrix} This object.
		 * @public
		 */
		public setTo(a: number = 1, b: number = 0, c: number = 0, d: number = 1, tx: number = 0, ty: number = 0): Matrix {
			this.a = a;
			this.b = b;
			this.c = c;
			this.d = d;
			this.tx = tx;
			this.ty = ty;

			return this;
		}

		/**
		 * Set all Matrix values
		 * @method setTo
		 * @param [a=1] {Number} position 0,0 of the Matrix, affects scaling and rotation.
		 * @param [b=0] {Number} position 0,1 of the Matrix, affects scaling and rotation.
		 * @param [c=0] {Number} position 1,0 of the Matrix, affects scaling and rotation.
		 * @param [d=1] {Number} position 1,1 of the Matrix, affects scaling and rotation.
		 * @param [tx=0] {Number} position 2,0 of the Matrix, affects translation on x axis.
		 * @param [ty=0] {Number} position 2,1 of the Matrix, affects translation on y axis.
		 * @return {Kiwi.Geom.Matrix} This object.
		 * @public
		 */
		public setToMatrix(m: Matrix): Matrix {
			this.a = m.a;
			this.b = m.b;
			this.c = m.c;
			this.d = m.d;
			this.tx = m.tx;
			this.ty = m.ty;

			return this;
		}

		/**
		 * Alias for append for people used to Matrix calculations
		 * @param m {Kiwi.Geom.Matrix} The Matrix to append.
		 * @return {Kiwi.Geom.Matrix} This object.
		 * @public
		 */
		public multiplyMatrix(b: Matrix): Matrix {
			var ret = new Matrix();

			ret.a = this.a * b.a + this.c * b.b;
			ret.b = this.b * b.a + this.d * b.b;
			ret.c = this.a * b.c + this.c * b.d;
			ret.d = this.b * b.c + this.d * b.d;
			ret.tx = this.a * b.tx + this.c * b.ty + this.tx;
			ret.ty = this.b * b.tx + this.d * b.ty + this.ty;
			return ret;
		}

		public preMultiplyMatrix(b: Matrix) {
			this.setToMatrix(b.clone().multiplyMatrix(this));
		}

		public postMultiply(b: Matrix) {
			this.multiplyMatrix(b);
		}

		/**
		 * Set the Matrix to the identity Matrix - when appending or prepending this Matrix to another there will be no change in the resulting Matrix
		 * @method identity
		 * @return {Kiwi.Geom.Matrix} This object.
		 * @public
		 */
		public static identity(): Matrix {
			return new Matrix();
		}

		/**
		 * Set the Matrix to the identity Matrix - when appending or prepending this Matrix to another there will be no change in the resulting Matrix
		 * @method identity
		 * @return {Kiwi.Geom.Matrix} This object.
		 * @public
		 */
		public setIdentity(): Matrix {
			this.a = 1;
			this.b = 0;
			this.c = 0;
			this.d = 1;
			this.tx = 0;
			this.ty = 0;
			return this;
		}

		/**
		 * Apply this Matrix to a an object with x and y properties representing a point and return the transformed point.
		 * @method transformPoint
		 * @param pt {Object} The point to be translated.
		 * @return {Kiwi.Geom.Matrix} This object.
		 * @public
		 */
		public transformPoint(pt: Point): Point {
			return new Point(
				this.a * pt.x + this.c * pt.y + this.tx,
				this.b * pt.x + this.d * pt.y + this.ty
			);
		}

		/**
		 * Apply this Matrix to a an object with x and y properties representing a point and return the transformed point.
		 * @method transformPoint
		 * @param pt {Object} The point to be translated.
		 * @return {Kiwi.Geom.Matrix} This object.
		 * @public
		 */
		public transformPointInPlace(pt: Point) {
			var x = pt.x;
			var y = pt.y;
			pt.x = this.a * x + this.c * y + this.tx;
			pt.y = this.b * x + this.d * y + this.ty;
		}

		/**
		 * Invert this Matrix so that it represents the opposite of its orginal tranformaation.
		 * @method invert
		 * @return {Kiwi.Geom.Matrix} This object.
		 * @public
		 */
		public invert(): Matrix {
			var a1 = this.a;
			var b1 = this.b;
			var c1 = this.c;
			var d1 = this.d;
			var tx1 = this.tx;
			var n = a1 * d1 - b1 * c1;

			this.a = d1 / n;
			this.b = -b1 / n;
			this.c = -c1 / n;
			this.d = a1 / n;
			this.tx = (c1 * this.ty - d1 * tx1) / n;
			this.ty = -(a1 * this.ty - b1 * tx1) / n;
			return this;
		}

		/**
		 * Invert this Matrix so that it represents the opposite of its orginal tranformaation.
		 * @method invert
		 * @return {Kiwi.Geom.Matrix} This object.
		 * @public
		 */
		public invertCopy(): Matrix {
			return this.clone().invert();
		}

		/**
		 * Clone this Matrix and returns a new Matrix object.
		 * @method clone
		 * @return {Kiwi.Geom.Matrix}
		 * @public
		 */
		public clone(): Matrix {
			return new Kiwi.Geom.Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
		}

		/**
		 * Returns a string representation of this object.
		 * @method toString
		 * @return {string} A string representation of the instance.
		 * @public
		 */
		public get toString(): string {
			return "[{Matrix (a=" + this.a + " b=" + this.b + " c=" + this.c + " d=" + this.d + " tx=" + this.tx + " ty=" + this.ty + ")}]";
		}

		/**
		 * Check whether this Matrix equals another Matrix.
		 *
		 * @method equals
		 * @param Matrix {Kiwi.Geom.Matrix}
		 * @return boolean
		 * @public
		 */
		public equals( Matrix: Matrix ): boolean {
			return (
				this.a === Matrix.a &&
				this.b === Matrix.b &&
				this.c === Matrix.c &&
				this.d === Matrix.d &&
				this.tx === Matrix.tx &&
				this.ty === Matrix.ty );
		}
	}
}
