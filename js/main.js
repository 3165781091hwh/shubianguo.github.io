// js/main.js - 全局滚动总控制器 (最终修复版)
document.addEventListener('DOMContentLoaded', () => {
    // 简化初始化逻辑，避免过度等待
    initializeScrollController();
});

function initializeScrollController() {
    const sections = document.querySelectorAll('.page-section');
    let currentSectionIndex = 0;
    let isScrolling = false;

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
    }
    
    // --- START: 新增的页面跳转测试工具逻辑 ---
    
    const jumperInput = document.getElementById('jumper-input');
    const jumperBtn = document.getElementById('jumper-btn');
    const totalPages = sections.length;

    function handleJump() {
        // 筛选出所有“真实”的页面（非封面、非过渡页）
        const realPageSections = Array.from(sections).filter((section, index) => {
            const isCover = index === 0; // 假设封面总是第一个
            const isTransition = section.id.startsWith('transition-');
            return !isCover && !isTransition;
        });

        const totalRealPages = realPageSections.length;
        const pageNum = parseInt(jumperInput.value, 10);

        // 1. 验证输入是否有效
        if (isNaN(pageNum)) {
            alert('请输入一个有效的页码！');
            jumperInput.value = '';
            return;
        }
        
        // 2. 验证页码是否在范围内 (用户输入 1, 2, 3...)
        if (pageNum < 1 || pageNum > totalRealPages) {
            alert(`页码超出范围！请输入 1 到 ${totalRealPages} 之间的数字。`);
            jumperInput.value = '';
            return;
        }

        // 3. 找到目标“真实”页面（用户输入 1-based，数组索引 0-based）
        const targetRealSection = realPageSections[pageNum - 1];
        
        // 4. 在原始 sections 列表中找到该页面的索引
        const targetIndex = Array.from(sections).indexOf(targetRealSection);

        if (targetIndex !== -1) {
            console.log(`接收到页码 ${pageNum}，跳转到实际页面索引: ${targetIndex}...`);
            setActiveSection(targetIndex);
        } else {
            // 理论上不应该发生，但作为保险
            alert('无法找到目标页面，请检查逻辑。');
        }
        
        jumperInput.value = ''; // 清空输入框
    }

    // 绑定点击事件
    jumperBtn.addEventListener('click', handleJump);
    
    // 绑定回车键事件
    jumperInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            handleJump();
        }
    });

    // --- END: 新增的页面跳转测试工具逻辑 ---

    function handlePageChange(direction) {
        if (isScrolling) return;

        const currentSection = sections[currentSectionIndex];
        
        // --- 过渡页滚动豁免逻辑 ---
        if (currentSection && currentSection.id && currentSection.id.startsWith('transition-')) {
            const scrollContainer = currentSection.querySelector('.scroll-container');
            if (scrollContainer && window.TransitionHandler && typeof window.TransitionHandler.handleScroll === 'function') {
                if (window.TransitionHandler.handleScroll(direction, scrollContainer)) {
                    return; // 过渡页内部消耗了滚动，不执行全局翻页
                }
            }
        }
        
        // 优先让页面内部处理滚动
        if (currentSection.id === 'page2-container' && window.Page2 && typeof window.Page2.handleScroll === 'function') {
            if (window.Page2.handleScroll(direction)) {
                return; // Page2 内部处理了滚动
            }
        }

        if (currentSection.id === 'page4-container' && window.Page4 && typeof window.Page4.handleScroll === 'function') {
            if (window.Page4.handleScroll(direction)) {
                return; // Page4 内部处理了滚动
            }
        }
        
        // 如果页面内部不处理，则进行全局翻页
        isScrolling = true;
        let pageChanged = false;
        if (direction === 'down' || direction === 'right') {
            if (currentSectionIndex < sections.length - 1) {
                setActiveSection(currentSectionIndex + 1);
                pageChanged = true;
            }
        } else if (direction === 'up' || direction === 'left') {
            if (currentSectionIndex > 0) {
                setActiveSection(currentSectionIndex - 1);
                pageChanged = true;
            }
        }
        
        if (pageChanged) {
            setTimeout(() => { isScrolling = false; }, 1200);
        } else {
            isScrolling = false;
        }
    }

    window.addEventListener('wheel', (event) => {
        event.preventDefault();
        const direction = event.deltaY > 0 ? 'down' : 'up';
        handlePageChange(direction);
    }, { passive: false });

    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowDown':
            case 'PageDown':
            case ' ':
                event.preventDefault();
                handlePageChange('down');
                break;
            case 'ArrowUp':
            case 'PageUp':
                event.preventDefault();
                handlePageChange('up');
                break;
            
            // **修改点b**: 新增左右键处理
            case 'ArrowRight':
                event.preventDefault();
                handlePageChange('right');
                break;
            case 'ArrowLeft':
                event.preventDefault();
                handlePageChange('left');
                break;

            case 'Home':
                if (currentSectionIndex !== 0) setActiveSection(0);
                break;
            case 'End':
                if (currentSectionIndex !== sections.length - 1) setActiveSection(sections.length - 1);
                break;
        }
    });

    // 触摸设备支持 (逻辑简化)
    let startY = 0;
    document.addEventListener('touchstart', e => { startY = e.touches[0].clientY; });
    document.addEventListener('touchend', e => {
        const endY = e.changedTouches[0].clientY;
        if (Math.abs(startY - endY) > 50) {
            const direction = startY > endY ? 'down' : 'up';
            handlePageChange(direction);
        }
    });

    setActiveSection(0);
    console.log(`PPT翻页式滚动控制器初始化完成，共 ${totalPages} 个页面。测试工具已加载。`);
}