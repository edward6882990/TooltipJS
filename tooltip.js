/********************************************/
/* Tooltip plugin - by Edward Tam, 31st July, 2014
/********************************************/
function Tooltip(){}

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
        this.show(this.$target, this.position);
};

Tooltip.prototype.setPosition = function(position){
        this.position = position;
        return this;
};

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
/*                                                       position - 'top', 'left', 'bottom' or 'right': indicates the 
/*                                                                                                      position relative to the target element.
/*
/* Description : show the tooltip, calculate position relative to hover_target
/***************************************************************************/
Tooltip.prototype.show = function (hover_target, position){
        var self = this;

        clearTimeout(this.tooltip_timer);
        this.tooltip_timer = setTimeout(function (){
                if (self.isHover){
                        var offset = hover_target.offset();

                        /********** Default Position: top ***************/
                        var tooltip_offset = {
                                top  : offset.top - self.$el.height() - 30, 
                                left : offset.left + (hover_target.width() - self.$el.width())/2,
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
                                        left: offset.left + hover_target.width() + 10
                                };
                                self.$el.find('.tooltip-pointer').removeClass('top left bottom').addClass('right');
                        }

                        if (self.position == 'bottom') {
                                tooltip_offset.top += hover_target.height() + self.$el.height() + 50 
                                self.$el.find('.tooltip-pointer').removeClass('top left right').addClass('bottom');
                        }

                        self.$el.show('fade', 250).offset(tooltip_offset).toggleClass('opened');        
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
        this.$el.hide('fade', 250).removeClass('opened');
        return this;
}


