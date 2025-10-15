// js/pages/page2.js - 滚动控制的动画逻辑
(function() {
    'use strict';

    const container = document.getElementById('page2-container');
    if (!container) return;

    const panels = container.querySelectorAll('.info-panel');
    const totalSteps = panels.length;
    let currentStep = 0; // 0 表示所有都未显示
    let isPageActive = false; // 标记页面是否为当前活动页

    // 更新场景显示
    function updateScene() {
        panels.forEach(panel => {
            const step = parseInt(panel.dataset.step, 10);
            if (step === currentStep) {
                panel.classList.add('is-visible');
            } else {
                panel.classList.remove('is-visible');
            }
        });
    }
    
    // 重置所有场景
    function resetScene() {
        currentStep = 0;
        updateScene();
    }

    // 核心：处理滚动事件，与 main.js 协作
    function handleScroll(direction) {
        if (!isPageActive) return false; // 如果页面不是活动的，不处理滚动

        if (direction === 'down') {
            if (currentStep < totalSteps) {
                currentStep++;
                updateScene();
                return true; // 告诉 main.js：我处理了这次滚动，别切换页面
            } else {
                // 已经是最后一步，让 main.js 切换到下一页
                return false; 
            }
        } else { // direction === 'up'
            if (currentStep > 1) {
                currentStep--;
                updateScene();
                return true; // 我处理了
            } else {
                // 已经是第一步或未开始，让 main.js 切换到上一页
                return false;
            }
        }
    }
    
    // 监听页面激活状态
    function checkActivity() {
        if (container.classList.contains('is-active')) {
            if (!isPageActive) {
                // 页面首次变为激活状态
                isPageActive = true;
                currentStep = 1; // 默认显示第一步
                updateScene();
            }
        } else {
            if (isPageActive) {
                // 页面从激活状态离开
                isPageActive = false;
                resetScene(); // 重置动画
            }
        }
    }

    // 使用 MutationObserver 监视 class 变化来判断页面是否激活
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.attributeName === 'class') {
                checkActivity();
            }
        });
    });

    observer.observe(container, { attributes: true });
    
    // 初始化时检查一次
    checkActivity();

    console.log('Page 2 (集采是什么) 滚动控制器初始化完成');

    // 暴露公共接口给 main.js
    window.Page2 = {
        handleScroll: handleScroll
    };

})(); 