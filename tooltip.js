/********************************************/
/* Tooltip plugin - by Edward Tam, 31st July, 2014
 *
 * Requires: jQuery 1.7+
 *
 * How to use:
 *
 * 1. In your html file, include all the necessary requirements:
 *
 *			 <script type="text/javascript" src="/path/to/jquery.js"></script>
 *			<script type="text/javascript" src="/path/to/tooltip.js"></script>
 *			<link rel="stylesheet" href="/path/to/tooltip.css" />
 *
 * 2. In the body of your html, create a 'div' for the tooltip:
 *
 *			<div id="tooltip">Hello World</div>
 *			<div id="content">
 *			  <span>Content goes here</span>
 *			</div>
 *
 * 3. Call the tooltip in TooltipJS. You need to parse in 2 manditory parameters:
 *			- el: the selector of the element for your tooltip
 *			- target: the target element that you want to show the tooltip when hovering
 *
 *			Example:
 *
 *			this.tooltip = new Tooltip({
 *			  el     : 'div#tooltip',
 *			  target : 'div#content'
 *			});
 *
 *			
 * Feel free to extend the widget by doing the follow:
 *
 *			 AdvanceTooltip.prototype = new Tooltip();
 *
 * To overwrite a function in Tooltip, just replace it in the constructor:
 * 
 *			function AdvanceTooltip (option){
 *			  this.render = function (){
 *			    if (this.isHover) {
 *			      this.show();
 *			    else 
 *			      this.hide();
 *			  };
 *			  this.render();
 *			}
 * 
 *
/********************************************/
function Tooltip(options){
        this.parseOptions(options);
}

Tooltip.prototype.$ = jQuery;
/************************************************************************/
/* Variable    : hoverDuration (int);
/* Description : Indicates the time mouse stays on the element before
/*               tooltip shows.
/************************************************************************/
Tooltip.prototype.hoverDuration = 400;

/************************************************************************/
/* Variable    : isHover (boolen);
/* Description : Indicates if the mouse is hovering the targeted element
/************************************************************************/
Tooltip.prototype.isHover = false;

/************************************************************************/
/* Variable    : position (string);
/* Description : Indicate the position of the tooltip relative to the target
/************************************************************************/
Tooltip.prototype.position = 'top';

/************************************************************************/
/* Function    : parseOptions()
/* Parameters  : options - {}
/* Description : Set object properties by literating through the options 
/************************************************************************/
Tooltip.prototype.parseOptions = function(options){
        for (key in options){
                if (key == 'el') {
                        this.$el = this.$(options[key]);
												this.$el.addClass('tooltip').hide();
                }
                if (key == 'target') {
                        this.setTargetEl(this.$(options[key]));
                }
        }
        return this;
};

/************************************************************************/
/* Function    : render()
/* Parameters  : none
/* Description : Render content to the tooltip. Please Overwrite this if needed.
/************************************************************************/
Tooltip.prototype.render = function (){
        if (this.isHover) 
                this.show();
        else
                this.hide();
};

/************************************************************************/
/* Function    : setPosition()
/* Parameters  : position - string of either 'top', 'bottom', 'right', or 'left'
/* Description : set the position of the tooltip relative to the target
/************************************************************************/
Tooltip.prototype.setPosition = function(position){
        this.position = position;
        return this;
};

/************************************************************************/
/* Function    : setTargetEl()
/* Parameters  : el - jQuery selector
/* Description : Set target element
/************************************************************************/
Tooltip.prototype.setTargetEl = function(el){
        var self = this;
        this.$target = this.$(el);
        this.$target.on('mouseenter mouseleave', function (){
                self.isHover = !self.isHover;
                self.render();
        });
        return this;
};

/***************************************************************************/
/* Function    : show()
/*
/* Parameters  : hover_target - jQuery object $(): the target element.
/*               position - 'top', 'left', 'bottom' or 'right': indicates the 
/*                          position relative to the target element.
/*
/* Description : show the tooltip, calculate position relative to hover_target
/***************************************************************************/
Tooltip.prototype.show = function (){
        var self = this;

        if (this.$el.find('.tooltip-pointer').length == 0){
                this.$('<div/>').addClass('tooltip-pointer').appendTo(this.$el);
        }

        clearTimeout(this.tooltip_timer);
        this.tooltip_timer = setTimeout(function (){
                if (self.isHover){
                        var offset = self.$target.offset();

                        /********** Default Position: top ***************/
                        var tooltip_offset = {
                                top  : offset.top - self.$el.height() - 30, 
                                left : offset.left + (self.$target.width() - self.$el.width())/2,
                        };
                        self.$el.find('.tooltip-pointer').removeClass('left right bottom').addClass('top');

                        if (self.position == 'left'){
                                tooltip_offset = {
                                        top: offset.top,
                                        left: offset.left - self.$el.width() - 10
                                };
                                self.$el.find('.tooltip-pointer').removeClass('top right bottom').addClass('left');
                        }
        
                        if (self.position == 'right') {
                                tooltip_offset = {
                                        top: offset.top,
                                        left: offset.left + self.$target.width() + 10
                                };
                                self.$el.find('.tooltip-pointer').removeClass('top left bottom').addClass('right');
                        }

                        if (self.position == 'bottom') {
                                tooltip_offset.top += self.$target.height() + self.$el.height() + 50 
                                self.$el.find('.tooltip-pointer').removeClass('top left right').addClass('bottom');
                        }

                        self.$el.fadeIn(250).offset(tooltip_offset).toggleClass('opened');        
                }
        }, this.hoverDuration);

        return this;
};

/*****************************************************************************/
/* Function    : hide()
/* Parameters  : none
/* Description : hide the tooltip
/*****************************************************************************/
Tooltip.prototype.hide = function (){
        clearTimeout(this.tooltip_timer);
        this.$el.fadeOut(250).removeClass('opened');
        return this;
}


