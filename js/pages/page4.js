// js/pages/page4.js (最终完整修复版)
(function() {
    'use strict';

    // 数据定义
    const STAGES_DATA = [
        { year: 2018.5, title: '探索试点阶段', date: '2018-2019年', side: 'left', details: '突破传统招标只招不采的弊端，<br>以“量价挂钩”为核心，<br>集采范围从11座试点城市拓展到25省。' },
        { year: 2020.5, title: '制度建立阶段', date: '2020-2021年', side: 'right', details: '药品覆盖范围显著扩大：覆盖162个品种。<br>规则精细化：差比价机制、多家中标机制等。' },
        { year: 2021.5, title: '制度完善阶段', date: '2021年', side: 'left', details: '生物药纳入集采范围，中成药地方试点。<br>建立临床综合评价体系，尊重医疗需求。' },
        { year: 2022.5, title: '医保治理阶段', date: '2022年至今', side: 'right', details: '覆盖全品类：中成药、化学药、罕见病药。<br>通过DRG、DIP机制完善医保资金调配。' }
    ];

    // 状态变量
    let currentIndex = 0; // 默认显示第一个阶段
    let isAnimating = false;
    const totalStages = STAGES_DATA.length;
    let pathLength, startYear, endYear;

    // DOM 元素引用
    let timelineCanvas, pathProgress, pageHeader, stages;

    // 辅助函数
    const mapRange = (v, i_min, i_max, o_min, o_max) => (v - i_min) * (o_max - o_min) / (i_max - i_min) + o_min;

    // **【关键函数1: 创建时间轴HTML】**
    // 这个函数在上一版中被我错误地省略了
    function setupTimeline() {
        const pathBG = document.getElementById('path-bg');
        const pathFuture = document.getElementById('path-future');
        pathProgress = document.getElementById('path-progress');
        
        startYear = 2018; endYear = 2023;
        const start = { x: 200, y: 650 }, end = { x: 1200, y: 50 };
        const pathData = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
        
        pathBG.setAttribute('d', pathData);
        pathProgress.setAttribute('d', pathData);
        pathLength = pathProgress.getTotalLength();
        pathProgress.style.strokeDasharray = pathLength;
        pathProgress.style.strokeDashoffset = pathLength; // 初始状态：进度条隐藏
        
        const lastStageYear = STAGES_DATA[STAGES_DATA.length - 1].year;
        const lastPointP = mapRange(lastStageYear, startYear, endYear, 0.05, 0.95);
        const lastPoint = pathProgress.getPointAtLength(pathLength * lastPointP);
        pathFuture.setAttribute('d', `M ${lastPoint.x} ${lastPoint.y} L ${end.x} ${end.y}`);

        let contentHTML = '';
        for (let year = startYear; year <= endYear; year++) {
            const p = mapRange(year, startYear, endYear, 0.05, 0.95);
            const point = pathProgress.getPointAtLength(pathLength * p);
            contentHTML += `<div class="year-marker" style="left:${point.x}px; top:${point.y}px;">${year}</div>`;
        }
        STAGES_DATA.forEach(data => {
            const p = mapRange(data.year, startYear, endYear, 0.05, 0.95);
            const point = pathProgress.getPointAtLength(pathLength * p);
            contentHTML += `<div class="timeline-stage" data-side="${data.side}" style="left:${point.x}px; top:${point.y}px;"><div class="node"></div><div class="stage-content"><h2>${data.title}</h2><span class="date">${data.date}</span><p class="details">${data.details}</p></div></div>`;
        });
        contentHTML += `<div id="to-be-continued" style="left:${end.x}px; top:${end.y}px;">未完待续...</div>`;
        timelineCanvas.insertAdjacentHTML('beforeend', contentHTML);
    }

    // **【关键函数2: 更新视图】**
    // 实现了"概览视图"和"聚焦视图"的切换
    function updateTimeline(index) {
        stages.forEach(s => s.classList.remove('is-active'));
        const container = document.getElementById('page4-container'); // 确保能访问到容器
        
        if (index === -1) { // 概览视图
            container.classList.add('is-overview'); // 已修正：在正确的容器上添加类
            timelineCanvas.style.transform = 'translate(-50%, -50%) scale(1)';
            // 修复：概览模式下显示完整进度条
            pathProgress.style.strokeDashoffset = 0;
        } else { // 聚焦视图
            container.classList.remove('is-overview'); // 已修正：在正确的容器上移除类
            const stage = stages[index];
            const data = STAGES_DATA[index];
            const nodeX = parseFloat(stage.style.left);
            const nodeY = parseFloat(stage.style.top);
            const scale = 1.6;
            const translateX = (700 - nodeX) * scale;
            const translateY = (350 - nodeY) * scale;
            const p = mapRange(data.year, startYear, endYear, 0.05, 0.95);
            
            timelineCanvas.style.transform = `translate(calc(-50% + ${translateX}px), calc(-50% + ${translateY}px)) scale(${scale})`;
            pathProgress.style.strokeDashoffset = pathLength - (pathLength * p);
            stage.classList.add('is-active');
        }
    }
    
    // **【关键函数3: 导航逻辑】**
    // 实现了 0 -> 1 -> 2 -> 3 -> -1(概览) 的正确流程
    function navigate(direction) {
        if (isAnimating) return true;

        let newIndex = currentIndex;

        if (direction === 'down' || direction === 'right') {
            if (currentIndex >= 0 && currentIndex < totalStages - 1) {
                newIndex++; // 正常前进
            } else if (currentIndex === totalStages - 1) {
                newIndex = -1; // 从最后阶段进入概览
            } else { // currentIndex === -1
                return false; // 在概览时，允许翻页
            }
        } else if (direction === 'up' || direction === 'left') {
            if (currentIndex > 0) {
                newIndex--; // 正常后退
            } else if (currentIndex === -1) {
                newIndex = totalStages - 1; // 从概览回到最后阶段
            } else { // currentIndex === 0
                return false; // 在第一阶段时，允许翻页
            }
        }

        if (newIndex !== currentIndex) {
            currentIndex = newIndex;
            isAnimating = true;
            updateTimeline(currentIndex);
            setTimeout(() => { isAnimating = false; }, 1200);
        }
        return true; // 只要在页面内部有操作，就返回true
    }

    // **【关键函数4: 与 main.js 的协作接口】**
    // 接收来自 main.js 的指令
    function handleScroll(direction) {
        return navigate(direction);
    }

    // **【关键函数5: 初始化】**
    // 确保所有东西都按顺序执行，这个函数在上一版也被我错误地省略了
    function init() {
        const container = document.getElementById('page4-container');
        if (!container) return;

        timelineCanvas = container.querySelector('#timelineCanvas');
        pageHeader = container.querySelector('.page-header');
        
        if (!timelineCanvas || !pageHeader) return;

        // 1. 创建HTML
        setupTimeline();
        // 2. 获取创建好的元素
        stages = container.querySelectorAll('.timeline-stage');

        // 3. 播放入场动画
        pageHeader.classList.add('is-visible');
        const yearMarkers = container.querySelectorAll('.year-marker');
        setTimeout(() => {
             yearMarkers.forEach((marker, i) => {
                setTimeout(() => marker.classList.add('is-visible'), i * 80);
            });
        }, 300);

        // 4. 显示初始状态（第一个阶段）
        updateTimeline(currentIndex);
        
        // 5. 暴露接口给 main.js
        window.Page4 = { handleScroll };
        console.log('Page4 (最终完整修复版): 初始化成功！');
    }
    
    // 确保DOM加载完成后再执行初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();