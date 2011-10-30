/*********************
Fluid Fader is a jQuery plugin that creates a fluid fading carousel. 

@version 0.1
@licence MIT/GPL
@author Nick Pyett (contact@nickpyett.com)

Fork on GitHub at http://github.com/nickpyett/jquery.fluid-fader
Project page at http://nickpyett.com/jquery/fluid-fader
*********************/

(function($){
	
	var timeout, interval, speed, frame_count, current_frame_var, next_frame_var, options, animation_type, allow_animation;

	var methods = {

		init : function(options){
			
			if ( typeof options != 'undefined' ) {
				
				// WRITE INTERVAL
				if ( parseInt(options.interval) != 'NaN' && options.interval > 1 && typeof options.interval != 'undefined' ) {
					interval = options.interval;
				} else interval = 3000;
				
				// WRITE SPEED
				if ( parseInt(options.speed) != 'NaN' && typeof options.speed != 'undefined' ) {
					speed = options.speed;
				} else speed = 500;
				
				if ( options.animation_type != '' && typeof options.animation_type != 'undefined' ) {
					animation_type = options.animation_type;
				} else animation_type = 'fade';
				
			} else {
				
				// SET DEFAULTS
				interval = 3000;
				animation_type = 'fade';
				speed = 500;
			}

			// COUNT ALL FRAMES
			frame_count = $('#fluid-fader-frames > div').size();
			
			// SET CURRENT FRAME
			current_frame_var = 1;
			next_frame_var = 2;
			
			// ALLOW AMIMATION
			allow_animation = true;

			// HIDE ALL FRAMES
			$('#fluid-fader-frames div').hide();
			
			// BIND FUNCTIONS TO LEFT DIRECITON
			$('#fluid-fader-direction-left').click(function(e){
				
				e.preventDefault();
				
				if ( current_frame_var == 1 ) {
					next_frame_timeout = frame_count;
				} else {
					next_frame_timeout = current_frame_var - 1;
				}
				
				$(this).fluidfader('animation_action', {current_frame:current_frame_var, next_frame:next_frame_timeout});
			});
			
			// BIND FUNCTION TO RIGHT DIRECTION
			$('#fluid-fader-direction-right').click(function(e){
				
				e.preventDefault();
				
				$(this).fluidfader('animation_action', {current_frame:current_frame_var, next_frame:next_frame_var});
			});
			
			// BIND FUNCTION TO FRAME LINKS
			$('#fluid-fader-links a').click(function(e){
				
				e.preventDefault();
				
				link_index = $(this).index() + 1;
				
				if ( link_index != current_frame_var ) {
					$(this).fluidfader('animation_action', {current_frame:current_frame_var, next_frame:link_index});					
				}
			});
			
			if ( frame_count > 1 ) {

				// SHOW WRAPPER IF THERE FRAMES (HIDDEN IN CSS)
				this.show();
				
				// SHOW FIRST IMAGE AND SET FIRST LINK TO ACTIVE
				$('#fluid-fader-frames div:nth-child(1)').show();
				$('#fluid-fader-direction-left').show();
				$('#fluid-fader-direction-right').show();
				$('#fluid-fader-links').show();
				$('#fluid-fader-links a:nth-child(1)').addClass('current');
				
				timeout = window.setTimeout("$(this).fluidfader('animation_action', {current_frame:1, next_frame:2});", interval);
				
			} else $.error('fluidfader.js says: "Only one or less frames, so no fading animation."');
		},
		animation_action : function(options){
			
			// VALIDATE PASSED INCREMENTS
			if ( parseInt(options.current_frame) == 'NaN' || options.next_frame == 'NaN' || options.current_frame > frame_count || options.next_frame > frame_count || options.current_frame < 1 || options.next_frame < 1 ) {
	
				$.error('fluidfader.js says: "There is a problem with the animation, please check the mark-up of your frames."');
			} else if ( allow_animation === true ) {
				
				// DON'T ALLOW ANY ANIMATIONS WHILE THERE IS A CURRENT ANIMATION
				allow_animation = false;
	
				// CLEAR ALL CURRENT TIMEOUTS
				clearTimeout(timeout);
		
				// ADD/REMOVE CLASSES FROM LINKS
				$('#fluid-fader-links a:nth-child(' + options.current_frame + ')').removeClass('current');
				$('#fluid-fader-links a:nth-child(' + options.next_frame + ')').addClass('current');
		
				// SORT OUT Z-INDEXS SO NEWER FADEIN IS ALWAYS ABOVE
				$('#fluid-fader-frames div:nth-child(' + options.current_frame + ')').css('z-index', 2000);
				$('#fluid-fader-frames div:nth-child(' + options.next_frame + ')').css('z-index', 2001);
				
				// CALL ANIMATION
				$(this).fluidfader('animation_type_' + animation_type, options);
			}
		},
		next_animation : function(options) {

			// CLEAR ALL CURRENT TIMEOUTS (AGAIN)
			clearTimeout(timeout);
			
			// UPDATE CURRENT FRAME AND SET NEXT FRAME VAR
			current_frame_var = options.next_frame;
		
			// INCREMENT CURRENT VAR FOR NEXT TIMEOUT
			if ( current_frame_var == frame_count ) {

				// RESET INCREMENT
				next_frame_var = 1;
			} else {

				next_frame_var = current_frame_var + 1;
			}

			// SET INTERVAL TO FADE IMAGES ONLY AFTER FADE IN HAS OCCURED
			timeout = window.setTimeout("$(this).fluidfader('animation_action', {current_frame:" + current_frame_var + ", next_frame:" + next_frame_var + "});", interval);
			
			// ALLOW ANIMATIONS
			allow_animation = true;
		},
		animation_type_fade : function(options) {

			// FADE IN NEW IMAGE
			$('#fluid-fader-frames div:nth-child(' + options.next_frame + ')').fadeIn(speed, function(){
	
				// FADE OUT CURRENT FRAME
				$('#fluid-fader-frames div:nth-child(' + options.current_frame + ')').fadeOut(speed/2, function(){
					
					$(this).fluidfader('next_animation', options);
				});

			});
			
		},
		animation_type_flash : function(options) {
			
			// FADE IN NEW IMAGE
			$('#fluid-fader-frames div:nth-child(' + options.current_frame + ')').hide(0, function(){
	
				// FADE OUT CURRENT FRAME
				$('#fluid-fader-frames div:nth-child(' + options.next_frame + ')').fadeIn(speed, function(){
					
					$(this).fluidfader('next_animation', options);
				});

			});
		}
	};

	$.fn.fluidfader = function( method ) {

		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' + method + ' does not exist on fluidfader' );
		}	 

	};

})(jQuery);