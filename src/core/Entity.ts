/**
*
* @module Kiwi
*
*/

module Kiwi {

	/**
	* An Entity is a base class for game objects to extend from and thus you should never directly instantiate this class.
	* Every entity requires that you pass to it the state to which it belongs, so that when you switch states the appropriate entities can be deleted.
	* 
	* @class Entity
	* @namespace Kiwi
	* @constructor
	* @param state {State} The state that this entity belongs to. Used to generate the Unique ID and for garbage collection.
	* @param x {Number} The entities position on the x axis.
	* @param y {Number} The entities position on the y axis.
	* @return {Kiwi.Entity} This entity.
	*
	*/
	export class Entity extends Kiwi.Transformable implements Kiwi.IChild {

		constructor(state: Kiwi.State, x:number, y: number) {
			super();

			//  Properties
			this.state = state;
			this.game = state.game;
			this.id = this.game.rnd.uuid();
			this.state.addToTrackingList(this);
			this._clock = this.game.time.clock;
			 
			this._exists = true;
			this._active = true;
			this._visible = true;
			this.components = new Kiwi.ComponentManager(Kiwi.ENTITY, this); 
			this.transform.setXY(x, y);
		}

		public glRenderer: Kiwi.Renderers.Renderer;


		/**
		* The group that this entity belongs to. If added onto the state then this is the state.
		* @property _parent
		* @type Kiwi.Group
		* @private
		*/
		private _parent: Kiwi.Group = null;

		/**
		* The group that this entity belongs to/is a child of once added to one. If added onto the state then this is the state.
		* @property parent
		* @type Group
		* @param val {Kiwi.Group}
		* @public
		*/
		public set parent(val: Kiwi.Group) {
			this.transform.parent = (val !== null) ? val.transform : null ;
			this._parent = val;
		}
		public get parent(): Kiwi.Group {
			return this._parent;
		}

		/**
		* Returns the type of child that this is. 
		* @type Number
		* @return {Number} returns the type of child that the entity is
		* @public
		*/
		public childType():number {
			return Kiwi.ENTITY;
		}

		/**
		* The alpha of this entity.
		* @property _alpha
		* @type Number
		* @private
		*/
		private _alpha: number = 1;

		/**
		* Alpha of this entity. A number between 0 (invisible) and 1 (completely visible).
		* @property alpha
		* @type Number
		* @public
		*/
		public set alpha(value: number) {
			if (value <= 0) value = 0;
			if (value > 1) value = 1;
			this._alpha = value;
		}
		
		public get alpha(): number {
			return this._alpha;
		}

		/**
		* A boolean that indicates whether or not this entity is visible or not. Note that is does not get set to false if the alpha is 0.
		* @property _visible
		* @type boolean
		* @default true
		* @private
		*/
		private _visible: boolean;

		/**
		* Set the visibility of this entity. True or False.
		* @property visible
		* @type boolean
		* @default true
		* @public
		*/
		public set visible(value: boolean) {
			this._visible = value;
		}
		public get visible(): boolean {
			return this._visible;
		}

		/**
		* The width of the entity in pixels, pre-transform.
		*
		* To obtain the actual width, multiply width by scaleX.
		* @property width
		* @type number
		* @default 0 
		* @public
		*/
		public width: number = 0;   //If bounds are implemented then getters and setters here would be nice.

		/**
		* The height of the entity in pixels, pre-transform.
		*
		* To obtain the actual height, multiply height by scaleY.
		* @property height
		* @type number
		* @default 0
		* @public
		*/
		public height: number = 0;

		/**
		* Scale to desired width, preserving aspect ratio. This function changes the scale, not the width. If the width changes, for example, as part of an animation sequence, the Entity will retain the new scale.
		* @method scaleToWidth
		* @param value {Number} The desired width in pixels.
		* @public
		* @since 1.1.0
		*/
		public scaleToWidth(value: number) {
			var s = value / this.width;
			this.transform.setScale(s, s);
		}

