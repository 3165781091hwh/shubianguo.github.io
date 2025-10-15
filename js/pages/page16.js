// js/pages/page16.js - 已根据项目架构进行重构和封装

(function() {
    // 确保在DOM加载完毕后执行，避免找不到元素
    document.addEventListener('DOMContentLoaded', function () {
        
        // 关键：将所有DOM查询限定在Page16的容器内，防止ID冲突
        const pageContainer = document.getElementById('page16-container');
        if (!pageContainer) {
            // 如果页面不存在于DOM中，则不执行任何操作
            return;
        }

        // --- 右侧图表 (图17) ---
        const rightChartDom = document.getElementById('page16-right-chart');
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

        // --- 左侧图表切换逻辑 (图A 和 图B/图16) ---
        const btnA = document.getElementById('page16-btn-chart-a');
        const btnB = document.getElementById('page16-btn-chart-b');
        const chartAImg = document.getElementById('page16-chart-a-img');
        const chartBContainer = document.getElementById('page16-chart-b-container');

        let chartB = null;

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
                
                if (!chartB) {
                    chartB = echarts.init(chartBContainer);
                    chartB.setOption(optionB);
                }
            }
        }

        btnA.addEventListener('click', () => renderLeftChart('A'));
        btnB.addEventListener('click', () => renderLeftChart('B'));

        renderLeftChart('A');
        
        // --- 响应式图表：使用 ResizeObserver 监听容器尺寸变化 ---
        const observer = new ResizeObserver(() => {
            rightMyChart.resize();
            if (chartB) {
                chartB.resize();
            }
        });
        
        // 监听主容器的尺寸变化
        observer.observe(pageContainer);
    });
})();