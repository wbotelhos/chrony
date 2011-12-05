# jQuery Chrony - A Count Down Plugin - http://wbotelhos.com/chrony

jQuery Chrony is a plugin that creates a chronometer.

## License

The jQuery Chrony is licensed under [The MIT License](http://www.opensource.org/licenses/mit-license.php)

## Version

	@version        0.1.0
	@since          2011.10.23
	@author         Washington Botelho dos Santos
	@documentation  wbotelhos.com/chrony
	@twitter        twitter.com/wbotelhos

## Required Files

+ jquery.chrony.min.js

## Default values

	alert:      { second: 10 }  // Attributes color, hour, minute and second to configure the alert.
	blink:      false           // Enables the colon blink.
	blinkTime:  130             // Time spent to blink the colon.
	finish:     undefined       // Callback function to be executed when the time ends.
	decrement:  1               // Number of seconds used to decrement the time.
	hour:       0               // Number of hours initial.
	hours:      undefined       // Number of hours initial auto adjusted to max if needed.
	minute:     0               // Number of minutes initial.
	minutes:    undefined       // Number of minutes initial auto adjusted to hour if needed.
	second:     0               // Number of seconds initial.
	seconds:    undefined       // Number of seconds initial auto adjusted to minute if needed.
	text:       undefined       // Time written out in full using the following mask: HH:mm:ss.

## Usage with default values

	$('#time').chrony({ hour: 1, minute: 2, second: 3 });

	<div id="time"></div>

## Buy me a coffee

You can do it by [PayPal](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=X8HEP2878NDEG&item_name=jQuery%20Chrony). Thanks! (: