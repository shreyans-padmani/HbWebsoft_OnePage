(function ($) {
  const wdtHotspotWidgetHandler = function ($scope, $) {
    const $this_holder = $scope.find('.wdt-hotspot-holder');
    const $settings = $this_holder.data('settings');
    const $hotspot_items = $this_holder.find('.wdt-hotspot-repeater-item');
    const $deviceMode = elementorFrontend.getCurrentDeviceMode();

    $hotspot_items.each(function () {
      const $this_hotspot = $(this);
      const $this_hotspot_item = $this_hotspot[0];

      let $tooltipPlacement = $this_hotspot.data('tooltip-position');
      if ($tooltipPlacement === 'global' || $tooltipPlacement === '') {
        $tooltipPlacement = $settings['tooltipPlacement'];
      }

      let $tooltipContent = $this_hotspot.data('tooltip-content');
      let $tooltipImage = $this_hotspot.data('tooltip-image');
      $tooltipImage = $tooltipImage.concat($tooltipContent);

      if ($this_hotspot_item._tippy) {
        $this_hotspot_item._tippy.destroy();
      }

      const $tooltipTrigger = $settings.tooltipResponsive.tooltip_trigger[$deviceMode];

      const $options = {
        content: $tooltipImage,
        placement: $tooltipPlacement,
        trigger: $tooltipTrigger,
        arrow: $settings['tooltipArrow'],
        appendTo: document.body, // keep out of GSAP transformed wrapper
        allowHTML: true,
        interactive: true,
        hideOnClick: $tooltipTrigger !== 'manual',
        popperOptions: { strategy: 'absolute' },
        onShow(instance) {
          $this_hotspot.addClass('wdt-hotspot-item-active');
        
          requestAnimationFrame(() => {
            if (instance.popperInstance) {
              instance.popperInstance.update();
            }
          });
        },
        onHidden() {
          $this_hotspot.removeClass('wdt-hotspot-item-active');
        },
      };

      if ($tooltipTrigger !== 'manual') {
        $options.animation = $settings['tooltipAnimation'];
        $options.delay = $settings['tooltipDelay'];
      }

      tippy($this_hotspot_item, $options);

      if ($tooltipTrigger === 'manual' && $this_hotspot_item._tippy) {
        const tippyInstance = $this_hotspot_item._tippy;
        tippyInstance.show();

        const updateTooltip = () => {
          if (tippyInstance.popperInstance) {
            tippyInstance.popperInstance.update();
          }
          requestAnimationFrame(updateTooltip);
        };
        requestAnimationFrame(updateTooltip);
      }
    });
  };

  $(window).on('elementor/frontend/init', function () {
		elementorFrontend.hooks.addAction('frontend/element_ready/wdt-hotspot.default', wdtHotspotWidgetHandler);
  });

})(jQuery);
