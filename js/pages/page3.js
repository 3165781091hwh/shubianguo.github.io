// js/pages/page3.js - 页面3基本脚本
(function() {
    'use strict';

    const container = document.getElementById('page3-container');
    if (!container) return;

    // 页面可见性检测
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px'
    });

    observer.observe(container);

    console.log('Page 3 (集采效果) 初始化完成');

})(); 