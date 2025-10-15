// js/pages/page8.js (最终修复版 v5 - 同步图表字体单位)

(() => {
    // ... (文件顶部代码保持不变) ...
    const page8_container = document.getElementById('page8-container');
    if (!page8_container) return;
    const sourceData = [ { category: '综合服务类', before_avg: 1876.66, before_ratio: 10.92, after_avg: 1973.92, after_ratio: 11.93 }, { category: '治疗类', before_avg: 4191.03, before_ratio: 24.38, after_avg: 3786.21, after_ratio: 22.88 }, { category: '诊断类', before_avg: 2095.45, before_ratio: 12.19, after_avg: 1991.67, after_ratio: 12.04 }, { category: '康复类', before_avg: 39.61, before_ratio: 0.23, after_avg: 28.93, after_ratio: 0.17 }, { category: '中医类', before_avg: 765.42, before_ratio: 4.45, after_avg: 702.46, after_ratio: 4.25 }, { category: '药品类', before_avg: 5127.07, before_ratio: 29.82, after_avg: 4651.43, after_ratio: 28.11 }, { category: '西药类', before_avg: 4101.31, before_ratio: 23.86, after_avg: 3801.12, after_ratio: 22.97 }, { category: '中药类', before_avg: 1025.76, before_ratio: 5.97, after_avg: 850.31, after_ratio: 5.14 }, { category: '血液及血液制品类', before_avg: 263.26, before_ratio: 1.53, after_avg: 242.18, after_ratio: 1.46 }, { category: '耗材类', before_avg: 2730.57, before_ratio: 15.88, after_avg: 3136.03, after_ratio: 18.95 }, { category: '其他类', before_avg: 102.94, before_ratio: 0.60, after_avg: 34.59, after_ratio: 0.21 }];
    const chartDom = page8_container.querySelector('#chart-container');
    const myChart = echarts.init(chartDom);
    const chartTitleContainer = page8_container.querySelector('#chart-title-container');
    const colors = { decrease: '#65BB5D', increase: '#D9534F' };
    const areaColors = ['#5B8FA8', '#6EA4B8', '#81B9C8', '#94CDD8', '#A7E2E8', '#F2C6C4', '#EAAFAE', '#E39897', '#DC8181', '#E07A5F', '#D06C53'];
    const changeRateData = sourceData.map(item => ({ category: item.category, value: item.before_avg === 0 ? 0 : ((item.after_avg - item.before_avg) / item.before_avg) * 100, before_avg: item.before_avg, after_avg: item.after_avg, })).sort((a, b) => a.value - b.value);

    const optionChangeRate = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter: function (params) {
                const data = params[0].data;
                return `${data.category}<br/>
                        变化率: <strong>${data.value.toFixed(1)}%</strong><br/>
                        绝对值: ¥${data.before_avg.toFixed(2)} → ¥${data.after_avg.toFixed(2)}`;
            }
        },
        grid: { left: '3%', right: '10%', bottom: '3%', containLabel: true },
        xAxis: { type: 'value', name: '变化率 (%)', axisLabel: { formatter: '{value}%' } },
        yAxis: { type: 'category', data: changeRateData.map(item => item.category) },
        series: [{
            type: 'bar',
            label: {
                show: true,
                position: 'right',
                formatter: (params) => `${params.value.toFixed(1)}%`,
                /* 与参考版保持一致的显示单位 */
                fontSize: '1vw', 
                color: '#333'
            },
            data: changeRateData.map(item => ({
                value: item.value,
                category: item.category,
                before_avg: item.before_avg,
                after_avg: item.after_avg,
                itemStyle: {
                    color: item.value > 0 ? colors.increase : colors.decrease,
                    opacity: 0.85
                },
                emphasis: {
                    itemStyle: {
                        opacity: 1
                    }
                }
            }))
        }]
    };
    
    // ... (文件其余部分保持不变) ...
    const optionComposition = { color: areaColors, tooltip: { trigger: 'axis', formatter: function(params) { let result = params[0].name + '<br/>'; params.forEach(p => { result += `${p.marker} ${p.seriesName}: ${p.value.toFixed(2)}%<br/>`; }); return result; }}, legend: { top: 'center', right: 20, orient: 'vertical', icon: 'circle' }, grid: { left: '3%', right: '180px', bottom: '3%', containLabel: true }, xAxis: { type: 'category', boundaryGap: false, data: ['集采前', '集采后'] }, yAxis: { type: 'value', name: '构成比 (%)', max: 100, axisLabel: { formatter: '{value}%' } }, series: sourceData.map(item => ({ name: item.category, type: 'line', stack: 'Total', smooth: true, lineStyle: { width: 0 }, showSymbol: false, areaStyle: { opacity: 0.85 }, emphasis: { focus: 'series' }, data: [item.before_ratio, item.after_ratio] })) };
    function renderChangeRateChart() { myChart.setOption(optionChangeRate, true); chartTitleContainer.innerText = '图五：集采前后各项费用均值变化率对比'; page8_container.querySelector('#show-change-rate').classList.add('active'); page8_container.querySelector('#show-composition').classList.remove('active'); }
    function renderCompositionChart() { myChart.setOption(optionComposition, true); chartTitleContainer.innerText = '图五：集采前后费用构成流转对比'; page8_container.querySelector('#show-composition').classList.add('active'); page8_container.querySelector('#show-change-rate').classList.remove('active'); }
    page8_container.querySelector('#show-change-rate').addEventListener('click', renderChangeRateChart);
    page8_container.querySelector('#show-composition').addEventListener('click', renderCompositionChart);
    renderChangeRateChart();
    const observer = new ResizeObserver(() => { myChart.resize(); });
    observer.observe(chartDom);
})();