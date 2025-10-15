/* =================================================================== */
/*                           PAGE5 脚本文件                              */
/*                    药品集采数据深度洞察页面脚本 (V2 - Animation Fix)   */
/* =================================================================== */

(function() {
    'use strict';

    // --- Data & Constants ---
    const procurementData = [
        { batch: '第一批(4+7)', bid: 31, win: 25, avg_drop: 52, max_drop: 96, start_date: '2018-12-01', exec_date: '2019-03-01' },
        { batch: '第一批(扩围)', bid: 25, win: 25, avg_drop: 59, max_drop: 78, start_date: '2019-09-01', exec_date: '2019-12-01' },
        { batch: '第二批', bid: 33, win: 32, avg_drop: 53, max_drop: 93, start_date: '2020-01-01', exec_date: '2020-04-01' },
        { batch: '第三批', bid: 56, win: 55, avg_drop: 53, max_drop: 99, start_date: '2020-08-01', exec_date: '2020-11-01' },
        { batch: '第四批', bid: 45, win: 45, avg_drop: 52, max_drop: 93, start_date: '2021-02-01', exec_date: '2021-04-01' },
        { batch: '第五批', bid: 62, win: 61, avg_drop: 56, max_drop: 99, start_date: '2021-06-01', exec_date: '2021-10-01' },
        { batch: '第六批', bid: 16, win: 16, avg_drop: 47, max_drop: 74, start_date: '2021-11-01', exec_date: '2022-05-01' },
        { batch: '第七批', bid: 61, win: 60, avg_drop: 48, max_drop: 94, start_date: '2022-07-01', exec_date: '2022-11-01' },
        { batch: '第八批', bid: 41, win: 39, avg_drop: 56, max_drop: 95, start_date: '2023-03-01', exec_date: '2023-07-01' },
        { batch: '第九批', bid: 44, win: 41, avg_drop: 58, max_drop: 93, start_date: '2023-11-01', exec_date: '2024-03-01' },
        { batch: '第十批', bid: 62, win: 62, avg_drop: 74.5, max_drop: 90, start_date: '2024-12-01', exec_date: '2025-04-01' },
    ];
    const batches = procurementData.map(item => item.batch);
    const FONT_OPTION = { fontWeight: 'bold', fontSize: 14 };
    const COLOR_PALETTE = {
        primary: '#5B8FB9',
        secondary: '#87A9C4',
        accent: '#5A6A8C',
        base: '#BBD6E4',
    };
    
    let charts = {};
    let isGanttAligned = false;
    let page5Container = null;

    function initChart(elementId) {
        const container = page5Container || document.getElementById('page5-container');
        page5Container = container;
        const chartDom = container ? container.querySelector(`#${elementId}`) : null;
        if (!chartDom) return null;
        if (charts[elementId] && !charts[elementId].isDisposed()) {
            charts[elementId].dispose();
        }
        charts[elementId] = echarts.init(chartDom);
        return charts[elementId];
    }
    
    // --- Chart Render Functions (Unchanged) ---

    // 1. Key Indicators (Bar/Line)
    function renderBarLineChart() {
        const chart = initChart('bar-line-chart');
        if (!chart) return;
        const option = {
            title: { text: '历次全国药品集采招标品种数和价格降幅', left: 'center', textStyle: { color: '#333', fontWeight: 'normal' } },
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
            legend: { top: 'bottom', textStyle: FONT_OPTION },
            grid: { top: '15%', left: '5%', right: '5%', bottom: '12%', containLabel: true },
            xAxis: [{ type: 'category', data: batches, axisLabel: { interval: 0, rotate: 30, ...FONT_OPTION } }],
            yAxis: [
                { type: 'value', name: '降幅 (%)', axisLabel: { ...FONT_OPTION }, nameTextStyle: FONT_OPTION },
                { type: 'value', name: '品种数', axisLabel: { ...FONT_OPTION }, nameTextStyle: FONT_OPTION }
            ],
            series: [
                { name: '平均降幅', type: 'bar', itemStyle: { color: COLOR_PALETTE.primary }, data: procurementData.map(d => d.avg_drop) },
                { name: '最高降幅', type: 'bar', itemStyle: { color: COLOR_PALETTE.secondary }, data: procurementData.map(d => d.max_drop) },
                { name: '招标品种数', type: 'line', yAxisIndex: 1, smooth: true, itemStyle: { color: COLOR_PALETTE.accent }, lineStyle: { width: 3 }, data: procurementData.map(d => d.bid) }
            ],
            animationEasing: 'elasticOut',
            animationDelayUpdate: (idx) => idx * 5,
        };
        chart.setOption(option, true); // Use true to clear previous animations
    }

    // 2. Development Journey (Streamgraph with Rollercoaster)
    function renderStreamChart() {
        const chart = initChart('stream-chart');
        if (!chart) return;
        const option = {
            title: { text: '药品集采规模发展历程', subtext: '过山车动画演示中标品种数变化', left: 'center', textStyle: { color: '#333', fontWeight: 'normal' } },
            tooltip: { trigger: 'axis' },
            legend: { data: ['中标品种数', '平均降幅'], top: 'bottom', textStyle: FONT_OPTION },
            grid: { top: '15%', left: '5%', right: '5%', bottom: '12%', containLabel: true },
            xAxis: { type: 'category', boundaryGap: false, data: batches, axisLabel: { interval: 0, rotate: 30, ...FONT_OPTION } },
            yAxis: [
                { type: 'value', name: '品种数', axisLabel: { ...FONT_OPTION }, nameTextStyle: FONT_OPTION },
                { type: 'value', name: '降幅(%)', max: 100, axisLabel: { ...FONT_OPTION }, nameTextStyle: FONT_OPTION }
            ],
            series: [
                { name: '中标品种数', type: 'line', stack: 'Total', areaStyle: { color: COLOR_PALETTE.base }, showSymbol: false, smooth: 0.5, data: procurementData.map(d => d.win) },
                { name: '平均降幅', type: 'line', yAxisIndex: 1, smooth: true, showSymbol: false, lineStyle: { width: 3, color: COLOR_PALETTE.accent }, data: procurementData.map(d => d.avg_drop) }
            ],
            graphic: { elements: [{ type: 'image', id: 'rollercoaster-icon', style: { image: 'image/（徽标）68a0b37b5a6d5.png', width: 40, height: 40 }, invisible: true }] }
        };
        chart.setOption(option);

        setTimeout(() => {
            if (chart.isDisposed()) return;
            const seriesIndex = 0;
            const points = procurementData.map((d, i) => chart.convertToPixel({seriesIndex: seriesIndex}, [i, d.win]));
            
            const smoothPoints = [];
            for (let i = 0; i < points.length - 1; i++) {
                const p1 = points[i];
                const p2 = points[i+1];
                for (let t = 0; t < 1; t += 0.02) {
                    const x = p1[0] * (1 - t) + p2[0] * t;
                    const y = p1[1] * (1 - t) + p2[1] * t;
                    smoothPoints.push([x,y]);
                }
            }
            smoothPoints.push(points[points.length-1]);

            chart.setOption({
                graphic: { elements: [{ id: 'rollercoaster-icon', invisible: false, x: points[0][0] - 20, y: points[0][1] - 20,
                    transition: ['x', 'y'],
                    keyframeAnimation: {
                        duration: 6000, 
                        loop: false,
                        keyframes: smoothPoints.map((p, i) => ({ 
                            percent: i / (smoothPoints.length - 1), 
                            x: p[0] - 20, 
                            y: p[1] - 20
                        })),
                        easing: 'cubicInOut'
                    }
                }]}
            });
        }, 500);
    }

    // 3. Variety Share (Rose Chart)
    function renderPieChart() {
        const chart = initChart('pie-chart');
        if (!chart) return;
        const fullData = procurementData.map((item) => ({
            value: item.bid, name: `${item.batch}: ${item.bid}个`,
        }));
        
        const option = {
            title: { text: '各批次招标品种数占比', left: 'center', textStyle: { color: '#333', fontWeight: 'normal' } },
            tooltip: { trigger: 'item', formatter: '{b}' },
            series: [{
                name: '招标品种数', type: 'pie', 
                radius: ['35%', '80%'], center: ['50%', '50%'],
                roseType: 'area', itemStyle: { borderRadius: 8 },
                label: { show: true, fontSize: '1vw', fontWeight: 'bold' },
                labelLine: { length: 15, length2: 20 },
                emphasis: { itemStyle: { shadowBlur: 20, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' }, scale: 1.1 },
                data: fullData,
                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: (idx) => Math.random() * 200
            }]
        };
        chart.setOption(option);
    }
    
    // 4. Timespan (Gantt Chart)
    function renderTimelineChart(alignStart = false) {
        const chart = initChart('timeline-chart');
        if (!chart) return;
        const data = procurementData.map((item, index) => {
             const startDate = new Date(item.start_date);
             const execDate = new Date(item.exec_date);
             const duration = (execDate - startDate) / (1000 * 60 * 60 * 24);
             return { name: item.batch, value: alignStart ? [index, 0, duration, item.avg_drop] : [index, startDate, execDate, item.avg_drop] };
        });
        const option = {
            title: { text: '药品集采时间跨度与降价力度', subtext: alignStart ? '按天数比较周期时长 (从招标到执行)' : '按真实时间查看执行窗口 (从招标到执行)', left: 'center' },
            tooltip: { formatter: p => `${procurementData[p.value[0]].batch}<br/>时长: ${(((new Date(procurementData[p.value[0]].exec_date)) - (new Date(procurementData[p.value[0]].start_date))) / (1000 * 60 * 60 * 24)).toFixed(0)} 天<br/>平均降幅: <b>${p.value[3]}%</b>` },
            grid: { top: '22%', left: '5%', right: '5%', bottom: '15%', containLabel: true },
            xAxis: { 
                type: alignStart ? 'value' : 'time', name: alignStart ? '天数' : '', axisLabel: {...FONT_OPTION}, nameTextStyle: FONT_OPTION,
                splitLine: { show: true, lineStyle: { type: 'dashed', color: '#ddd' } }
            },
            yAxis: { 
                type: 'category', data: batches, axisLabel: {...FONT_OPTION},
                splitLine: { show: true, lineStyle: { type: 'dashed', color: '#ddd' } }
            },
            visualMap: {
                min: 40, max: 80, dimension: 3, orient: 'horizontal',
                left: 'center', top: '12%', text: ['降幅高', '降幅低'],
                inRange: { color: ['#BBD6E4', '#5B8FB9'] }, calculable: true
            },
            series: [{
                type: 'custom',
                renderItem: (params, api) => {
                    const categoryIndex = api.value(0);
                    const start = api.coord([api.value(1), categoryIndex]);
                    const end = api.coord([api.value(2), categoryIndex]);
                    const height = api.size([0, 1])[1] * 0.6;
                    return { type: 'rect', shape: echarts.graphic.clipRectByRect({ x: start[0], y: start[1] - height / 2, width: end[0] - start[0], height: height }, { x: params.coordSys.x, y: params.coordSys.y, width: params.coordSys.width, height: params.coordSys.height }), style: api.style() };
                },
                encode: { x: [1, 2], y: 0 },
                data: data
            }]
        };
        chart.setOption(option, true);
    }
    
    // 5. Comprehensive Impact (Racing Bar Chart)
    function renderImpactChart() {
        const chart = initChart('impact-chart');
        if (!chart) return;
        const impactData = procurementData.map(item => ({
            name: item.batch,
            value: item.avg_drop * item.bid
        }));
        const option = {
            title: { 
                text: '历次集采综合影响力评估', 
                subtext: '影响力指数 = 平均降幅(%) × 招标品种数', 
                left: 'center',
                textStyle: { 
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: '#333'
                },
                subtextStyle: {
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#666'
                }
            },
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
            grid: { top: '20%', left: '5%', right: '5%', bottom: '15%', containLabel: true },
            xAxis: { type: 'value', name: '影响力指数', boundaryGap: [0, 0.01], axisLabel: {...FONT_OPTION}, nameTextStyle: FONT_OPTION },
            yAxis: { type: 'category', data: impactData.map(d => d.name), axisLabel: {...FONT_OPTION} },
            series: [{
                name: '影响力指数', type: 'bar',
                data: impactData.map(d => ({ value: d.value, itemStyle: { color: COLOR_PALETTE.primary } })),
                label: { show: true, position: 'right', formatter: (params) => Math.round(params.value), color: '#333' },
                showBackground: true,
                backgroundStyle: { color: 'rgba(180, 180, 180, 0.2)' }
            }],
            animationDuration: 2000,
            animationEasing: 'cubicOut'
        };
        chart.setOption(option);
    }

    // --- Page Logic (Unchanged) ---
    function toggleGanttView() { 
        isGanttAligned = !isGanttAligned; 
        const container = page5Container || document.getElementById('page5-container');
        const btn = container ? container.querySelector('#gantt-toggle-btn') : document.getElementById('gantt-toggle-btn');
        if (btn) btn.innerText = isGanttAligned ? '返回时间视图' : '对齐起点比较'; 
        renderTimelineChart(isGanttAligned); 
    }
    
    const renderFunctions = [renderBarLineChart, renderStreamChart, renderPieChart, () => renderTimelineChart(isGanttAligned), renderImpactChart];
    
    function switchTab(index) {
        const container = page5Container || document.getElementById('page5-container');
        const tabs = container ? container.querySelectorAll('.tab') : document.querySelectorAll('#page5-container .tab');
        const wrappers = container ? container.querySelectorAll('.chart-wrapper') : document.querySelectorAll('#page5-container .chart-wrapper');
        tabs.forEach((t, i) => t.classList.toggle('active', i === index));
        wrappers.forEach((w, i) => w.classList.toggle('active', i === index));
        
        renderFunctions[index]();
        
        const tooltip = document.getElementById('logo-tooltip');
        if (index === 1) {
            tooltip.innerHTML = '中国医疗保障徽标象征着<b>保障与责任，呵护与托底</b>。<br/><i>提示：再次点击此徽标可重播动画。</i>';
        } else {
            tooltip.innerHTML = '中国医疗保障徽标象征着<b>保障与责任，呵护与托底</b>。';
        }
    }

    // --- Initialization & Event Binding ---
    function initializePage5() {
        
        // --- ANIMATION FIX START ---
        // The logic to automatically play the animation when Page 5 becomes visible.
        page5Container = document.getElementById('page5-container');
        if (!page5Container) return;

        // Create an observer to watch for when 'is-active' class is added
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const targetElement = mutation.target;
                    const isActive = targetElement.classList.contains('is-active');
                    const firstTab = targetElement.querySelector('.tab');

                    // If the page just became active AND the first tab is selected,
                    // re-render the chart to play the animation.
                    if (isActive && firstTab && firstTab.classList.contains('active')) {
                        // A small delay ensures the page transition is complete, making the animation smoother.
                        setTimeout(() => {
                            renderBarLineChart();
                        }, 100); 
                    }
                }
            }
        });

        // Start observing the page container for attribute changes
        observer.observe(page5Container, { attributes: true });
        // --- ANIMATION FIX END ---

        // Render the initial chart WITHOUT animation the first time. The observer will handle the animated version.
        renderBarLineChart(); 
        
        // Bind logo click for animation replay
        const logoContainer = page5Container.querySelector('#logo-container');
        if(logoContainer) {
            logoContainer.addEventListener('click', () => {
                const activeChartWrapper = page5Container.querySelector('.chart-wrapper.active');
                if (activeChartWrapper && activeChartWrapper.id === 'stream-chart') {
                    renderStreamChart();
                }
            });
        }
        
        // Bind tab click events (non-breaking: also keep global window handlers)
        page5Container.querySelectorAll('.tab').forEach((tab, i) => {
            const idxAttr = tab.getAttribute('data-index');
            const idx = idxAttr ? parseInt(idxAttr, 10) : i;
            tab.addEventListener('click', () => switchTab(idx));
        });

        const ganttBtn = page5Container.querySelector('#gantt-toggle-btn');
        if (ganttBtn) {
            ganttBtn.addEventListener('click', toggleGanttView);
        }

        // Bind resize handler
        window.addEventListener('resize', () => {
             Object.values(charts).forEach(chart => chart && !chart.isDisposed() && chart.resize());
        });
    }

    // Wait for the DOM to be fully loaded before initializing
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializePage5);
    } else {
        initializePage5();
    }
    
    // Expose necessary functions to the global scope for onclick attributes
    window.switchTab = switchTab;
    window.toggleGanttView = toggleGanttView;

})();