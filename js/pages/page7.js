// 页面7 - 药品集采分析页面脚本
(function() {
    'use strict';

    let myChart = null;
    let isInitialized = false;

    // 等待DOM加载完成
    document.addEventListener('DOMContentLoaded', function() {
        // 检查ECharts是否已加载
        if (typeof echarts === 'undefined') {
            console.error('ECharts库未加载');
            return;
        }

        // 初始化侧边栏交互
        initSidebar();
        
        // 不立即初始化图表，等待页面变为可见
    });

    // 初始化ECharts图表
    function initChart() {
        if (isInitialized) return;
        
        const chartContainer = document.getElementById('main-chart');
        if (!chartContainer) {
            console.error('图表容器未找到');
            return;
        }

        // 创建ECharts实例
        myChart = echarts.init(chartContainer);

        // 图表数据（源自"表3"）
        const batches = ['第二批', '第三批', '第四批', '第五批', '第七批', '第八批', '第九批'];
        
        // 价格降幅数据 [均值, 标准差] - 修正数据
        const priceDropData = {
            mean: [0.55, 0.18, 0.72, 0.68, 0.65, 0.68, 0.72],
            stdDev: [0.22, 0.20, 0.19, 0.22, 0.24, 0.27, 0.21]
        };

        // 最高有效申报价/元 数据 [均值, 标准差] - 修正数据
        const bidPriceData = {
            mean: [95, 145, 120, 110, 70, 65, 100],
            stdDev: [20, 30, 25, 20, 15, 20, 25]
        };
        
        // 辅助函数：处理数据以生成误差线所需格式
        // 误差线数据格式为 [x轴索引, y轴下限, y轴上限]
        function generateErrorData(data) {
            return data.mean.map((mean, index) => {
                const std = data.stdDev[index];
                // 误差线不应低于0
                const lowerBound = Math.max(0, mean - std); 
                const upperBound = mean + std;
                return [index, lowerBound, upperBound];
            });
        }
        
        const priceDropError = generateErrorData(priceDropData);
        const bidPriceError = generateErrorData(bidPriceData);

        // ECharts 配置项
        const option = {
            // 使用项目分镜稿中的颜色
            color: ['#27ae60', '#f39c12'], 
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                },
                formatter: function (params) {
                    let tooltipText = `${params[0].name}<br/>`;
                    // 过滤掉误差线系列的提示
                    params.filter(p => p.seriesType === 'line').forEach(p => {
                        const seriesIndex = p.seriesIndex;
                        const dataIndex = p.dataIndex;
                        let mean, stdDev;
                        if(seriesIndex === 0) { // 价格降幅
                            mean = priceDropData.mean[dataIndex];
                            stdDev = priceDropData.stdDev[dataIndex];
                             tooltipText += `${p.marker} ${p.seriesName}: ${(mean * 100).toFixed(1)}% (±${(stdDev * 100).toFixed(1)}%)<br/>`;
                        } else { // 最高有效申报价
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
                textStyle: {
                    fontSize: 14
                },
                top: 'bottom'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '12%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: batches,
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '价格降幅',
                    min: 0,
                    max: 1,
                    axisLabel: {
                        formatter: '{value}' // ECharts 5+ 会自动处理百分比，这里仅作占位，实际格式化在 tooltip 中
                    }
                },
                {
                    type: 'value',
                    name: '最高有效申报价 (元)',
                    // 动态计算 Y 轴范围以容纳误差线
                    min: 0, 
                    axisLabel: {
                        formatter: '{value} 元'
                    }
                }
            ],
            series: [
                // 系列1: 价格降幅（折线图）
                {
                    name: '价格降幅',
                    type: 'line',
                    yAxisIndex: 0, // 关联左侧Y轴
                    data: priceDropData.mean,
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 8,
                },
                // 系列2: 价格降幅（误差线）
                {
                    type: 'custom',
                    name: '价格降幅误差',
                    yAxisIndex: 0,
                    renderItem: function (params, api) {
                        // 渲染误差线的函数
                        const xValue = api.value(0);
                        const highPoint = api.coord([xValue, api.value(2)]);
                        const lowPoint = api.coord([xValue, api.value(1)]);
                        const halfWidth = api.size([1, 0])[0] * 0.1;

                        return {
                            type: 'group',
                            children: [{
                                type: 'line',
                                shape: { x1: highPoint[0] - halfWidth, y1: highPoint[1], x2: highPoint[0] + halfWidth, y2: highPoint[1] },
                                style: { stroke: api.visual('color'), lineWidth: 2 }
                            }, {
                                type: 'line',
                                shape: { x1: highPoint[0], y1: highPoint[1], x2: lowPoint[0], y2: lowPoint[1] },
                                style: { stroke: api.visual('color'), lineWidth: 2 }
                            }, {
                                type: 'line',
                                shape: { x1: lowPoint[0] - halfWidth, y1: lowPoint[1], x2: lowPoint[0] + halfWidth, y2: lowPoint[1] },
                                style: { stroke: api.visual('color'), lineWidth: 2 }
                            }]
                        };
                    },
                    data: priceDropError,
                    z: 100, // 置于顶层
                    tooltip: { show: false }
                },
                // 系列3: 最高有效申报价（折线图）
                {
                    name: '最高有效申报价',
                    type: 'line',
                    yAxisIndex: 1, // 关联右侧Y轴
                    data: bidPriceData.mean,
                    smooth: true,
                    symbol: 'triangle',
                    symbolSize: 10,
                },
                // 系列4: 最高有效申报价（误差线）
                {
                    type: 'custom',
                    name: '最高有效申报价误差',
                    yAxisIndex: 1,
                    renderItem: function (params, api) {
                         // 复用上面的渲染函数
                        const xValue = api.value(0);
                        const highPoint = api.coord([xValue, api.value(2)]);
                        const lowPoint = api.coord([xValue, api.value(1)]);
                        const halfWidth = api.size([1, 0])[0] * 0.1;

                        return {
                            type: 'group',
                            children: [{
                                type: 'line',
                                shape: { x1: highPoint[0] - halfWidth, y1: highPoint[1], x2: highPoint[0] + halfWidth, y2: highPoint[1] },
                                style: { stroke: api.visual('color'), lineWidth: 2 }
                            }, {
                                type: 'line',
                                shape: { x1: highPoint[0], y1: highPoint[1], x2: lowPoint[0], y2: lowPoint[1] },
                                style: { stroke: api.visual('color'), lineWidth: 2 }
                            }, {
                                type: 'line',
                                shape: { x1: lowPoint[0] - halfWidth, y1: lowPoint[1], x2: lowPoint[0] + halfWidth, y2: lowPoint[1] },
                                style: { stroke: api.visual('color'), lineWidth: 2 }
                            }]
                        };
                    },
                    data: bidPriceError,
                    z: 100,
                    tooltip: { show: false }
                }
            ],
            animationDuration: 2000 // 图表初始动画时长
        };

        // 应用配置项
        myChart.setOption(option);

        // 监听窗口大小变化，使图表自适应
        window.addEventListener('resize', function () {
            if (myChart) {
                myChart.resize();
            }
        });

        // 将图表实例保存到全局，以便其他函数使用
        window.page7Chart = myChart;
        isInitialized = true;
        
        console.log('Page7图表初始化完成');
    }

    // 初始化侧边栏交互
    function initSidebar() {
        const sidebarItems = document.querySelectorAll('.sidebar-item');
        
        sidebarItems.forEach(item => {
            item.addEventListener('click', function() {
                // 移除所有active类
                sidebarItems.forEach(i => i.classList.remove('active'));
                // 添加active类到当前点击项
                this.classList.add('active');
                
                // 这里可以添加切换不同数据视图的逻辑
                // 例如：根据不同的侧边栏项显示不同的图表数据
                console.log('切换到:', this.textContent);
            });
        });
    }

    // 页面可见性检测（与PPT翻页系统协作）
    function onPageVisible() {
        console.log('Page7变为可见，初始化图表');
        
        // 检查容器状态
        const chartContainer = document.getElementById('main-chart');
        if (chartContainer) {
            console.log('图表容器尺寸:', chartContainer.offsetWidth, 'x', chartContainer.offsetHeight);
            console.log('图表容器样式:', window.getComputedStyle(chartContainer).display);
        }
        
        // 页面变为可见时初始化图表
        if (!isInitialized) {
            // 延迟一点时间确保DOM完全渲染
            setTimeout(() => {
                initChart();
            }, 100);
        } else if (myChart) {
            // 重新调整图表大小，确保显示正确
            myChart.resize();
        }
    }

    // 暴露页面可见性接口给全局滚动控制器
    window.Page7Controller = {
        onPageVisible: onPageVisible
    };

})(); 