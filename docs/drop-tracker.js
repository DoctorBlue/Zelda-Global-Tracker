class localStorageProp {
	constructor(key, defaultValue) {
		this.key = key;
		this.defaultValue = defaultValue;
		this.setDisplay(this.get());
	}
	
	get() {
		const result = window.localStorage[this.key];
		if (result === undefined) {
			return this.defaultValue;
		}
		return result;
	}
	
	set(value) {
		window.localStorage[this.key] = value;
		this.setDisplay(value);
	}
	
	setDisplay(value) {
		$('#' + this.key).val(value);
	}
}

const keys = {
	advanceCountKey: new localStorageProp('advanceCountKey', 'ArrowRight'),
	regressCountKey: new localStorageProp('regressCountKey', 'ArrowLeft'),
	clearLogKey: new localStorageProp('clearLogKey', 'F4'),
	resetCounterKey: new localStorageProp('resetCounterKey', 'F7'),
	toggleLogKey: new localStorageProp('toggleLogKey', 'F9'),
	highlightKey: new localStorageProp('highlightKey', '0')
};

(function($, window) {
	const $tracker = $('#tracker');
	const $log = $('.log ul');
	const $keyInput = $('input.keyInput');
	
	let currentImage = 0;
	
	$(window).on('blur focus', function(e) {
		$('.blur-warning.focus').toggle(e.type === 'blur');
	});
	
	$keyInput.on('blur focus', function(e) {
		$('.blur-warning.edit').toggle(e.type === 'focus');
	});
	
	$keyInput.blur(function(e) {
		const $target = $(e.target);
		const key = $target.attr('id');
		keys[key].set($target.val());
	});
	
	$(window).keydown(function(e) {
		// TODO: Exclude the keydown event from firing for this.
		const $target = $(e.target);
		if ($target.hasClass('keyInput')) {
			return;
		}
		
		$('#lastKeyPressedDisplay').html(e.key);
		switch(e.key) {
			case keys.advanceCountKey.get():
				increment(1);
				break;
			case keys.regressCountKey.get():
				increment(-1);
				break;
			case keys.clearLogKey.get():
				clearLog();
				break;
			case keys.resetCounterKey.get():
				reset();
				break;
			case keys.toggleLogKey.get():
				toggleLogVisibility();
				break;
			case keys.highlightKey.get():
				highlightLatest();
				break;
			default:
				const pressedNumber = parseInt(e.key, 10);
				if (!isNaN(pressedNumber)) {
					increment(pressedNumber);
				}
				break;
		}
		
		return true;
	});
	
	function toggleLogVisibility() {
		$('.log').toggle();
	}
	
	function clearLog() {
		$log.empty();
	}
	
	function reset() {
		currentImage = 0;
		changeImage();
		updateCounters();
		log('Reset!', 'reset');
	}
	
	function highlightLatest() {
		const $latest = $('.log li:first');
		const removeOnly = $latest.hasClass('highlight');
		
		$('.highlight').removeClass('highlight');
		
		if (removeOnly) return;
		
		$('.log li:first').addClass('highlight');
	}
	
	function increment(amount) {
		const amountToIncrement = amount < 0 ? amount + 10 : amount;
		if (amountToIncrement === 0) return;
		const newImage = (currentImage + amountToIncrement) % 10;
		logNewCount(amount, currentImage, newImage);
		currentImage = newImage;
		changeImage();
		updateCounters(newImage);
	}
	
	function logNewCount(amount, oldImage, newImage) {
		if (amount > 0) {
			amount = '+' + amount;
		}
		log(wrapNumber(amount) + ' (' +  wrapNumber(oldImage) + ' to ' + wrapNumber(newImage) + ')', '');
	}
	
	function wrapNumber(number) {
		return '<span class="number">' + number + '</span>';
	}
	
	function log(message, listItemClass) {
		$log.prepend('<li class="' + listItemClass + '">' + message + '</li>');
	}
	
	function changeImage() {
		$tracker.attr('src', 'img/' + currentImage + '.png');
	}
	
	const $bombCounter = $('#bombCounter');
	const $clockCounter = $('#clockCounter');
	const $fairyCounter = $('#fairyCounter');
	const $fiverCounter = $('#fiverCounter');
	const bombCount = [1, 5, 4, 3, 2, 1, 2, 1, 3, 2];
	const fiverCount = [4, 3, 2, 1, 6, 5, 4, 3, 2, 1];
	const clockBCount = [3, 2, 1, 10, 9, 8, 7, 6, 5, 4];
	const clockCCount = [6, 5, 4, 3, 2, 1, 10, 9, 8, 7];
	const fairyACount = [4, 3, 2, 1, 10, 9, 8, 7, 6, 5];
	const fairyDCount = [2, 1, 3, 2, 1, 7, 6, 5, 4, 3];
	function updateCounters() {
		$bombCounter.html(bombCount[currentImage]);
		$clockCounter.html(renderCounterWithLetter(clockBCount[currentImage], 'B') + ' ' + renderCounterWithLetter(clockCCount[currentImage], 'C'));
		$fairyCounter.html(renderCounterWithLetter(fairyACount[currentImage], 'A') + ' ' + renderCounterWithLetter(fairyDCount[currentImage], 'D'));
		$fiverCounter.html(fiverCount[currentImage]);
	}
	
	function renderCounterWithLetter(count, letter) {
		const includeSpace = count <= 9;
		const letterPart = (includeSpace ? ' ' : '') + '(' + letter + ')';
		return count + letterPart;
	}
	
	updateCounters();
})(jQuery, window);
