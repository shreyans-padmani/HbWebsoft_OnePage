 
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.wdt-sidebartoogle-wrapper .widget').forEach(function (widget) {
    const toggleGroup = widget.querySelector('.widget-toggle-group');
    const toggleBtn = toggleGroup?.querySelector('.widget-toggle');

    if (!toggleGroup || !toggleBtn) return;

    let baseLabel = 'Toggle';

    const heading = widget.querySelector('.widgettitle');
    if (heading) {
      baseLabel = heading.textContent.trim();
      heading.remove();
    } else {
      const formLabel = widget.querySelector('form label');
      if (formLabel) {
        baseLabel = formLabel.textContent.trim();
        formLabel.remove();
      }
    }

    toggleBtn.setAttribute('data-label', baseLabel);
    toggleBtn.textContent = baseLabel; 
    const content = [...widget.children].filter(el => el !== toggleGroup);
    const initiallyExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';

    if (!initiallyExpanded) {
      content.forEach(el => el.classList.add('hidden'));
    }

    function toggleWidget() {
      const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      toggleBtn.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
      toggleGroup.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');

      content.forEach(el => el.classList.toggle('hidden'));

      const icon = toggleGroup.querySelector('.wdt-dropdown-arrow');
      if (icon) {
        icon.classList.toggle('rotate-icon');
      }
    } 
    toggleGroup.addEventListener('click', function () {
      toggleWidget();
    });
  });
}); 
