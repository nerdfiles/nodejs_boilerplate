"use strict";

$(function() {

	$('#wat button').bind('click', function(e) {
		e.preventDefault();
		e.stopPropagation();

		var socket = io.connect('http://localhost:3000');
		var $this = $(this).closest('form');

		//console.log($this.serialize());

		socket.on('connect', function (data) {
			var data = 'test form socket',
					anothervalue = (64*200);

			//console.log(data);

			// @note data sanitize? calculations, etc.

			// @note pass data to socket to store
			
			socket.emit('test form', { 
				my: data, 
				anothervalue: anothervalue, 
				form: $this.serialize() 
			});
		});

	});

});
