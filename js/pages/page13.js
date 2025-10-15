/* =================================================================== */
/*                            PAGE13 脚本                              */
/* =================================================================== */

// 页面13 - 推动产业升级
(function() {
    'use strict';

    // 等待DOM加载完成
    document.addEventListener('DOMContentLoaded', function() {
        initializePage13();
    });

    // 页面初始化函数
    function initializePage13() {
        console.log('Page 13 initialized');
        
        // 获取页面元素
        const sidebarItems = document.querySelectorAll('#page13-container .sidebar-item');
        
        // 为侧边栏项目添加点击事件
        sidebarItems.forEach(item => {
            item.addEventListener('click', function() {
                // 移除所有active类
                sidebarItems.forEach(i => i.classList.remove('active'));
                // 为当前点击的项目添加active类
                this.classList.add('active');
            });
        });

        // 页面进入动画完成后的回调
        setTimeout(() => {
            console.log('Page 13 animations completed');
        }, 1200);
    }

    // 暴露给全局的接口（如果需要）
    window.Page13 = {
        initialize: initializePage13
    };

})(); 