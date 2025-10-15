// js/main.js - 全局滚动总控制器，实现PPT翻页式滚动
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.page-section');
    let currentSectionIndex = 0;
    let isScrolling = false;

    // 设置活动页面
    function setActiveSection(index) {
        if (index < 0 || index >= sections.length) return;

        sections.forEach((section, i) => {
            section.classList.remove('is-active', 'is-prev');
            if (i === index) {
                section.classList.add('is-active');
            } else if (i < index) {
                section.classList.add('is-prev');
            }
        });
        currentSectionIndex = index;
        
        // 调用当前活动页面的可见性方法
        const currentSection = sections[index];
        if (currentSection) {
            // 根据页面ID调用对应的控制器
            const sectionId = currentSection.id;
            if (sectionId === 'page7-container' && window.Page7Controller && typeof window.Page7Controller.onPageVisible === 'function') {
                window.Page7Controller.onPageVisible();
            }
            // 可以继续添加其他页面的控制器调用
        }
    }

    // 处理滚轮事件 - 全局滚动控制
    window.addEventListener('wheel', (event) => {
        if (isScrolling) return;
        isScrolling = true;

        const direction = event.deltaY > 0 ? 'down' : 'up';
        
        // 特殊处理 Page1 - 如果page1内部处理了滚动，就直接返回
        if (sections[currentSectionIndex].id === 'page1-container') {
            // 检查page1是否已经初始化并提供了接口
            if (window.IntroSequence && typeof window.IntroSequence.handleScroll === 'function') {
                const isHandledByPage1 = window.IntroSequence.handleScroll(direction);
                if (isHandledByPage1) {
                    // page1处理了滚动，等待动画完成后解锁
                    setTimeout(() => { isScrolling = false; }, 800);
                    return;
                }
            }
        }

        // 新增：特殊处理 Page2 - 如果page2内部处理了滚动，就直接返回
        if (sections[currentSectionIndex].id === 'page2-container') {
            // 检查page2是否已经初始化并提供了接口
            if (window.Page2 && typeof window.Page2.handleScroll === 'function') {
                const isHandledByPage2 = window.Page2.handleScroll(direction);
                if (isHandledByPage2) {
                    // page2处理了滚动，等待动画完成后解锁
                    setTimeout(() => { isScrolling = false; }, 800);
                    return;
                }
            }
        }

        // 新增：特殊处理 Page4 - 如果page4内部处理了滚动，就直接返回
        if (sections[currentSectionIndex].id === 'page4-container') {
            // 检查page4是否已经初始化并提供了接口
            if (window.Page4 && typeof window.Page4.handleScroll === 'function') {
                const isHandledByPage4 = window.Page4.handleScroll(direction);
                if (isHandledByPage4) {
                    // page4处理了滚动，等待动画完成后解锁
                    setTimeout(() => { isScrolling = false; }, 800);
                    return;
                }
            }
        }

        // 全局页面切换逻辑
        if (direction === 'down') {
            if (currentSectionIndex < sections.length - 1) {
                setActiveSection(currentSectionIndex + 1);
            }
        } else {
            if (currentSectionIndex > 0) {
                setActiveSection(currentSectionIndex - 1);
            }
        }

        // 等待页面切换动画完成后解锁
        setTimeout(() => { isScrolling = false; }, 1200);
    }, { passive: false }); // passive: false 确保能阻止默认行为

    // 键盘支持
    document.addEventListener('keydown', (event) => {
        if (isScrolling) return;
        
        switch (event.key) {
            case 'ArrowDown':
            case 'PageDown':
            case ' ':
                event.preventDefault();
                if (currentSectionIndex < sections.length - 1) {
                    isScrolling = true;
                    setActiveSection(currentSectionIndex + 1);
                    setTimeout(() => { isScrolling = false; }, 1200);
                }
                break;
                
            case 'ArrowUp':
            case 'PageUp':
                event.preventDefault();
                if (currentSectionIndex > 0) {
                    isScrolling = true;
                    setActiveSection(currentSectionIndex - 1);
                    setTimeout(() => { isScrolling = false; }, 1200);
                }
                break;
                
            case 'Home':
                event.preventDefault();
                if (currentSectionIndex !== 0) {
                    isScrolling = true;
                    setActiveSection(0);
                    setTimeout(() => { isScrolling = false; }, 1200);
                }
                break;
                
            case 'End':
                event.preventDefault();
                if (currentSectionIndex !== sections.length - 1) {
                    isScrolling = true;
                    setActiveSection(sections.length - 1);
                    setTimeout(() => { isScrolling = false; }, 1200);
                }
                break;
        }
    });

    // 触摸设备支持
    let startY = 0;
    let startTime = 0;
    
    document.addEventListener('touchstart', (event) => {
        startY = event.touches[0].clientY;
        startTime = Date.now();
    });
    
    document.addEventListener('touchend', (event) => {
        if (isScrolling) return;
        
        const endY = event.changedTouches[0].clientY;
        const diffY = startY - endY;
        const duration = Date.now() - startTime;
        
        // 判断是否为有效的垂直滑动
        if (Math.abs(diffY) > 50 && duration < 500) {
            if (diffY > 0) {
                // 向上滑动 - 下一页
                if (currentSectionIndex < sections.length - 1) {
                    isScrolling = true;
                    setActiveSection(currentSectionIndex + 1);
                    setTimeout(() => { isScrolling = false; }, 1200);
                }
            } else {
                // 向下滑动 - 上一页
                if (currentSectionIndex > 0) {
                    isScrolling = true;
                    setActiveSection(currentSectionIndex - 1);
                    setTimeout(() => { isScrolling = false; }, 1200);
                }
            }
        }
    });

    // 初始化第一个页面
    setActiveSection(0);
    
    console.log('PPT翻页式滚动控制器初始化完成，共', sections.length, '个页面');
}); 