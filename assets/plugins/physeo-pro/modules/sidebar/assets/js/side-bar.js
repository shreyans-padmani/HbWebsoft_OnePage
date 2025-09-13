(function ($) {
    "use strict";

    $(document).ready(function () {

        const _windWidth = window.innerWidth;

        if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined" && _windWidth > 1024) {
            gsap.registerPlugin(ScrollTrigger);

            let stickyTriggers = [];

            async function waitForSiteLoaded() {
                if (document.readyState !== "complete") {
                    await new Promise(resolve => window.addEventListener("load", resolve, { once: true }));
                }
            }

            const initStickySidebarShop = () => {
                stickyTriggers.forEach(trigger => trigger.kill());
                stickyTriggers = [];

                document.querySelectorAll('.secondary-sidebar').forEach(col => {
                    const primaryCol = col.previousElementSibling;
                    if (!primaryCol) return;

                    let totalPrimaryHeight = 0;
                    primaryCol.querySelectorAll(':scope > *').forEach(el => {
                        totalPrimaryHeight += el.offsetHeight;
                    });

                    col.style.height = `${Math.max(col.clientHeight, totalPrimaryHeight)}px`;

                    setTimeout(() => {
                        const wrapperEle = col;
                        if (!wrapperEle) return;

                        const trigger = ScrollTrigger.create({
                            trigger: wrapperEle,
                            start: "top top",
                            end: "bottom top+=" + col.children[0].clientHeight,
                            pin: col.children[0],
                            pinSpacing: false,
                            lazy: true,
                            markers: false,
                            id: Math.random().toString(36).substring(2, 15),
                        });

                        stickyTriggers.push(trigger);
                    }, 1000);
                });

                ScrollTrigger.refresh();
            };

            const initStickySidebarDefault = () => {
                stickyTriggers.forEach(trigger => trigger.kill());
                stickyTriggers = [];

                document.querySelectorAll('.secondary-sidebar').forEach(col => {
                    const colHeight = col.clientHeight;
                    const colSiblingHeight = col.previousElementSibling.children[0].clientHeight;
                    col.style.height = `${Math.max(colHeight, colSiblingHeight)}px`;

                    setTimeout(() => {
                        const wrapperEle = col;
                        if (!wrapperEle) return;

                        const trigger = ScrollTrigger.create({
                            trigger: wrapperEle,
                            start: "top top",
                            end: "bottom top+=" + col.children[0].clientHeight,
                            pin: col.children[0],
                            pinSpacing: false,
                            lazy: true,
                            markers: false,
                            id: Math.random().toString(36).substring(2, 15),
                        });

                        stickyTriggers.push(trigger);
                    }, 1000);
                });

                ScrollTrigger.refresh();
            };

            jQuery(window).on('load', () => {
                waitForSiteLoaded().then(() => {
                    if (
                        document.body.classList.contains('post-type-archive-product') ||
                        document.body.classList.contains('tax-product_cat')
                    ) {
                        initStickySidebarShop();
                    } else {
                        initStickySidebarDefault();
                    }
                });
            });

            window.addEventListener("resize", () => {
                if (
                    document.body.classList.contains('post-type-archive-product') ||
                    document.body.classList.contains('tax-product_cat')
                ) {
                    initStickySidebarShop();
                } else {
                    initStickySidebarDefault();
                }
            });

        } else if ($("#secondary").length) {
            $('.secondary-sidebar').theiaStickySidebar({
                additionalMarginTop: 90,
                containerSelector: $('#primary')
            });
        }

    });
})(jQuery);
