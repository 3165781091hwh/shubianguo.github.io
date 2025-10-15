// js/pages/page9.js
(function() {
    // 确认本页面的容器存在后才执行脚本
    const pageContainer = document.getElementById('page9-container');
    if (!pageContainer) {
        return;
    }

    // --- 手风琴交互 ---
    // 将选择器限定在本页容器内，避免影响其他页面的手风琴
    const accordionItems = pageContainer.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        if (header) {
            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // 只关闭本页内的所有项
                accordionItems.forEach(i => i.classList.remove('active'));
                
                // 如果当前项不是激活状态，则打开它
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

    // --- ECharts 数据可视化 ---
    // 使用修改后的唯一ID获取图表容器
    const chartDom = document.getElementById('page9-chart-container');
    
    // 确保 ECharts 库已加载且图表容器存在
    if (typeof echarts !== 'undefined' && chartDom) {
        const myChart = echarts.init(chartDom);
        let option;

        const rawData = [
            { quarter: '第一季度', '换': 1951, '2换': 19 },
            { quarter: '第三季度', '换': 1398, '2换': 0 },
            { quarter: '第四季度', '换': 1336, '2换': 2 }
        ];

        const quarters = rawData.map(item => item.quarter);
        const data1 = rawData.map(item => item.换);
        const data2 = rawData.map(item => item['2换']);

        option = {
            tooltip: { trigger: 'axis' },
            legend: {
                data: ['“换”人数', '“2换”人数'],
                top: '5%',
                textStyle: { fontSize: '0.9vw' }
            },
            grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: quarters
            },
            yAxis: { type: 'value', name: '人数' },
            series: [
                {
                    name: '“换”人数',
                    type: 'line',
                    smooth: true,
                    data: data1,
                    color: '#27ae60',
                    label: { show: true, position: 'top', fontSize: '0.9vw' },
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
                    markLine: {
                        data: [{ type: 'average', name: '平均值' }],
                        label: { fontSize: '0.8vw' }
                    }
                },
                {
                    name: '“2换”人数',
                    type: 'line',
                    smooth: true,
                    data: data2,
                    color: '#f39c12',
                    label: { show: true, position: 'top', fontSize: '0.9vw' },
                    lineStyle: { width: 3 },
                }
            ]
        };

        myChart.setOption(option);
        
        // 监听窗口大小变化，使图表自适应
        window.addEventListener('resize', () => myChart.resize());
        
        // 性能优化：仅当页面进入视口时，才确保图表尺寸正确
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    myChart.resize(); // 确保尺寸正确
                }
            });
        }, { threshold: 0.1 });

        observer.observe(chartDom);

    } else {
        if (typeof echarts === 'undefined') {
            console.error('错误：ECharts 库未加载。');
        }
        if (!chartDom) {
            console.error('错误：未找到图表容器 #page9-chart-container。');
        }
    }
})();