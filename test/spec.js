describe('Chrony', function() {

	beforeEach(function() {
	    $('body').append('<div id="time"></div>');
	});

	afterEach(function () {
		$('#time').remove();
	});

	describe('checking initialization', function() {

		it('should mount the right clock', function() {
			// given
			var $time = $('#time');

			// when
			$time.chrony({ hour: 1, minute: 2, second: 3 });

			var	$firstColon		= $time.children('span').eq(0),
				$secondColon	= $time.children('span').eq(1);

			// then
		    expect($time).toContain('div#hour');
		    expect($time).toContain('div#minute');
		    expect($time).toContain('div#second');
		    expect($firstColon).toExist();
		    expect($secondColon).toExist();
		});

		it('should initialize correctly with zeros', function() {
			// given
			var $time = $('#time');

			// when
			$time.chrony({ hour: 1, minute: 2, second: 3 });

			var $hour			= $time.children('#hour'),
				$firstColon		= $time.children('span').eq(0),
				$minute			= $time.children('#minute'),
				$secondColon	= $time.children('span').eq(1),
				$second			= $time.children('#second');

			// then
		    expect($hour).toHaveText('01');
		    expect($firstColon).toHaveText(':');
		    expect($minute).toHaveText('02');
		    expect($secondColon).toHaveText(':');
		    expect($second).toHaveText('03');
		});

		it('should initialize correctly without zeros', function() {
			// given
			var $time = $('#time');

			// when
			$time.chrony({ hour: 10, minute: 20, second: 30 });

			var $hour			= $time.children('#hour'),
				$firstColon		= $time.children('span').eq(0),
				$minute			= $time.children('#minute'),
				$secondColon	= $time.children('span').eq(1),
				$second			= $time.children('#second');

			// then
		    expect($hour).toHaveText('10');
		    expect($firstColon).toHaveText(':');
		    expect($minute).toHaveText('20');
		    expect($secondColon).toHaveText(':');
		    expect($second).toHaveText('30');
		});

	});

	describe('auto adjusting the time', function() {

		it('should adjust the seconds with hour minute and second', function() {
			// given
			var $time = $('#time');

			// when
			$time.chrony({ seconds: (1 * 60 * 60) + (2 * 60) + 3 });

			var $hour			= $time.children('#hour'),
				$minute			= $time.children('#minute'),
				$second			= $time.children('#second');

			// then
		    expect($hour).toHaveText('01');
		    expect($minute).toHaveText('02');
		    expect($second).toHaveText('03');
		});

		it('should adjust the minutes with hour and minute', function() {
			// given
			var $time = $('#time');

			// when
			$time.chrony({ minutes:  (1 * 60) + 2 });

			var $hour			= $time.children('#hour'),
				$minute			= $time.children('#minute'),
				$second			= $time.children('#second');

			// then
		    expect($hour).toHaveText('01');
		    expect($minute).toHaveText('02');
		    expect($second).toHaveText('00');
		});

		it('should adjust the hours with hour', function() {
			// given
			var $time = $('#time');

			// when
			$time.chrony({ hours:  23 });

			var $hour			= $time.children('#hour'),
				$minute			= $time.children('#minute'),
				$second			= $time.children('#second');

			// then
		    expect($hour).toHaveText('23');
		    expect($minute).toHaveText('00');
		    expect($second).toHaveText('00');
		});

		it('should adjust the hours with max time', function() {
			// given
			var $time = $('#time');

			// when
			$time.chrony({ hours:  27 });

			var $hour			= $time.children('#hour'),
				$minute			= $time.children('#minute'),
				$second			= $time.children('#second');

			// then
		    expect($hour).toHaveText('23');
		    expect($minute).toHaveText('59');
		    expect($second).toHaveText('59');
		});

	});

	describe('checking the clock', function() {

		beforeEach(function() {
			jasmine.Clock.useMock();
		});

		it('should mount the right clock', function() {
			// given
			var $time = $('#time');

			// when
			$time.chrony({ hour: 1, minute: 1, second: 1 });

			var $hour			= $time.children('#hour'),
				$firstColon		= $time.children('span').eq(0),
				$minute			= $time.children('#minute'),
				$secondColon	= $time.children('span').eq(1),
				$second			= $time.children('#second');

			// then
			expect($hour).toHaveText('01');
			expect($firstColon).toHaveText(':');
			expect($minute).toHaveText('01');
			expect($secondColon).toHaveText(':');
			expect($second).toHaveText('01');

			jasmine.Clock.tick(1000);
			expect($hour).toHaveText('01');
			expect($firstColon).toHaveText(':');
			expect($minute).toHaveText('01');
			expect($secondColon).toHaveText(':');
			expect($second).toHaveText('00');

			jasmine.Clock.tick(1000);
			expect($hour).toHaveText('01');
			expect($firstColon).toHaveText(':');
			expect($minute).toHaveText('00');
			expect($secondColon).toHaveText(':');
			expect($second).toHaveText('59');

			jasmine.Clock.tick(1000 * 59);
			expect($hour).toHaveText('01');
			expect($firstColon).toHaveText(':');
			expect($minute).toHaveText('00');
			expect($secondColon).toHaveText(':');
			expect($second).toHaveText('00');

			jasmine.Clock.tick(1000 * 60);
			expect($hour).toHaveText('00');
			expect($firstColon).toHaveText(':');
			expect($minute).toHaveText('59');
			expect($secondColon).toHaveText(':');
			expect($second).toHaveText('00');

			jasmine.Clock.tick(1000 * 60 * 59);
			expect($hour).toHaveText('00');
			expect($firstColon).toHaveText(':');
			expect($minute).toHaveText('00');
			expect($secondColon).toHaveText(':');
			expect($second).toHaveText('00');

			jasmine.Clock.tick(1000);
			expect($hour).toHaveText('00');
			expect($firstColon).toHaveText(':');
			expect($minute).toHaveText('00');
			expect($secondColon).toHaveText(':');
			expect($second).toHaveText('00');
		});

		it('should call the callback', function() {
			// given
			var $time		= $('#time'),
				expected	= 'Finished!';

			// when
			$time.chrony({ seconds: 1, finish: function() { $(this).html(expected); } });

			// then
			jasmine.Clock.tick(1000);
			expect($time).toHaveText(expected);
		});

		it('should call clock alert', function() {
			// given
			var $time = $('#time');

			// when
			$time.chrony({ seconds: 2, alert: { color: '#F00', hour: 0, minute: 0, second: 1 } });

			// then
			expect($time).not.toHaveAttr('style', 'color: rgb(255, 0, 0);');
			jasmine.Clock.tick(999);
			expect($time).not.toHaveAttr('style', 'color: rgb(255, 0, 0);');

			expect($time).not.toHaveAttr('style', 'color: rgb(255, 0, 0);');
			jasmine.Clock.tick(1);
			expect($time).toHaveAttr('style', 'color: rgb(255, 0, 0);');
		});

		it('should call clock alert without color', function() {
			// given
			var $time = $('#time');

			// when
			$time.chrony({ second: 2, alert: { second: 1 } });

			// then
			expect($time).not.toHaveAttr('style', 'color: rgb(255, 0, 0);');
			jasmine.Clock.tick(1000);
			expect($time).toHaveAttr('style', 'color: rgb(255, 0, 0);');
		});

		it('should call clock alert just with second', function() {
			// given
			var $time = $('#time');

			// when
			$time.chrony({ seconds: 2, alert: { second: 1 } });

			// then
			expect($time).not.toHaveAttr('style', 'color: rgb(255, 0, 0);');
			jasmine.Clock.tick(1000);
			expect($time).toHaveAttr('style', 'color: rgb(255, 0, 0);');
		});

		it('should call clock alert just with minute', function() {
			// given
			var $time = $('#time');

			// when
			$time.chrony({ minute: 2, alert: { minute: 1 } });

			// then
			expect($time).not.toHaveAttr('style', 'color: rgb(255, 0, 0);');
			jasmine.Clock.tick(1000 * 60);
			expect($time).toHaveAttr('style', 'color: rgb(255, 0, 0);');
		});

		it('should call clock alert just with hour', function() {
			// given
			var $time = $('#time');

			// when
			$time.chrony({ hour: 2, alert: { hour: 1 } });

			// then
			expect($time).not.toHaveAttr('style', 'color: rgb(255, 0, 0);');
			jasmine.Clock.tick(1000 * 60 * 60);
			expect($time).toHaveAttr('style', 'color: rgb(255, 0, 0);');
		});

		it('should call clock alert with custom color', function() {
			// given
			var $time = $('#time');

			// when
			$time.chrony({ hour: 1, alert: { color: '#0F0' } });

			// then
			expect($time).not.toHaveAttr('style', 'color: rgb(0, 255, 0);');
			jasmine.Clock.tick(1000 * 60 * 60);
			expect($time).toHaveAttr('style', 'color: rgb(0, 255, 0);');
		});
		
		it('should not display hours digits', function() {
			// given
			var $time = $('#time');

			// when
			$time.chrony({ minutes: 20, displayHours: false});

			// then
			var $firstColon		= $time.children('span').eq(0),
				$secondColon	= $time.children('span').eq(1);

			expect($time).not.toContain('div#hour');
			expect($time).toContain('div#minute');
			expect($time).toContain('div#second');
			expect($firstColon).toExist();
			expect($secondColon).not.toExist();
		});
		
		it('should not display minutes digits', function() {
			// given
			var $time = $('#time');

			// when
			$time.chrony({ seconds: 20, displayMinutes: false});

			// then
			var $firstColon		= $time.children('span').eq(0),
				$secondColon	= $time.children('span').eq(1);

			expect($time).toContain('div#hour');
			expect($time).not.toContain('div#minute');
			expect($time).toContain('div#second');
			expect($firstColon).toExist();
			expect($secondColon).not.toExist();
		});
		
		it('should not display seconds digits', function() {
			// given
			var $time = $('#time');

			// when
			$time.chrony({ minutes: 20, displaySeconds: false});

			// then
			var $firstColon		= $time.children('span').eq(0),
				$secondColon	= $time.children('span').eq(1);

			expect($time).toContain('div#hour');
			expect($time).toContain('div#minute');
			expect($time).not.toContain('div#second');
			expect($firstColon).toExist();
			expect($secondColon).not.toExist();
		});
		
		it('should not display minutes and seconds digits', function() {
			// given
			var $time = $('#time');

			// when
			$time.chrony({ hours: 20, displayMinutes: false, displaySeconds: false});

			// then
			var $firstColon		= $time.children('span').eq(0),
				$secondColon	= $time.children('span').eq(1);

			expect($time).toContain('div#hour');
			expect($time).not.toContain('div#minute');
			expect($time).not.toContain('div#second');
			expect($firstColon).not.toExist();
			expect($secondColon).not.toExist();
		});

	});

});