sap.ui.define(["jQuery.sap.global", "sap/ui/base/Object", "sap/ui/model/json/JSONModel"], function(jQuery, BaseObject, JSONModel) {
	/**
	 * Detect wheather input is coming from user useing a scanner (barcode, QR Code...) instead of a keyboard
	 *
	 * @class (mandatory) Marks the function as a constructor (defining a class).
	 * @param {string} sId 
	 * @param {object} [mProperties=null] 
	 * @param {string} [mProperties.foobar]
	 * events:
	 *	scannerDetectionComplete
	 *	scannerDetectionError
	 * @public
	 * @extends sap.ui.base.Object
	 * @name foo.bar.MyClass.
	 */
	var ScannerDetection = BaseObject.extend("foo.bar.MyClass", /** @lends foo.bar.MyClass */ {

		constructor: function(sId, mProperties) {

			this.mId = sId || Utils.createGUID();

			// If string given, call onComplete callback
			if (typeof mProperties === "string") {
				this.scannerDetectionTest(mProperties);
				return this;
			}

			// If false (boolean) given, deinitialize plugin
			if (mProperties === false) {
				this.scannerDetectionOff();
				return this;
			}

			var oDefaults = {
				onComplete: false, // Callback after detection of a successfull scanning (scanned string in parameter)
				onError: false, // Callback after detection of a unsuccessfull scanning (scanned string in parameter)
				onReceive: false, // Callback after receiving and processing a char (scanned char in parameter)
				onKeyDetect: false, // Callback after detecting a keyDown (key char in parameter) - in contrast to onReceive, this fires for non-character keys like tab, arrows, etc. too!
				timeBeforeScanTest: 100, // Wait duration (ms) after keypress event to check if scanning is finished
				avgTimeByChar: 30, // Average time (ms) between 2 chars. Used to do difference between keyboard typing and scanning
				minLength: 1, // Minimum length for a scanning
				endChar: [13], // Chars to remove and means end of scanning
				startChar: [], // Chars to remove and means start of scanning
				ignoreIfFocusOn: false, // do not handle scans if the currently focused element matches this selector
				scanButtonKeyCode: false, // Key code of the scanner hardware button (if the scanner button a acts as a key itself) 
				scanButtonLongPressThreshold: 3, // How many times the hardware button should issue a pressed event before a barcode is read to detect a longpress
				onScanButtonLongPressed: false, // Callback after detection of a successfull scan while the scan button was pressed and held down
				stopPropagation: false, // Stop immediate propagation on keypress event
				preventDefault: false // Prevent default action on keypress event
			};

			if (typeof mProperties === "function") {
				mProperties = {
					onComplete: mProperties
				};
			}

			if (typeof mProperties !== "object") {
				this.oOptions = $.extend({}, oDefaults);
			} else {
				this.oOptions = $.extend({}, oDefaults, mProperties);
			}

		},

		/**
		 * 
		 * @param {string} 
		 * @public
		 */
		initScannerDetection: function() {
			this.firstCharTime = 0;
			this.stringWriting = '';
			this.scanButtonCounter = 0;
		},
		/**
		 * 
		 * @param {string} 
		 * @public
		 */
		isFocusOnIgnoredElement: function() {
			if (!this.oOptions.ignoreIfFocusOn) return false;
			if (typeof this.oOptions.ignoreIfFocusOn === 'string') return $(':focus').is(this.oOptions.ignoreIfFocusOn);
			if (typeof this.oOptions.ignoreIfFocusOn === 'object' && this.oOptions.ignoreIfFocusOn.length) {
				var focused = $(':focus');
				for (var i = 0; i < this.oOptions.ignoreIfFocusOn.length; i++) {
					if (focused.is(this.oOptions.ignoreIfFocusOn[i])) {
						return true;
					}
				}
			}
			return false;
		},
		/**
		 * 
		 * @param {string} 
		 * @public
		 */
		scannerDetectionTest: function(sString) {
			// If string is given, test it
			if (sString) {
				this.firstCharTime = this.lastCharTime = 0;
				this.stringWriting = sString;
			}

			if (!this.scanButtonCounter) {
				this.scanButtonCounter = 1;
			}

			// If all condition are good (length, time...), call the callback and re-initialize the plugin for next scanning
			// Else, just re-initialize
			if (this.stringWriting.length >= this.oOptions.minLength && this.lastCharTime - this.firstCharTime < this.stringWriting.length * this.oOptions.avgTimeByChar) {
				if (this.oOptions.onScanButtonLongPressed && this.scanButtonCounter > this.oOptions.scanButtonLongPressThreshold) {
					this.oOptions.onScanButtonLongPressed.call(self, this.stringWriting, this.scanButtonCounter);
				} else if (this.oOptions.onComplete) {
					this.oOptions.onComplete.call(self, this.stringWriting, this.scanButtonCounter);
				}
				
				//todo: replace with UI5 evend handling
				$self.trigger('scannerDetectionComplete', {
					string: this.stringWriting
				});
				this.initScannerDetection();
				return true;
			} else {
				if (this.oOptions.onError) {
					this.oOptions.onError.call(self, this.stringWriting);
				}
				
				//todo: replace with UI5 evend handling
				$self.trigger('scannerDetectionError', {
					string: this.stringWriting
				});
				this.initScannerDetection();
				return false;
			}
		},

		/**
		 * 
		 * @param {string} 
		 * @public
		 */
		scannerDetectionOff: function() {
			$self.unbind('keydown.scannerDetection');
			$self.unbind('keypress.scannerDetection');
		},

		/**
		 * A private method.
		 *
		 * @private
		 */
		_myVeryPrivateMethod: function() {}

	});

	// return the module value, in this example a class
	return ScannerDetection;
});