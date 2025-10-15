// 页面1脚本 - 与全局滚动控制器协作，实现横向切换
(function() {
    'use strict';
    
    // 获取必要的DOM元素
    const container = document.getElementById('page1-container');
    const slides = document.querySelectorAll('.intro-slide');
    const totalSlides = slides.length;
    
    // 检查必要元素是否存在
    if (!container || totalSlides === 0) {
        console.warn('页面1容器或幻灯片未找到');
        return;
    }
    
    // 状态变量
    let currentSlideIndex = 0;
    let isAnimating = false;
    
    // 初始化第一张幻灯片
    function initializeSlides() {
        slides[0].classList.add('is-active');
        slides[0].style.transform = 'translateX(0)';
        
        // 隐藏其他幻灯片
        for (let i = 1; i < totalSlides; i++) {
            slides[i].style.transform = 'translateX(100%)';
        }
    }
    
    // 切换到指定幻灯片
    function goToSlide(nextIndex, direction) {
        if (isAnimating) return;
        isAnimating = true;
        
        const currentSlide = slides[currentSlideIndex];
        const nextSlide = slides[nextIndex];
        
        // 设置退出动画
        const exitTransform = direction === 'next' ? 'translateX(-100%)' : 'translateX(100%)';
        const enterTransformStart = direction === 'next' ? 'translateX(100%)' : 'translateX(-100%)';
        
        // 准备下一张幻灯片
        nextSlide.style.transform = enterTransformStart;
        nextSlide.classList.add('is-active');
        
        // 当前幻灯片退出
        currentSlide.classList.add('is-exiting');
        currentSlide.style.transform = exitTransform;
        
        // 执行切换动画
        setTimeout(() => {
            nextSlide.style.transform = 'translateX(0)';
        }, 20);
        
        // 动画完成后清理
        setTimeout(() => {
            currentSlide.classList.remove('is-active', 'is-exiting');
            // 移除内联 transform 样式，让其回归到 CSS 定义的默认状态。
            // 这样无论从哪个方向来，都能正确重置。
            currentSlide.style.transform = ''; 
            
            // 更新索引
            currentSlideIndex = nextIndex;
            isAnimating = false;
        }, 1200);
    }
    
    // 核心方法：处理滚动事件，与全局控制器协作
    function handleScroll(direction) {
        if (isAnimating) return true; // 如果正在动画，告诉main.js已处理

        if (direction === 'down') {
            if (currentSlideIndex < totalSlides - 1) {
                goToSlide(currentSlideIndex + 1, 'next');
                return true; // 告诉 main.js：我处理了这次滚动，你别动
            } else {
                return false; // 告诉 main.js：我到头了，该你滚到下一页了
            }
        } else { // direction === 'up'
            if (currentSlideIndex > 0) {
                goToSlide(currentSlideIndex - 1, 'prev');
                return true; // 我处理了
            } else {
                return false; // 我到头了，该你滚到上一页了
            }
        }
    }
    
    // 视差效果 - 鼠标移动时词云动态响应
    function setupParallaxEffect() {
        container.addEventListener('mousemove', (event) => {
            if (isAnimating) return;
            
            const activeSlide = slides[currentSlideIndex];
            if (!activeSlide || !activeSlide.classList.contains('is-active')) return;
            
            const words = activeSlide.querySelectorAll('.word-cloud-container span');
            
            // 计算鼠标在视口中的相对位置 (-0.5 to 0.5)
            const x = (event.clientX / window.innerWidth) - 0.5;
            const y = (event.clientY / window.innerHeight) - 0.5;
            
            words.forEach(word => {
                // 根据data-depth属性计算移动幅度
                const depth = parseFloat(word.dataset.depth) || 0.5;
                const moveX = -x * 50 * depth; // 调整50这个系数可以改变移动幅度
                const moveY = -y * 50 * depth;
                
                // 应用视差移动，保持原有的入场动画transform
                const baseTransform = word.style.transform;
                word.style.transform = `${baseTransform} translate(${moveX}px, ${moveY}px)`;
            });
        });
        
        // 鼠标离开时重置视差效果
        container.addEventListener('mouseleave', () => {
            const activeSlide = slides[currentSlideIndex];
            if (!activeSlide) return;
            
            const words = activeSlide.querySelectorAll('.word-cloud-container span');
            words.forEach(word => {
                // 移除视差移动，保持原有的transform
                const baseTransform = word.style.transform;
                const cleanTransform = baseTransform.replace(/translate\([^)]+\)/g, '').trim();
                word.style.transform = cleanTransform || '';
            });
        });
    }
    
    // 触摸设备支持 - 滑动切换
    function setupTouchSupport() {
        let startX = 0;
        let startY = 0;
        let isSwiping = false;
        
        container.addEventListener('touchstart', (event) => {
            startX = event.touches[0].clientX;
            startY = event.touches[0].clientY;
            isSwiping = false;
        });
        
        container.addEventListener('touchmove', (event) => {
            if (isAnimating) return;
            
            const currentX = event.touches[0].clientX;
            const currentY = event.touches[0].clientY;
            const diffX = startX - currentX;
            const diffY = startY - currentY;
            
            // 判断是否为水平滑动
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                isSwiping = true;
                event.preventDefault(); // 阻止页面滚动
            }
        });
        
        container.addEventListener('touchend', (event) => {
            if (!isSwiping || isAnimating) return;
            
            const currentX = event.changedTouches[0].clientX;
            const diffX = startX - currentX;
            
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    // 向左滑动 - 下一张
                    if (currentSlideIndex < totalSlides - 1) {
                        goToSlide(currentSlideIndex + 1, 'next');
                    }
                } else {
                    // 向右滑动 - 上一张
                    if (currentSlideIndex > 0) {
                        goToSlide(currentSlideIndex - 1, 'prev');
                    }
                }
            }
            
            isSwiping = false;
        });
    }
    
    // 键盘支持 - 方向键切换
    function setupKeyboardSupport() {
        document.addEventListener('keydown', (event) => {
            if (isAnimating) return;
            
            switch (event.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    event.preventDefault();
                    if (currentSlideIndex < totalSlides - 1) {
                        goToSlide(currentSlideIndex + 1, 'next');
                    }
                    break;
                    
                case 'ArrowLeft':
                case 'ArrowUp':
                    event.preventDefault();
                    if (currentSlideIndex > 0) {
                        goToSlide(currentSlideIndex - 1, 'prev');
                    }
                    break;
            }
        });
    }
    
    // 初始化函数
    function init() {
        initializeSlides();
        setupParallaxEffect();
        setupTouchSupport();
        setupKeyboardSupport();
        
        console.log('介绍序列初始化完成，共', totalSlides, '张幻灯片');
    }
    
    // 启动初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // 暴露公共方法供main.js调用
    window.IntroSequence = {
        goToSlide: goToSlide,
        getCurrentSlide: () => currentSlideIndex + 1,
        getTotalSlides: () => totalSlides,
        handleScroll: handleScroll // 关键：提供给main.js调用的方法
    };
    
})(); 