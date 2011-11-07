/*!
 * jQuery Chrony - A Count Down Plugin - http://wbotelhos.com/chrony
 * ---------------------------------------------------------------------------------
 *
 * jQuery Chrony is a plugin that creates a chronometer.
 *
 * Licensed under The MIT License
 *
 * @version        0.1.0
 * @since          2011.10.23
 * @author         Washington Botelho
 * @documentation  wbotelhos.com/chrony
 * @twitter        twitter.com/wbotelhos
 * @license        opensource.org/licenses/mit-license.php
 * @package        jQuery Plugins
 *
 * Usage with default values:
 * ---------------------------------------------------------------------------------
 * $('#time').chrony({ hour: 1, minute: 2, second: 3 });
 *
 * <div id="time"></div>
 *
 */

;(function($) {

	var methods = {
		init: function(options) {
			return this.each(function() {

				var $this		= $(this),
					opt			= $.extend({}, $.fn.chrony.defaults, options),
					id			= $this.data('options', opt).attr('id'),
					separator	= '<span style="float: left;">:</span>';

				if (opt.text) {
					var text = opt.text.split(':');

					if (text.length != 3) {
						$.error('The format must be the following HH:mm:ss!');
					}

					opt.second = text[2];
					opt.minute = text[1];
					opt.hour = text[0];
				} else if (opt.hours) {
					if (opt.hours >= 24) {
						opt.hour = 23;
						opt.minute = 59;
						opt.second = 59;
					} else {
						opt.second = 0;
						opt.minute = 0;
						opt.hour = opt.hours;
					}
				} else if (opt.minutes) {
					opt.second = 0;
					opt.minute = opt.minutes % 60;
					opt.hour = (opt.minutes - opt.minute) / 60;
				} else if (opt.seconds) {
					opt.second = opt.seconds % 60;
					opt.minute = ((opt.seconds - opt.second) / 60) % 60;
					opt.hour = ((opt.seconds - opt.second) - (opt.minute * 60)) / 60 / 60;
				}

				var message = methods.checkTime(opt.hour, opt.minute, opt.second);
	
				if (message) {
					$this.html('<div style="color: #F00; font-size: 9px;">Number out of range!</div>');
					$.error(message);
				}

				var hour		= methods.getNumber(opt.hour),
					minute		= methods.getNumber(opt.minute),
					second		= methods.getNumber(opt.second),
					$hour		= $('<div/>', { id: 'hour', html: hour, style: 'float: left;' }),
					$minute		= $('<div/>', { id: 'minute', html: minute, style: 'float: left;' }),
					$second		= $('<div/>', { id: 'second', html: second, style: 'float: left;' }),
					timer		= 0;

				if (id === undefined) {
					id = 'chrony-' + $this.index();
					$this.attr('id', id); 
				}

				$this.append($hour).append(separator).append($minute).append(separator).append($second);

				var $separators = $this.children('span');

				if (opt.alert) {
					if (!opt.alert.color) {
						opt.alert.color = '#F00';
					}

					if (!opt.alert.hour) {
						opt.alert.hour = 0;
					}

					if (!opt.alert.minute) {
						opt.alert.minute = 0;
					}

					if (!opt.alert.second) {
						opt.alert.second = 0;
					}
				}

				methods.checkAlert.apply($this, [opt.alert, hour, minute, second]);

				timer = setInterval(function() {
					if (opt.blink) {
						$separators.fadeOut(opt.blinkTime, function() {
						    $(this).fadeIn(opt.blinkTime);
						});
					}

					if (second == 0) {
						if (minute == 0) {
							if (hour > 0) {
								hour = methods.getNumber(hour - opt.decrement);
								minute = 59;
								second = 59;

								$hour.html(hour);
								$minute.html(minute);
								$second.html(second);
							}
						} else {
							minute = methods.getNumber(minute - opt.decrement);
							second = 59;

							$minute.html(minute);
							$second.html(second);
						}
					} else {
						second = methods.getNumber(second - opt.decrement);
						$second.html(second);
					}

					if (opt.finish && second == 0 && minute == 0 && hour == 0) {
						opt.finish.call($this);

						clearInterval(timer);
					}

					methods.checkAlert.apply($this, [opt.alert, hour, minute, second]);
				}, 1000);
			});
		}, checkAlert: function(alert, hour, minute, second) {
			if (alert && this.css('color') != '') {
				if (hour <= alert.hour && minute <= alert.minute && second <= alert.second) {
					this.css('color', alert.color);
				}
			}
		}, checkTime: function(hour, minute, second) {
			if (hour < 0 || hour > 24) {
				return 'The hour must be >= 0 or <= 24';
			}

			if (minute < 0 || minute > 59) {
				return 'The minute must be >= 0 or <= 59';
			}

			if (second < 0 || second > 59) {
				return 'The second must be >= 0 or <= 59';
			}
		}, getNumber: function(number) {
			return (number < 10) ? '0' + ((number < 0) ? '0' : number) : number;
		}
	};

	$.fn.chrony = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist!');
		} 
	};

	$.fn.chrony.defaults = {
		alert:		{ color: '#F00', hour: 0, minute: 0, second: 10 },
		blink:		false,
		blinkTime:	130,
		finish:		undefined,
		decrement:	1,
		hour:		0,
		hours:		undefined,
		minute:		0,
		minutes:	undefined,
		second:		0,
		seconds:	undefined,
		text:		undefined
	};

})(jQuery);