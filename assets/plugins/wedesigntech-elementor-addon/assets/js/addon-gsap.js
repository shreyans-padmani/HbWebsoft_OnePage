//////////////////////////////////////////////////////////////////////////////
//  Wedesigntech Elementor Addon GSAP Animation

// 1. Smooth Scroller
// 2. Elementor E-Con Sticky
// 3. Same page Hash Link Smooth Scroll
// 4. Heading Animation

////////////////////////////////////////////////////////////////////////////

gsap.config({ nullTargetWarn: false });

// 1. Smooth Scroller

window.addEventListener("DOMContentLoaded", () => {

    if (typeof gsap !== "undefined" && typeof ScrollSmoother !== "undefined") {
        gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

        const smoother = ScrollSmoother.create({
            wrapper: "#smooth-wrapper", 
            content: "#smooth-content",
            smooth: 1.1, // Smoothness of the scroll
            effects: true,
            smoothTouch: 0.1,
        });

    } else {
        console.warn(":warning: GSAP or ScrollSmoother not loaded properly");
    }
});


// 2. Elementor E-Con Sticky

if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    let stickyTriggers = [];

    async function waitForSiteLoaded() {
        if (document.readyState !== "complete") {
            await new Promise(resolve => window.addEventListener("load", resolve, { once: true }));
        }
    }

    const initStickyColumns = () => {
        stickyTriggers.forEach(trigger => trigger.kill());
        stickyTriggers = [];

        document.querySelectorAll('.wdt-sticky-css').forEach(col => {

            const wdtStick = () => {
                setTimeout(() => {
                    const wrapperEle = col.parentElement;

                    if (!wrapperEle) return;

                    const trigger = ScrollTrigger.create({
                        trigger: wrapperEle,
                        start: "top top",
                        end: "bottom top+=" + col.clientHeight,
                        pin: col,
                        pinSpacing: false,
                        lazy: true,
                        markers: false,
                        id: Math.random().toString(36).substring(2, 15),
                        onEnter: () => { 
                            col.classList.add('wdt-sticky-active');
                        },
                        onLeave: () => { 
                            col.classList.remove('wdt-sticky-active');
                        },
                    });

                    stickyTriggers.push(trigger);
                }, 1000);
            };

            let deviceMode = elementorFrontend.getCurrentDeviceMode();
            let wdtColumnSetting = JSON.parse(col.dataset.wdtSettings);
            let wdtColumnSet = wdtColumnSetting.stickyOn;
            
            if (deviceMode === 'mobile' && wdtColumnSet.includes('mobile')) { wdtStick(); 
            } else if (deviceMode === 'mobile_extra' && wdtColumnSet.includes('mobile_extra')) { wdtStick();
            } else if (deviceMode === 'tablet' && wdtColumnSet.includes('tablet')) { wdtStick();    
            } else if (deviceMode === 'tablet_extra' && wdtColumnSet.includes('tablet_extra')) { wdtStick();
            } else if (deviceMode === 'laptop' && wdtColumnSet.includes('laptop')) { wdtStick();
            } else if (deviceMode === 'desktop' && wdtColumnSet.includes('desktop')) { wdtStick();
            } else return; 


        });

        ScrollTrigger.refresh();
    };

    jQuery(window).on('elementor/frontend/init', () => {
        waitForSiteLoaded().then(() => {
            initStickyColumns();
            window.addEventListener("resize", () => {
                initStickyColumns();
            });
        });
    });
}

// 3. Same page Hash Link Smooth Scroll

if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    document.addEventListener("DOMContentLoaded", function () {
        
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener("click", function (e) {
                e.preventDefault(); 

                const targetID = this.getAttribute("href");
                const targetEl = document.querySelector(targetID);

                if (targetEl) {
                    gsap.to(window, {
                        duration: 1,
                        scrollTo: targetEl,
                        ease: "power2.out",
                        lazy: true,
                    });
                }
            });
        });

        document.querySelectorAll('a[href="#top"]').forEach(link => {
            link.addEventListener("click", function (e) {
                e.preventDefault(); 

                gsap.to(window, {
                    duration: 1,
                    scrollTo: 0,
                    ease: "power2.out",
                    lazy: true,
                });
            });
        });
  })

}