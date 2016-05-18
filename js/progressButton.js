// JavaScript Document

//对SVG的操作，首先建立一个UIProgressButton对象
;(function(window){//自动执行的匿名函数

	"use strict";//使用严格模式
	
	var transEndEventNames={
			'WebkitTransition': 'webkitTransitionEnd',
			'MozTransition': 'transitionend',
			'OTransition': 'oTransitionEnd',
			'msTransition': 'MSTransitionEnd',
			'transition': 'transitionend'
		},
		transEndEventName=transEndEventNames[Modernizr.prefixed('transition')],
		support={transitions:Modernizr.csstransitions};
	
	function extend(a,b){
		for(var key in b)
		{
			if(b.hasOwnProperty(key))//object.hasOwnProperty()是用来判断一个对象是否有你给出名称的属性或对象。
				a[key]=b[key];
		}	
		return a;
	};
	
	function UIProgressButton( el, options ) {
		this.el = el;
		this.options = extend( {}, this.options );
		extend( this.options, options );
		this._init();
	};
		 
	UIProgressButton.prototype._init = function() {
		this.button = this.el.querySelector( 'button' );
		this.progressEl = new SVGEl( this.el.querySelector( 'svg.progress-circle' ) );
		this.successEl = new SVGEl( this.el.querySelector( 'svg.checkmark' ) );
		this.errorEl = new SVGEl( this.el.querySelector( 'svg.cross' ) );
		// init events
		this._initEvents();
		// enable button
		this._enable();
	};
	
	function SVGEl( el ) {
		this.el = el;
		// the path elements
		this.paths = [].slice.call( this.el.querySelectorAll( 'path' ) );//querySelectorAll()返回一个path集合
		// we will save both paths and its lengths in arrays
		this.pathsArr = new Array();
		this.lengthsArr = new Array();
		this._init();
	};
		 
	SVGEl.prototype._init = function() {
		var self = this;
		this.paths.forEach( function( path, i ) {
			self.pathsArr[i] = path;
			path.style.strokeDasharray = self.lengthsArr[i] = path.getTotalLength();
		});
		// undraw stroke
		this.draw(0);
	};
	// val in [0,1] : 0 - no stroke is visible, 1 - stroke is visible
	SVGEl.prototype.draw=function(val)
	{
		for(var i=0,len=pathsArr.length;i<len;i++)
		{
			this.pathsArr[i].style.strokeDashoffset=this.lengthsArr[i]*(1-val);
		}	
	};
		
	UIProgressButton.prototype._initEvents = function()
	{
		var self = this;
		this.button.addEventListener( 'click', function() { self._submit();} );
	};
	
	UIProgressButton.prototype._submit = function() {
		// by adding the loading class the button will transition to a "circle"
		classie.addClass( this.el, 'loading' );
		 
		var self = this,
			onEndBtnTransitionFn = function( ev )
		    {
				if( support.transitions ) {
					if(ev.propertyName!='width') return false;
					this.removeEventListener( transEndEventName, onEndBtnTransitionFn );
				}
				// disable the button - this should have been the first thing to do when clicking the button.
				// however if we do so Firefox does not seem to fire the transitionend event. 
				this.setAttribute( 'disabled', '' );
	 
				if( typeof self.options.callback === 'function' ) {
					self.options.callback( self );
				}
				else {
					self.setProgress(1);
					self.stop();
				}
			 };
	 
		if( support.transitions ) {
			this.button.addEventListener( transEndEventName, onEndBtnTransitionFn );
		}
		else {
			onEndBtnTransitionFn();
		}
	};
	// runs after the progress reaches 100%
	UIProgressButton.prototype.stop = function( status ) {
		var self = this,
		
		endLoading = function() {
			self.progressEl.draw(0);
				 
			if( typeof status === 'number' ) {
				var statusClass = status >= 0 ? 'success' : 'error',
					statusEl = status >=0 ? self.successEl : self.errorEl;
	 
					statusEl.draw( 1 );
					// add respective class to the element
					classie.addClass( self.el, statusClass );
					// after options.statusTime remove status and undraw the respective stroke and enable the button
					setTimeout( function() {
						classie.remove( self.el, statusClass );
						statusEl.draw(0);
						self._enable();
					}, self.options.statusTime );
				}
				else {
					self._enable();
				}
	 
				classie.removeClass( self.el, 'loading' );
			};
	 
		// give it a little time (ideally the same like the transition time) so that the last progress increment animation is still visible.
		setTimeout( endLoading, 300 );
	};
	
})(window);