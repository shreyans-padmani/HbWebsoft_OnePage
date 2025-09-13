(function($) {
    const wdtPopupBoxGlobalHandler = function($scope) {
        const instance = new wdtPopupBoxGlobalHandlerInit($scope);
        instance.init();
    };
    const wdtPopupBoxGlobalHandlerInit = function($scope) {
        const $self = this;
        let settings = $scope.data('settings');
        if (typeof settings === 'string') {
            try {
                settings = JSON.parse(settings);
            } catch (e) {
                settings = {};
            }
        }
        const $settings = settings || {};

        const $module_ref_id = $settings.module_ref_id || ('site_popup_' + Math.floor(Math.random() * 10000));
        const $popup_class = $settings.popup_class || '';
        const $trigger_type = $settings.trigger_type || 'on-load';
        const $on_load_delay = Number($settings.on_load_delay?.size) || 100;
        const $on_load_after = Number($settings.on_load_after?.size) || 1;
        const $show_close_Button = Boolean($settings.show_close_Button);
        const $esc_to_exit = Boolean($settings.esc_to_exit);
        const $click_to_exit = Boolean($settings.click_to_exit);
        const $mfp_src = $settings.mfp_src || false;
        const $mfp_type = $settings.mfp_type || false;
        const $mfp_button_position = ($mfp_type === 'inline');

        $self.init = function() {
            if ($trigger_type === 'on-load') {
                $self.onLoadInit();
            } else if ($trigger_type === 'on-click') {
                $scope.find('.wdt-popup-trigger-button').on('click', function() {
                    $self.openPopup();
                });
            }
        };

        $self.onLoadInit = function() {
            if ($on_load_after === 0) {
                $.removeCookie($module_ref_id, {
                    path: "/"
                });
            }

            if (!$.cookie($module_ref_id)) {
                setTimeout(function() {
                    $self.openPopup();

                    if ($on_load_after > 0) {
                        $.cookie($module_ref_id, true, {
                            expires: $on_load_after,
                            path: "/"
                        });
                    } else {
                        $.removeCookie($module_ref_id, {
                            path: "/"
                        });
                    }
                }, $on_load_delay);
            }
        };

        $self.openPopup = function() {
            $.magnificPopup.open({
                items: {
                    src: $mfp_src,
                    type: $mfp_type
                },
                removalDelay: 500,
                showCloseBtn: $show_close_Button,
                enableEscapeKey: $esc_to_exit,
                closeOnBgClick: $click_to_exit,
                mainClass: $popup_class,
                closeBtnInside: $mfp_button_position
            });
        };
    };
    $(document).ready(function() {
        $('.wdt-popup-box-trigger-holder').each(function() {
            wdtPopupBoxGlobalHandler($(this));
        });
    });
})(jQuery);