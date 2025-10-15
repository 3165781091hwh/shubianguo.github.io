(function() {
  document.addEventListener('DOMContentLoaded', function() {
    const page18Container = document.getElementById('page18-container');
    if (!page18Container) return;

    function initializeSidebar() {
      const sidebarItems = page18Container.querySelectorAll('.sidebar-item');
      if (sidebarItems.length === 0) return;

      sidebarItems.forEach((item, index) => {
        item.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          try {
            sidebarItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            this.style.transform = 'scale(0.95)';
            setTimeout(() => { this.style.transform = ''; }, 150);
            const customEvent = new CustomEvent('sidebarItemChanged', {
              detail: { index: index, text: (this.textContent || '').trim() }
            });
            page18Container.dispatchEvent(customEvent);
          } catch (error) {
            // 侧边栏点击处理错误
          }
        });

        item.setAttribute('tabindex', '0');
        item.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
          }
        });
      });
    }

    function initializeChart() {
      const chartWrapper = page18Container.querySelector('#chart-22-wrapper');
      const chartBars = page18Container.querySelectorAll('#chart-22-wrapper .bar');
      if (!chartWrapper || chartBars.length === 0) return;

      chartBars.forEach((bar, index) => {
        try {
          bar.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#E07A5F';
            this.style.transition = 'background-color 0.3s ease';
            const tooltip = this.querySelector('.bar-value');
            if (tooltip) {
              tooltip.style.fontWeight = 'bold';
              tooltip.style.color = '#E07A5F';
            }
          });

          bar.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '#3D405B';
            const tooltip = this.querySelector('.bar-value');
            if (tooltip) {
              tooltip.style.fontWeight = '';
              tooltip.style.color = '';
            }
          });

          bar.addEventListener('click', function(e) {
            e.stopPropagation();
            try {
              const value = this.querySelector('.bar-value');
              const groupLabel = this.closest('.bar-group')?.querySelector('.group-label');
              if (value && groupLabel) {
                this.style.transform = 'scale(1.05)';
                setTimeout(() => { this.style.transform = ''; }, 200);
                const customEvent = new CustomEvent('chartBarClicked', {
                  detail: {
                    index: index,
                    value: (value.textContent || '').trim(),
                    label: (groupLabel.textContent || '').trim()
                  }
                });
                page18Container.dispatchEvent(customEvent);
              }
            } catch (error) {
              // 柱状图点击处理错误
            }
          });

          bar.setAttribute('tabindex', '0');
          bar.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              this.click();
            }
          });
        } catch (error) {
          // 初始化柱状图错误
        }
      });

      // 移除对滚轮事件的阻止，避免在图表区域内滚动时拦截全局翻页
    }

    function ensurePageVisibility() {
      // 遵循全局翻页系统：不再强制写入内联可见性样式，交由 .page-section 的类控制
      // 仅作为激活时的占位钩子，避免与全局动画冲突
      return;
    }

    function validatePageData() {
      try {
        const sidebarItems = page18Container.querySelectorAll('.sidebar-item');
        const chartBars = page18Container.querySelectorAll('.bar');
        const panels = page18Container.querySelectorAll('.panel');
        const chartWrapper = page18Container.querySelector('#chart-22-wrapper');

        chartBars.forEach((bar) => {
          const value = bar.querySelector('.bar-value');
          const group = bar.closest('.bar-group');
          const label = group?.querySelector('.group-label');
          if (!value || !label) {
            // 图表柱状图缺少值或标签
          } else {
            bar.style.display = 'block';
            value.style.display = 'block';
            label.style.display = 'block';
          }
        });

        const computedStyle = window.getComputedStyle(page18Container);
        const backgroundImage = computedStyle.backgroundImage;
        if (backgroundImage && backgroundImage !== 'none') {
          // 背景图片已加载
        } else {
          // 背景图片未正确加载
        }
        return true;
      } catch (error) {
        return false;
      }
    }

    // 初始化
    initializeSidebar();
    initializeChart();
    validatePageData();

    // 使用 MutationObserver 监听页面激活（类名变化）
    const observer = new MutationObserver(() => {
      if (page18Container.classList.contains('is-active')) {
        ensurePageVisibility();
      }
    });
    observer.observe(page18Container, { attributes: true, attributeFilter: ['class'] });

    // 将自定义事件监听限定在容器上
    page18Container.addEventListener('sidebarItemChanged', function(e) {
      // 侧边栏项目改变事件（容器作用域）
    });
    page18Container.addEventListener('chartBarClicked', function(e) {
      // 图表柱状图点击事件（容器作用域）
    });

    // 移除全局 pageChanged 监听，改用容器类变化；如果外部仍派发，可在容器作用域内转发
    // 保留窗口大小监听，但限定操作于当前容器
    window.addEventListener('resize', function() {
      clearTimeout(window.resizeTimeout);
      window.resizeTimeout = setTimeout(function() {
        if (page18Container && page18Container.style.display !== 'none') {
          ensurePageVisibility();
        }
      }, 250);
    });

    // 页面性能标记
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark('page18-script-loaded');
    }
  });
})();