		/**
		* Scale to desired height, preserving aspect ratio. This function changes the scale, not the height. If the height changes, for example, as part of an animation sequence, the Entity will retain the new scale.
		* @method scaleToHeight
		* @param value {Number} The desired height in pixels.
		* @public
		* @since 1.1.0
		*/
		public scaleToHeight(value: number) {
			var s = value / this.height;
			this.transform.setScale(s, s);
		}

		/**
		* The texture atlas that is to be used on this entity.
		* @property atlas
		* @type Kiwi.Textures.TextureAtlas
		* @public
		*/
		public atlas: Kiwi.Textures.TextureAtlas = null;
		
		/**
		* Holds the current cell that is being used by the entity.
		* @property _cellIndex
		* @type number
		* @default 0
		* @private
		*/
		private _cellIndex: number = 0; 

		/**
		* Used as a reference to a single Cell in the atlas that is to be rendered. 
		* 
		* E.g. If you had a spritesheet with 3 frames/cells and you wanted the second frame to be displayed you would change this value to 1
		* @property cellIndex
		* @type number
		* @default 0
		* @public
		*/
		public get cellIndex():number {
			return this._cellIndex;
		}

		public set cellIndex(val: number) {
			//If the entity has a texture atlas
			if (this.atlas !== null) {
				var cell = this.atlas.cells[val];

				if (cell !== undefined) {
					//Update the width/height of the GameObject to be the same as the width/height
					this._cellIndex = val;
					this.width = cell.w;
					this.height = cell.h;

				} else {

					Kiwi.Log.error('Could not the set the cellIndex of a Entity, to cell that does not exist on its TextureAtlas.', '#entity', "#cellIndex");

				}
			}
		}

		/**
		* The Component Manager
		* @property components
		* @type Kiwi.ComponentManager
		* @public
		*/
		public components: Kiwi.ComponentManager;

		/**
		* The game this Entity belongs to
		* @property game
		* @type Game
		* @public
		*/
		public game: Kiwi.Game;

		/**
		* The state this Entity belongs to (either the current game state or a persistent world state)
		* @property state
		* @type State
		* @public
		*/
		public state: Kiwi.State;

		/**
		* A unique identifier for this Entity within the game used internally by the framework. See the name property for a friendly version.
		* @property id
		* @type string
		* @public
		*/
		public id: string;

		/**
		* A name for this Entity. This is not checked for uniqueness within the Game, but is very useful for debugging
		* @property name
		* @type string
		* @default ''
		* @public
		*/
		public name: string = '';

		/**
		* If an Entity no longer exists it is cleared for garbage collection or pool re-allocation
		* @property _exists 
		* @type boolean
		* @private
		*/
		private _exists: boolean;

		/**
		* Toggles the existence of this Entity. An Entity that no longer exists can be garbage collected or re-allocated in a pool.
		* @property exists
		* @type boolean
		* @public
		*/
		public set exists(value: boolean) {
			this._exists = value;
		}
		public get exists():boolean {
			return this._exists;
		}

		/**
		* Any tags that are on this Entity. This can be used to grab GameObjects or Groups on the whole game which have these particular tags.
		* By default Entitys contain no tags.
		* @property _tags
		* @type Array
		* @since 1.1.0
		* @private
		*/
		private _tags: string[] = [];

		/**
		* Adds a new Tag to this Entity. Useful for identifying large amounts of the same type of GameObjects.
		* You can pass multiple strings to add multiple tags.
		* @method addTag
		* @param tag {string} The tag that you would like to add to this Entity.
		* @since 1.1.0
		* @public
		*/
		public addTag(...args: any[]) {

			//Loop through the arguments
			for (var i = 0; i < args.length; i++) {
				if (this._tags.indexOf(args[i]) == -1) {
					this._tags.push(args[i]);
				}
			}
			
		}

