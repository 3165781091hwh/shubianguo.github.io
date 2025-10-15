/* =================================================================== */
/*                           PAGE11 影响企业绩效页面脚本                */
/* =================================================================== */

(function() {
    'use strict';

    // 等待DOM加载完成
    document.addEventListener('DOMContentLoaded', function () {
        // 检查是否在page11页面
        const page11Container = document.getElementById('page11-container');
        if (!page11Container) return;

        // 初始化页面
        initPage11();
    });

    function initPage11() {
        // 数据准备 (从图片表格中提取)
        const timeLabels = ['2018Q1', '2018Q2', '2018Q3', '2018Q4', '2019Q1', '2019Q2', '2019Q3', '2019Q4', '2020Q1', '2020Q2', '2020Q3', '2020Q4', '2021Q1'];
        
        // 数据1: ROE
        const roeData = {
            experimental: [0.032, 0.039, 0.031, 0.016, 0.037, 0.045, 0.008, 0.015, 0.022, 0.04, 0.034, 0.021, 0.033],
            control:      [0.031, 0.034, 0.027, 0.002, 0.025, 0.033, 0.029, 0.019, 0.025, 0.036, 0.033, -0.001, 0.033]
        };

        // 数据2: 托宾Q
        const tobinQData = {
            control: [2.5, 2.4, 2.3, 2.0, 2.7, 2.6, 2.7, 2.8, 3.0, 3.6, 3.8, 3.7, 3.3],
            experimental: [4.0, 4.2, 3.7, 3.0, 3.7, 3.5, 3.6, 3.8, 3.9, 4.2, 4.3, 4.4, 4.5]
        };

        // 获取CSS变量颜色
        const colors = {
            color1: getComputedStyle(document.documentElement).getPropertyValue('--primary-color-1').trim() || '#3D405B',
            color2: getComputedStyle(document.documentElement).getPropertyValue('--primary-color-2').trim() || '#E07A5F'
        };

        // 初始化 ECharts 实例
        const chartRoe = echarts.init(document.getElementById('chart-roe'));
        const chartTobinQ = echarts.init(document.getElementById('chart-tobin-q'));

        // 通用图表配置
        const baseOption = {
            tooltip: { 
                trigger: 'axis',
                formatter: function(params) {
                    let result = params[0].axisValue + '<br/>';
                    params.forEach(param => {
                        const value = param.seriesName === '托宾Q' ? param.value.toFixed(1) : (param.value * 100).toFixed(1) + '%';
                        result += param.marker + param.seriesName + ': ' + value + '<br/>';
                    });
                    return result;
                }
            },
            grid: { 
                left: '10%', 
                right: '5%', 
                bottom: '22%', 
                top: '20%' 
            }, 
            xAxis: { 
                type: 'category', 
                boundaryGap: false, 
                data: timeLabels, 
                axisLabel: { 
                    rotate: 30,
                    fontSize: 12
                } 
            },
            yAxis: { 
                type: 'value', 
                axisLabel: { 
                    formatter: function(value) {
                        // 根据图表类型格式化Y轴标签
                        if (chartRoe && chartRoe.getOption().title.text.includes('ROE')) {
                            return (value * 100).toFixed(1) + '%';
                        }
                        return value.toFixed(1);
                    }
                } 
            },
            legend: {
                bottom: 0,
                textStyle: {
                    fontSize: 14
                }
            }
        };

        // 配置图表1: ROE
        const optionRoe = {
            ...baseOption,
            title: { 
                text: '企业短期绩效净资产收益率的演变趋势', 
                left: 'center', 
                textStyle: { 
                    fontSize: 28,
                    fontWeight: 'bold',
                    color: colors.color1
                } 
            },
            color: [colors.color2, colors.color1],
            legend: { 
                ...baseOption.legend, 
                data: ['中标企业', '未中标企业'] 
            },
            series: [
                { 
                    name: '中标企业', 
                    type: 'line', 
                    smooth: true, 
                    data: roeData.experimental,
                    lineStyle: { width: 3 },
                    symbol: 'circle',
                    symbolSize: 6
                },
                { 
                    name: '未中标企业', 
                    type: 'line', 
                    smooth: true, 
                    data: roeData.control,
                    lineStyle: { width: 3 },
                    symbol: 'circle',
                    symbolSize: 6
                }
            ]
        };

        // 配置图表2: 托宾Q
        const optionTobinQ = {
            ...baseOption,
            title: { 
                text: '企业长期绩效托宾 Q 的演变趋势', 
                left: 'center', 
                textStyle: { 
                    fontSize: 28,
                    fontWeight: 'bold',
                    color: colors.color1
                } 
            },
            color: [colors.color2, colors.color1],
            legend: { 
                ...baseOption.legend, 
                data: ['中标企业', '未中标企业'] 
            },
            series: [
                { 
                    name: '中标企业', 
                    type: 'line', 
                    smooth: true, 
                    data: tobinQData.experimental,
                    lineStyle: { width: 3 },
                    symbol: 'circle',
                    symbolSize: 6
                },
                { 
                    name: '未中标企业', 
                    type: 'line', 
                    smooth: true, 
                    data: tobinQData.control,
                    lineStyle: { width: 3 },
                    symbol: 'circle',
                    symbolSize: 6
                }
            ]
        };

        // 渲染图表
        chartRoe.setOption(optionRoe);
        chartTobinQ.setOption(optionTobinQ);

        // 侧边栏交互功能
        initSidebarInteraction();

        // 窗口大小调整
        window.addEventListener('resize', function () {
            chartRoe.resize();
            chartTobinQ.resize();
        });

        // 页面可见性检测（与PPT翻页系统协作）
        initVisibilityObserver();
    }

    function initSidebarInteraction() {
        const sidebarItems = document.querySelectorAll('#page11-container .sidebar-item');
        
        sidebarItems.forEach(item => {
            item.addEventListener('click', function() {
                // 移除所有active类
                sidebarItems.forEach(i => i.classList.remove('active'));
                // 添加active类到当前项
                this.classList.add('active');
                
                // 这里可以添加切换不同数据视图的逻辑
                // 目前是预留功能，可以根据需要扩展
                console.log('切换到:', this.textContent);
            });
        });
    }

    function initVisibilityObserver() {
        const page11Container = document.getElementById('page11-container');
        if (!page11Container) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 页面进入视口时，可以触发一些动画或数据更新
                    console.log('Page11 进入视口');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px'
        });

        observer.observe(page11Container);
    }

})(); 