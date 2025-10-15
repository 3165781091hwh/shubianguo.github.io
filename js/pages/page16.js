// Page16 - 推动规则创新页面脚本
(function() {
    'use strict';

    // 等待DOM加载完成
    document.addEventListener('DOMContentLoaded', function () {
        // 初始化右侧图表 (图17)
        initRightChart();
        
        // 初始化左侧图表切换逻辑
        initLeftChartToggle();
        
        // 监听窗口大小调整
        window.addEventListener('resize', handleResize);
    });

    // 初始化右侧图表 - 四个地方联盟集采竞争强度与降价幅度
    function initRightChart() {
        const rightChartDom = document.getElementById('right-chart');
        if (!rightChartDom) return;

        const rightMyChart = echarts.init(rightChartDom);
        const rightOption = {
            title: {
                text: '四个地方联盟集采竞争强度与降价幅度',
                left: 'center',
                top: '5%',
                textStyle: {
                    fontSize: 18, 
                    fontWeight: 'bold',
                    color: '#3D405B'
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                }
            },
            legend: {
                data: ['产品数', '平均降幅'],
                top: '15%',
                textStyle: {
                    fontSize: 12
                }
            },
            grid: {
                top: '30%',
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: ['1家', '2家', '3家', '4家', '5家', '5+'],
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '产品数',
                    min: 0,
                    max: 120,
                    interval: 20,
                    axisLabel: {
                        formatter: '{value}'
                    }
                },
                {
                    type: 'value',
                    name: '平均降幅',
                    min: -0.2,
                    max: 0.5,
                    interval: 0.1,
                    axisLabel: {
                        formatter: function(value) {
                            return (value * 100).toFixed(0) + '%';
                        }
                    }
                }
            ],
            series: [
                {
                    name: '产品数',
                    type: 'bar',
                    tooltip: {
                        valueFormatter: function (value) {
                            return value + ' 款';
                        }
                    },
                    data: [67, 43, 35, 19, 18, 112],
                    itemStyle: { color: '#008080' } // Teal
                },
                {
                    name: '平均降幅',
                    type: 'line',
                    yAxisIndex: 1,
                    tooltip: {
                        valueFormatter: function (value) {
                            return (value * 100).toFixed(0) + ' %';
                        }
                    },
                    data: [0.16, 0.37, 0.38, 0.43, 0.44, 0.43],
                    itemStyle: { color: '#FA8072' }, // Salmon
                    symbol: 'circle',
                    symbolSize: 8
                }
            ]
        };
        
        rightMyChart.setOption(rightOption);
        
        // 保存图表实例到全局变量，用于resize
        window.page16RightChart = rightMyChart;
    }

    // 初始化左侧图表切换逻辑
    function initLeftChartToggle() {
        const btnA = document.getElementById('btn-chart-a');
        const btnB = document.getElementById('btn-chart-b');
        const chartAImg = document.getElementById('chart-a-img');
        const chartBContainer = document.getElementById('chart-b-container');

        if (!btnA || !btnB || !chartAImg || !chartBContainer) return;

        let chartB = null;

        // 图B的配置选项
        const optionB = {
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' }
            },
            xAxis: {
                type: 'category',
                name: '参与联盟数',
                nameLocation: 'middle',
                nameGap: 30,
                data: ['1-3', '4-6', '6-9', '10-12', '13+']
            },
            yAxis: {
                type: 'value',
                name: '省份数',
                nameLocation: 'middle',
                nameGap: 35
            },
            series: [{
                name: '省份数',
                type: 'bar',
                data: [5, 5, 10, 9, 2],
                barWidth: '60%',
                itemStyle: {
                    color: '#6A5ACD' // SlateBlue
                }
            }]
        };

        // 渲染左侧图表的函数
        function renderLeftChart(type) {
            if (type === 'A') {
                chartAImg.style.opacity = 1;
                chartBContainer.style.opacity = 0;
                btnA.classList.add('active');
                btnB.classList.remove('active');
            } else { // type 'B'
                chartAImg.style.opacity = 0;
                chartBContainer.style.opacity = 1;
                btnB.classList.add('active');
                btnA.classList.remove('active');
                
                // 懒加载图B，只在需要时创建
                if (!chartB) {
                    chartB = echarts.init(chartBContainer);
                    chartB.setOption(optionB);
                    // 保存图表实例到全局变量，用于resize
                    window.page16ChartB = chartB;
                }
            }
        }

        // 绑定按钮点击事件
        btnA.addEventListener('click', () => renderLeftChart('A'));
        btnB.addEventListener('click', () => renderLeftChart('B'));

        // 默认显示图A
        renderLeftChart('A');
    }

    // 处理窗口大小调整
    function handleResize() {
        // 调整右侧图表大小
        if (window.page16RightChart) {
            window.page16RightChart.resize();
        }
        
        // 调整左侧图B大小
        if (window.page16ChartB) {
            window.page16ChartB.resize();
        }
    }

})(); 