		/**
		* Removes a Tag from this Entity.
		* @method removeTag
		* @param tag {string} The tag that you would like to remove from this Entity.
		* @since 1.1.0
		* @public
		*/
		public removeTag(...args: any[]) {

			for (var i = 0; i < args.length; i++) {
				var index = this._tags.indexOf(args[i]);
				if (index !== -1) this._tags.splice(index, 1);
			}

		}

		/**
		* Checks to see if this Entity has a Tag based upon a string which you pass.
		* @method hasTag
		* @param tag {string} 
		* @since 1.1.0
		* @return {boolean}
		* @public 
		*/
		public hasTag(tag: string): boolean {

			var len = this._tags.length;
			while (len--) {
				if (this._tags[len] === tag) {
					return true;
				}
			}

			return false;
		}


		/**
		* An active Entity is one that has its update method called by its parent. 
		* @property _active
		* @type boolean
		* @default true
		* @private
		*/
		private _active: boolean;

		/**
		* Toggles the active state of this Entity. An Entity that is active has its update method called by its parent.
		* This method should be over-ridden to handle specific dom/canvas/webgl implementations.
		* @property active
		* @type boolean
		* @public
		*/
		public set active(value: boolean) {
			this._active = value;
		}
		public get active():boolean {
			return this._active;
		}

		/**
		* The clock that this entity use's for time based calculations. This generated by the state on instatiation.
		* @property _clock
		* @type Kiwi.Clock
		* @private
		*/
		private _clock: Kiwi.Time.Clock = null;

		/**
		* The Clock used to update this all of this Entities components (defaults to the Game MasterClock)
		* @property clock 
		* @type Kiwi.Time.Clock
		* @public
		*/
		public set clock(value: Kiwi.Time.Clock) {
			this._clock = value;
		}
		public get clock(): Kiwi.Time.Clock {
			return this._clock;
		}

		//  Both of these methods can and often should be over-ridden by classes extending Entity to handle specific implementations

		/**
		* The type of this object.
		* @method objType
		* @return {String} "Entity"
		* @public
		*/
		public objType() {
			return "Entity";
		}

		/**
		* This isn't called until the Entity has been added to a Group or a State.
		* Note: If added to a Group, who is not 'active' (so the Groups update loop doesn't run) then each member will not execute either.
		* @method update
		* @public
		*/
		public update() {

			this.components.preUpdate();
			this.components.update();
			this.components.postUpdate();

		}

		/**
		* Renders the entity using the canvas renderer. 
		* This isn't called until the Entity has been added to a Group/State which is active.
		* This functionality is handled by the sub classes. 
		* @method render
		* @param {Camera} camera
		* @public
		*/
		public render(camera:Kiwi.Camera) {
		
		}

		/**
		* Renders the entity using the canvas renderer. 
		* This isn't called until the Entity has been added to a Group/State which is active.
		* This functionality is handled by the sub classes. 
		* @method renderGL
		* @param {Kiwi.Camera} camera
		* @param {WebGLRenderingContext} gl
		* @param [params=null] {object} params
		* @public
		*/
		public renderGL(gl: WebGLRenderingContext, camera: Kiwi.Camera, params: any = null) {

		}

		/**
		* Used to completely destroy this entity and of its components.
		* Used for garbage collection and developers can also use it as needed.
		* It is more reliable to use "exists = false", as this will ensure
		* that "destroy" is called at a convenient time.
		* @method destroy
		* @param [immediate=false] {boolean} If the object should be immediately removed or if it should be removed at the end of the next update loop.
		* @public
		*/
		public destroy(immediate: boolean = false) {
			super.destroy();
			this._exists = false;
			this._active = false;
			this._visible = false;

			if (immediate === true) {

				if (this.parent !== null && typeof this.parent !== "undefined") this.parent.removeChild(this);
				if (this.state) this.state.removeFromTrackingList(this);
				delete this._parent;
				delete this._clock;
				delete this.state;
				delete this.game;
				delete this.atlas;

				if (this.components) this.components.removeAll(true);
				delete this.components;

			}
		}

	}

}
