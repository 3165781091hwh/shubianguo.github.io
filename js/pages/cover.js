// js/pages/pageCover.js - Cover Page Scripts (V5.0 标准)

(function() {
    document.addEventListener('DOMContentLoaded', function() {
        // 1. 获取自己的"房子"
        const pageContainer = document.getElementById('pageCover-container');
        
        // 2. 如果"房子"不存在，立即停止执行，避免在其他页面报错
        if (!pageContainer) {
            return;
        }

        // 3. Cover页面特有的初始化逻辑
        // 注意：本地图片通常加载很快，不需要特殊的预加载处理
        console.log('Cover页面初始化完成');

        // 4. 如果需要页面激活时才执行动画，使用 MutationObserver
        const observer = new MutationObserver((mutations) => {
            if (pageContainer.classList.contains('is-active')) {
                // 页面被 main.js 激活了，可以在这里播放入场动画
                console.log('Cover页面已激活');
                observer.disconnect(); // 播放一次后停止观察，以节省性能
            }
        });
        observer.observe(pageContainer, { attributes: true, attributeFilter: ['class'] });
    });
})();