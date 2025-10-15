// js/pages/page7.js (最终无冲突版)

(function() {
    document.addEventListener('DOMContentLoaded', function() {
        
        // 核心修正：先找到本页面的唯一容器
        const page7Container = document.getElementById('page7-container');
        
        // 如果页面容器不存在，直接退出，防止脚本在其他页面执行时报错
        if (!page7Container) {
            return;
        }

        // 核心修正：只在 page7Container 内部查找图表 DOM 元素
        const chartDom = page7Container.querySelector('#main-chart');
        
        // 如果图表容器不存在，也退出
        if (!chartDom) {
            console.error('Page 7 chart container #main-chart not found.');
            return;
        }

        var myChart = echarts.init(chartDom);
        var option;

        // --- 以下图表配置代码与您提供的源文件完全相同 ---
        const batches = ['第二批', '第三批', '第四批', '第五批', '第七批', '第八批', '第九批'];
        const priceDropData = {
            mean: [0.55, 0.72, 0.68, 0.70, 0.65, 0.61, 0.70],
            stdDev: [0.22, 0.20, 0.19, 0.22, 0.24, 0.27, 0.21]
        };
        const bidPriceData = {
            mean: [80.70, 31.57, 140.86, 166.80, 75.88, 62.92, 96.64],
            stdDev: [410.61, 119.01, 572.14, 456.90, 167.39, 145.26, 256.01]
        };
        
        function generateErrorData(data) {
            return data.mean.map((mean, index) => {
                const std = data.stdDev[index];
                const lowerBound = Math.max(0, mean - std); 
                const upperBound = mean + std;
                return [index, lowerBound, upperBound];
            });
        }
        
        const priceDropError = generateErrorData(priceDropData);
        const bidPriceError = generateErrorData(bidPriceData);

        option = {
            color: ['#27ae60', '#f39c12'], 
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'cross', crossStyle: { color: '#999' } },
                formatter: function (params) {
                    let tooltipText = `${params[0].name}<br/>`;
                    params.filter(p => p.seriesType === 'line').forEach(p => {
                        const seriesIndex = p.seriesIndex;
                        const dataIndex = p.dataIndex;
                        let mean, stdDev;
                        if(seriesIndex === 0) {
                            mean = priceDropData.mean[dataIndex];
                            stdDev = priceDropData.stdDev[dataIndex];
                             tooltipText += `${p.marker} ${p.seriesName}: ${(mean * 100).toFixed(1)}% (±${(stdDev * 100).toFixed(1)}%)<br/>`;
                        } else {
                            mean = bidPriceData.mean[dataIndex];
                            stdDev = bidPriceData.stdDev[dataIndex];
                            tooltipText += `${p.marker} ${p.seriesName}: ${mean.toFixed(2)}元 (±${stdDev.toFixed(2)})<br/>`;
                        }
                    });
                    return tooltipText;
                }
            },
            legend: {
                data: ['价格降幅', '最高有效申报价'],
                textStyle: { fontSize: 14 },
                top: 'bottom'
            },
            grid: { left: '3%', right: '4%', bottom: '12%', containLabel: true },
            xAxis: [ { type: 'category', data: batches, axisPointer: { type: 'shadow' } } ],
            yAxis: [
                { type: 'value', name: '价格降幅', min: 0, max: 1, axisLabel: { formatter: (value) => (value * 100).toFixed(0) + '%' } },
                { type: 'value', name: '最高有效申报价 (元)', min: 0, axisLabel: { formatter: '{value} 元' } }
            ],
            series: [
                { name: '价格降幅', type: 'line', yAxisIndex: 0, data: priceDropData.mean, smooth: true, symbol: 'circle', symbolSize: 8, },
                {
                    type: 'custom', name: '价格降幅误差', yAxisIndex: 0,
                    renderItem: function (params, api) {
                        const xValue = api.value(0), highPoint = api.coord([xValue, api.value(2)]), lowPoint = api.coord([xValue, api.value(1)]), halfWidth = api.size([1, 0])[0] * 0.1;
                        return { type: 'group', children: [{ type: 'line', shape: { x1: highPoint[0] - halfWidth, y1: highPoint[1], x2: highPoint[0] + halfWidth, y2: highPoint[1] }, style: { stroke: api.visual('color'), lineWidth: 2 } }, { type: 'line', shape: { x1: highPoint[0], y1: highPoint[1], x2: lowPoint[0], y2: lowPoint[1] }, style: { stroke: api.visual('color'), lineWidth: 2 } }, { type: 'line', shape: { x1: lowPoint[0] - halfWidth, y1: lowPoint[1], x2: lowPoint[0] + halfWidth, y2: lowPoint[1] }, style: { stroke: api.visual('color'), lineWidth: 2 } }] };
                    },
                    data: priceDropError, z: 100, tooltip: { show: false }
                },
                { name: '最高有效申报价', type: 'line', yAxisIndex: 1, data: bidPriceData.mean, smooth: true, symbol: 'triangle', symbolSize: 10, },
                {
                    type: 'custom', name: '最高有效申报价误差', yAxisIndex: 1,
                    renderItem: function (params, api) {
                        const xValue = api.value(0), highPoint = api.coord([xValue, api.value(2)]), lowPoint = api.coord([xValue, api.value(1)]), halfWidth = api.size([1, 0])[0] * 0.1;
                        return { type: 'group', children: [{ type: 'line', shape: { x1: highPoint[0] - halfWidth, y1: highPoint[1], x2: highPoint[0] + halfWidth, y2: highPoint[1] }, style: { stroke: api.visual('color'), lineWidth: 2 } }, { type: 'line', shape: { x1: highPoint[0], y1: highPoint[1], x2: lowPoint[0], y2: lowPoint[1] }, style: { stroke: api.visual('color'), lineWidth: 2 } }, { type: 'line', shape: { x1: lowPoint[0] - halfWidth, y1: lowPoint[1], x2: lowPoint[0] + halfWidth, y2: lowPoint[1] }, style: { stroke: api.visual('color'), lineWidth: 2 } }] };
                    },
                    data: bidPriceError, z: 100, tooltip: { show: false }
                }
            ],
            animationDuration: 2000
        };

        myChart.setOption(option);
        window.addEventListener('resize', function () { myChart.resize(); });
    });
})();