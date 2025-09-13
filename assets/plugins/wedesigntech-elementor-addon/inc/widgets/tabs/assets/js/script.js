(function ($) {

  const wdtTabsWidgetHandler = function($scope) {
      const instance = new wdtTabsWidgetHandlerInit($scope);
      instance.init();
  };

  const wdtTabsWidgetHandlerInit = function($scope) {

    const $self = this;
    const $window = $(window);
    let $device = elementorFrontend.getCurrentDeviceMode();
    let $mobileToggleInitialized = false;
    let $activeItem;
    let $classes = $scope.find('.wdt-tabs-container:first').data('class-items').split(' ');
    let $tabInstance = false;
    let $scrollTabInstance = false;

    $self.init = function() {

      if($device === 'mobile' || $device === 'mobile_extra') {

        $scope.find('.wdt-tabs-container').addClass('wdt-tabs-toggle-mode');
        $.each($classes, function(key, value) {
          $scope.find('.wdt-tabs-container:first').removeClass(value);
        });

        if(!$mobileToggleInitialized) {
          $self.mobileToggleInit();
        }
        $mobileToggleInitialized = true;

      } else {

        $self.tabInit();

      }

      $window.on('resize', () => {

        $device = elementorFrontend.getCurrentDeviceMode();
        if($device === 'mobile' || $device === 'mobile_extra') {

          setTimeout(function () {

            $tabInstance = $scope.find('.wdt-tabs-container').tabs('instance');
            if(typeof $tabInstance !== 'undefined') {
              $scope.find('.wdt-tabs-container').tabs('refresh');
              $scope.find('.wdt-tabs-container').tabs('destroy');
            }

            $.each($classes, function(key, value) {
              $scope.find('.wdt-tabs-container:first').removeClass(value);
            });

            $scope.find('.wdt-tabs-container').addClass('wdt-tabs-toggle-mode');
            $scope.find('.wdt-tabs-list li').removeClass('wdt-active');
            $scope.find('.wdt-tabs-list li:first').addClass('wdt-active');
            $scope.find('.wdt-tabs-content').hide();
            $scope.find('.wdt-tabs-content:first').show();

            if(!$mobileToggleInitialized) {
              $self.mobileToggleInit();
            }
            $mobileToggleInitialized = true;

          }, 400);

        } else {

          setTimeout(function () {

            $.each($classes, function(key, value) {
              $scope.find('.wdt-tabs-container:first').addClass(value);
            });

            $scope.find('.wdt-tabs-container').removeClass('wdt-tabs-toggle-mode');
            $scope.find('.wdt-tabs-list').removeClass('wdt-expanded');
            $scope.find('.wdt-tabs-list li').removeClass('wdt-active');

            $self.tabInit();

          }, 400);

        }

      });

    };

    $self.tabInit = function($) {

        $scope.find('.wdt-tabs-container').tabs({
          show: { effect: 'fadeIn', duration: 400 },
          hide: { effect: 'fadeOut', duration: 100 },
        });
        $tabInstance = $scope.find('.wdt-tabs-container').tabs('instance');
    };


    $self.mobileToggleInit = function() {

      $scope.find('.wdt-tabs-list li:first').addClass('wdt-active');
      $scope.find('.wdt-tabs-content').fadeOut(100);
      $scope.find('.wdt-tabs-content:first').fadeIn(400);

      $scope.find('.wdt-tabs-list li').on('click', function (e) {
        e.preventDefault();
        if($(this).parents('.wdt-tabs-container').hasClass('wdt-tabs-toggle-mode')) {
          if(!$(this).hasClass('wdt-active')) {
            $(this).parents('.wdt-tabs-list').removeClass('wdt-expanded');
            $scope.find('.wdt-tabs-list li').removeClass('wdt-active');
            $(this).addClass('wdt-active');
            $scope.find('.wdt-tabs-content').fadeOut(100);
            const id = $(this).find('a').attr('href');
            $scope.find(id).fadeIn(400);
          } else {
            $(this).parents('.wdt-tabs-list').toggleClass('wdt-expanded');
          }
        }
      });

    };

  };

  $(window).on('elementor/frontend/init', function () {
		elementorFrontend.hooks.addAction('frontend/element_ready/wdt-tabs.default', wdtTabsWidgetHandler);
  });

})(jQuery);







