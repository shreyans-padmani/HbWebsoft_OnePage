(function ($) {

    const wdtHeadingWidgetHandler = function($scope, $) {

        const $heading_holder = $scope.find('.wdt-heading-holder');
        const $heading_title  = $heading_holder.find('.wdt-heading-title');
        const $heading_each_span = $heading_title.find('.wdt-split-heading-title');


        let delay = 0.55;
        const increment = 0.05; 

        $.each($heading_each_span, function() {
            const $this_element = $(this);
            $this_element.css({ "--transition-delay": delay.toFixed(2) + 's' });
            delay += increment;
        });


    };

    $(window).on('elementor/frontend/init', function () {
		elementorFrontend.hooks.addAction('frontend/element_ready/wdt-heading.default', wdtHeadingWidgetHandler);
    });

})(jQuery);