/*
 * 文件: js/pages/page11.js
 * 描述: Page 11 的 ECharts 图表初始化脚本。
 *      该脚本是自包含的，与全局 main.js 无冲突。
 */
document.addEventListener('DOMContentLoaded', function () {

    // --- 数据准备 ---
    const timeLabels = ['2018Q1', '2018Q2', '2018Q3', '2018Q4', '2019Q1', '2019Q2', '2019Q3', '2019Q4', '2020Q1', '2020Q2', '2020Q3', '2020Q4', '2021Q1'];
    
    // 数据1: ROE (净资产收益率)
    const roeData = {
        experimental: [0.032, 0.039, 0.031, 0.016, 0.037, 0.045, 0.008, 0.015, 0.022, 0.04, 0.034, 0.021, 0.033],
        control:      [0.031, 0.034, 0.027, 0.002, 0.025, 0.033, 0.029, 0.019, 0.025, 0.036, 0.033, -0.001, 0.033]
    };

    // 数据2: 托宾Q
    const tobinQData = {
        control: [2.5, 2.4, 2.3, 2.0, 2.7, 2.6, 2.7, 2.8, 3.0, 3.6, 3.8, 3.7, 3.3],
        experimental: [4.0, 4.2, 3.7, 3.0, 3.7, 3.5, 3.6, 3.8, 3.9, 4.2, 4.3, 4.4, 4.5]
    };

    // 动态获取在 CSS 中定义的颜色
    const page11Container = document.getElementById('page11-container');
    const colors = {
        color1: getComputedStyle(page11Container).getPropertyValue('--primary-color-1').trim(),
        color2: getComputedStyle(page11Container).getPropertyValue('--primary-color-2').trim()
    };

    // --- 初始化 ECharts 实例 ---
    const chartRoe = echarts.init(document.getElementById('chart-roe'));
    const chartTobinQ = echarts.init(document.getElementById('chart-tobin-q'));

    // --- 通用图表配置 ---
    const baseOption = {
        tooltip: { trigger: 'axis' },
        grid: { left: '10%', right: '5%', bottom: '22%', top: '20%' }, 
        xAxis: { type: 'category', boundaryGap: false, data: timeLabels, axisLabel: { rotate: 30 } },
        yAxis: { type: 'value', axisLabel: { formatter: '{value}' } },
        legend: {
            bottom: 0,
            textStyle: {
                fontSize: 14
            }
        }
    };

    // --- 配置图表1: ROE ---
    const optionRoe = {
        ...baseOption,
        title: { text: '企业短期绩效净资产收益率的演变趋势', left: 'center', textStyle: { fontSize: 22 } }, // 调整了字号以适应容器
        color: [colors.color2, colors.color1],
        legend: { ...baseOption.legend, data: ['中标企业', '未中标企业'] },
        series: [
            { name: '中标企业', type: 'line', smooth: true, data: roeData.experimental },
            { name: '未中标企业', type: 'line', smooth: true, data: roeData.control }
        ]
    };

    // --- 配置图表2: 托宾Q ---
    const optionTobinQ = {
        ...baseOption,
        title: { text: '企业长期绩效托宾 Q 的演变趋势', left: 'center', textStyle: { fontSize: 22 } }, // 调整了字号以适应容器
        color: [colors.color2, colors.color1],
        legend: { ...baseOption.legend, data: ['中标企业', '未中标企业'] },
        series: [
            { name: '中标企业', type: 'line', smooth: true, data: tobinQData.experimental },
            { name: '未中标企业', type: 'line', smooth: true, data: tobinQData.control }
        ]
    };

    // --- 渲染图表 ---
    chartRoe.setOption(optionRoe);
    chartTobinQ.setOption(optionTobinQ);

    // --- 监听窗口大小调整 ---
    window.addEventListener('resize', function () {
        chartRoe.resize();
        chartTobinQ.resize();
    });
});