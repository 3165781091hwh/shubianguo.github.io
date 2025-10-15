/* =================================================================== */
/*                           PAGE9 脚本文件                            */
/* =================================================================== */
/* 药品集采深度解析页面 - 政策驱动下的市场响应与质量保证 */

(function() {
    'use strict';

    // 等待DOM加载完成
    document.addEventListener('DOMContentLoaded', function() {
        initializePage9();
    });

    function initializePage9() {
        // 初始化手风琴交互
        initializeAccordion();
        
        // 初始化ECharts图表
        initializeChart();
        
        // 初始化侧边栏导航
        initializeSidebar();
    }

    // --- 手风琴交互 ---
    function initializeAccordion() {
        const accordionItems = document.querySelectorAll('.accordion-item');
        
        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            
            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // 关闭所有项
                accordionItems.forEach(i => i.classList.remove('active'));
                
                // 如果当前项不是激活状态，则打开它
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }

    // --- ECharts 数据可视化升级 ---
    function initializeChart() {
        const chartDom = document.getElementById('chart-container');
        if (!chartDom) return;

        const myChart = echarts.init(chartDom);
        
        const rawData = [
            { quarter: '第一季度', 换: 1951, '2换': 19 },
            { quarter: '第三季度', 换: 1398, '2换': 0 },
            { quarter: '第四季度', 换: 1336, '2换': 2 }
        ];

        const quarters = rawData.map(item => item.quarter);
        const data1 = rawData.map(item => item.换);
        const data2 = rawData.map(item => item['2换']);

        const option = {
            tooltip: { 
                trigger: 'axis',
                formatter: function(params) {
                    let result = params[0].axisValue + '<br/>';
                    params.forEach(param => {
                        result += param.marker + param.seriesName + ': ' + param.value + '人<br/>';
                    });
                    return result;
                }
            },
            legend: {
                data: ['"换"人数', '"2换"人数'],
                top: '5%',
                textStyle: { fontSize: '0.9vw' }
            },
            grid: { 
                left: '3%', 
                right: '4%', 
                bottom: '3%', 
                containLabel: true 
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: quarters,
                axisLabel: {
                    fontSize: '0.9vw'
                }
            },
            yAxis: { 
                type: 'value', 
                name: '人数',
                axisLabel: {
                    fontSize: '0.9vw'
                }
            },
            series: [
                {
                    name: '"换"人数',
                    type: 'line',
                    smooth: true,
                    data: data1,
                    color: '#27ae60',
                    label: { 
                        show: true, 
                        position: 'top', 
                        fontSize: '0.9vw',
                        formatter: '{c}人'
                    },
                    lineStyle: { width: 3 },
                    areaStyle: { 
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(39, 174, 96, 0.5)'
                        }, {
                            offset: 1,
                            color: 'rgba(39, 174, 96, 0)'
                        }])
                    },
                    markPoint: { 
                        data: [
                            { type: 'max', name: '峰值' },
                            { type: 'min', name: '谷值' }
                        ]
                    },
                    markLine: {
                        data: [{ type: 'average', name: '平均值' }],
                        label: { fontSize: '0.8vw' }
                    }
                },
                {
                    name: '"2换"人数',
                    type: 'line',
                    smooth: true,
                    data: data2,
                    color: '#f39c12',
                    label: { 
                        show: true, 
                        position: 'top', 
                        fontSize: '0.9vw',
                        formatter: '{c}人'
                    },
                    lineStyle: { width: 3 },
                    markPoint: {
                        data: [
                            { type: 'max', name: '峰值' }
                        ]
                    }
                }
            ]
        };

        myChart.setOption(option);
        
        // 响应式调整
        window.addEventListener('resize', () => {
            myChart.resize();
        });
    }

    // --- 侧边栏导航交互 ---
    function initializeSidebar() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                // 移除所有active状态
                navItems.forEach(nav => nav.classList.remove('active'));
                
                // 添加当前active状态
                item.classList.add('active');
                
                // 这里可以添加切换不同数据视图的逻辑
                // 目前是预留功能，可以根据需要扩展
                console.log('切换到:', item.textContent, '视图');
            });
        });
    }

    // 暴露给全局的接口（如果需要的话）
    window.Page9Controller = {
        initialize: initializePage9,
        refreshChart: function() {
            const chartDom = document.getElementById('chart-container');
            if (chartDom) {
                const chart = echarts.getInstanceByDom(chartDom);
                if (chart) {
                    chart.resize();
                }
            }
        }
    };

})(); 