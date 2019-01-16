/**
 * @module Kiwi
 */

module Kiwi {

	export class Transformable {
		protected _dirty: boolean = true;
		public get dirty() { return this._dirty; }
		public set dirty(val: boolean) { this._dirty = val; }

		public transform: Kiwi.Geom.Transform;

		public get x(): number { return this.transform.x; }
		public get y(): number { return this.transform.y; }
		public set x(x: number) { this.transform.x = x; }
		public set y(y: number) { this.transform.y = y; }
		public set xy(pt: Kiwi.Geom.Point) { this.transform.xy = pt; }
		public setXY(x: number, y: number) { this.transform.setXY(x, y); }

		public get scale() { return this.transform.scale; }
		public set scaleX(x: number) { this.transform.scaleX = x; }
		public set scaleY(y: number) { this.transform.scaleY = y; }
		public set scale(pt: Kiwi.Geom.Point | number ) { this.transform.scale = pt; }
		public setScale(w: number, h: number) { this.transform.setScale(w, h); }

		public set rotation(angle: number) { this.transform.rotation = angle; }
		public set rotationRad(angle: number) { this.transform.rotationRad = angle; }
		// public rotate(angle: number) { this.transform.rotate(angle); }
		// public rotateRad(angle: number) {}

		public set pivotPoint(pt: Kiwi.Geom.Point) { this.transform.pivotPoint = pt; }
		public set pivotPointX(x: number) { this.transform.pivotPointX = x; }
		public set pivotPointY(y: number) { this.transform.pivotPointY = y; }
		public setPivotPoint(x: number, y: number) { this.transform.setPivotPoint(x, y); }

		public get origin() { return this.transform.origin; }
		public set origin(pt: Kiwi.Geom.Point) { this.transform.origin = pt; }
		public set originX(x: number) { this.transform.originX = x; }
		public set originY(y: number) { this.transform.originY = y; }
		public setOrigin(x: number, y: number) { this.transform.setOrigin(x, y); }

		// Freeform
		public freeformScale(x: number, y: number, aroundX: number, aroundY: number) {
			this.transform.freeformScale(x, y, aroundX, aroundY);
		}

		constructor() {
			this.transform = new Kiwi.Geom.Transform(this);
		}

		/**
		 * Call this to clean up the object for deletion and garbage collection.
		 * @method destroy
		 * @param [immediate=false] {boolean} If the object should be immediately removed or if it should be removed at the end of the next update loop.
		 * @public
		 */
		public destroy(...params: any[]) {
			this.transform.destroy();
			delete this.transform;
		}
	}
}
