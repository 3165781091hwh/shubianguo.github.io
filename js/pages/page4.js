// Page4 - 时间轴动画页面脚本 (重构版)
(function() {
    'use strict';

    const STAGES_DATA = [
        { year: 2018.5, title: '探索试点阶段', date: '2018-2019年', side: 'left', details: '突破传统招标只招不采的弊端，以"量价挂钩"为核心。<br>集采范围从11座试点城市拓展到25省。' },
        { year: 2020.5, title: '制度建立阶段', date: '2020-2021年', side: 'right', details: '药品覆盖范围显著扩大：覆盖162个品种。<br>规则精细化："差比价机制"、"多家中标机制"等。' },
        { year: 2021.5, title: '制度完善阶段', date: '2021年', side: 'left', details: '生物药纳入集采范围，中成药地方试点。<br>建立临床综合评价体系，尊重医疗需求。' },
        { year: 2022.5, title: '医保治理阶段', date: '2022年至今', side: 'right', details: '覆盖全品类：中成药、化学药、罕见病药。<br>通过DRG、DIP机制完善医保资金调配。' }
    ];

    let currentStageIndex = -1;
    let isAnimating = false;
    let hasInitialized = false;
    let timelineCanvas, pathProgress, pathLength, startYear, endYear, stages, pageHeader, futureText;

    const mapRange = (v, i_min, i_max, o_min, o_max) => (v - i_min) * (o_max - o_min) / (i_max - i_min) + o_min;

    function setupTimeline() {
        const start = { x: 100, y: 650 }, end = { x: 1100, y: 50 };
        const pathData = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
        
        document.getElementById('path-bg').setAttribute('d', pathData);
        pathProgress.setAttribute('d', pathData);
        
        pathLength = pathProgress.getTotalLength();
        pathProgress.style.strokeDasharray = pathLength;
        pathProgress.style.strokeDashoffset = pathLength;
        
        startYear = 2018; endYear = 2023;
        
        const lastStageYear = STAGES_DATA[STAGES_DATA.length - 1].year;
        const lastPointP = mapRange(lastStageYear, startYear, endYear, 0.05, 0.95);
        const lastPoint = pathProgress.getPointAtLength(pathLength * lastPointP);
        document.getElementById('path-future').setAttribute('d', `M ${lastPoint.x} ${lastPoint.y} L ${end.x} ${end.y}`);

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

        stages = document.querySelectorAll('.timeline-stage');
        futureText = document.getElementById('to-be-continued');
    }

    async function playStageAnimation(stageIndex, direction = 'forward') {
        if (isAnimating) return;
        isAnimating = true;

        // Hide previous stage
        if (direction === 'forward' && stageIndex > 0) {
            stages[stageIndex - 1].classList.remove('is-active');
        } else if (direction === 'backward' && stageIndex < STAGES_DATA.length - 1) {
            stages[stageIndex + 1].classList.remove('is-active');
        }

        if (stageIndex === -1) { // Go back to start
            timelineCanvas.style.transform = 'translate(-50%, -50%) scale(1)';
            pathProgress.style.strokeDashoffset = pathLength;
            isAnimating = false;
            return;
        }

        const stage = stages[stageIndex];
        const data = STAGES_DATA[stageIndex];
        const p = mapRange(data.year, startYear, endYear, 0.05, 0.95);
        
        const nodeX = parseFloat(stage.style.left);
        const nodeY = parseFloat(stage.style.top);
        const scale = 1.6;
        const translateX = (600 - nodeX) * scale;
        const translateY = (350 - nodeY) * scale;
        
        timelineCanvas.style.transform = `translate(calc(-50% + ${translateX}px), calc(-50% + ${translateY}px)) scale(${scale})`;
        pathProgress.style.strokeDashoffset = pathLength - (pathLength * p);
        
        stage.classList.add('is-active');
        
        setTimeout(() => { isAnimating = false; }, 800); // Animation duration
    }

    async function initializeAnimation() {
        if (hasInitialized) return;
        hasInitialized = true;
        pageHeader.classList.add('is-visible');
        document.querySelectorAll('.year-marker').forEach((marker, i) => {
            setTimeout(() => marker.classList.add('is-visible'), i * 80);
        });
    }

    function handleScroll(direction) {
        initializeAnimation();
        if (isAnimating) return true;

        if (direction === 'down') {
            if (currentStageIndex < STAGES_DATA.length - 1) {
                currentStageIndex++;
                playStageAnimation(currentStageIndex, 'forward');
                return true; // Scroll handled internally
            } else {
                // At the end, allow scrolling to next page
                if (currentStageIndex === STAGES_DATA.length -1) {
                    stages[currentStageIndex].classList.remove('is-active');
                    timelineCanvas.style.transform = 'translate(-50%, -50%) scale(1)';
                    futureText.classList.add('is-visible');
                }
                return false; 
            }
        } else { // direction === 'up'
            if (currentStageIndex >= 0) {
                currentStageIndex--;
                playStageAnimation(currentStageIndex, 'backward');
                futureText.classList.remove('is-visible');
                return true; // Scroll handled internally
            } else {
                return false; // At the beginning, allow scrolling to previous page
            }
        }
    }

    function init() {
        timelineCanvas = document.getElementById('timelineCanvas');
        pathProgress = document.getElementById('path-progress');
        pageHeader = document.getElementById('pageHeader');
        
        if (!timelineCanvas || !pathProgress || !pageHeader) return;

        setupTimeline();
        
        // Expose the handleScroll function to the global scope
        window.Page4 = { handleScroll };
        
        console.log('Page4: Time-lapse animation page re-initialized for scroll control.');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})(); 