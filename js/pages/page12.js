/* =================================================================== */
/*                            PAGE12 脚本                               */
/* =================================================================== */

(function() {
    'use strict';

    // 等待DOM加载完成
    document.addEventListener('DOMContentLoaded', function () {
        // 获取页面容器
        const page12Container = document.getElementById('page12-container');
        
        // 检查页面是否存在
        if (!page12Container) {
            console.error('Page12 container not found');
            return;
        }

        // --- 颜色变量 ---
        const colors = {
            color1: getComputedStyle(document.documentElement).getPropertyValue('--primary-color-1').trim(),
            color2: getComputedStyle(document.documentElement).getPropertyValue('--primary-color-2').trim()
        };

        // --- 初始化 ECharts 实例 ---
        const chartA = echarts.init(document.getElementById('chartA'));
        const chartB1 = echarts.init(document.getElementById('chartB1'));
        const chartB2 = echarts.init(document.getElementById('chartB2'));
        const chartB3 = echarts.init(document.getElementById('chartB3'));
        const chartB4 = echarts.init(document.getElementById('chartB4'));
        const allCharts = [chartA, chartB1, chartB2, chartB3, chartB4];

        // --- 数据准备 ---
        // 图表A数据
        const dataA = {
            names: ['人血白蛋白', '氯化钠注射液', '静注人免疫球蛋白(PH4)', '贝伐珠单抗注射液', '阿托伐他汀钙片', '注射用哌拉西林钠他唑巴坦钠', '葡萄糖注射液', '硫酸氢氯吡格雷片', '达格列净片', '甲磺酸奥希替尼片', '他克莫司胶囊', '苯磺酸氨氯地平片', '注射用头孢哌酮钠舒巴坦钠', '利妥昔单抗注射液', '硝苯地平控释片', '替雷利珠单抗注射液', '丁苯酞氯化钠注射液', '重组人血小板生成素注射液', '司美格鲁肽注射液', '聚乙二醇化重组人粒细胞刺激因子注射液'],
            growth5Year: [9.29, 6.19, 10.77, 31.88, -4.7, 6.23, 1.67, -10.64, 78.88, 9.53, 3.53, -3.37, 4.65, 3.92, -6.76, 150.15, 6.85, 12.53, 113.85, 7.98],
            growthYoY: [-2.86, 6.78, -0.27, 28.48, -0.48, 0.4, 0.84, 0.64, 27.44, 2.42, -2.33, -1.21, -16.92, 9.7, -24.51, 36.66, -3.33, 9.72, 43.11, -6.88]
        };

        // 图表B数据
        const dataB = {
            b1: { title: '未中选 - 原研', batches: ['第一批', '第二批', '第三批', '第四批', '第五批', '第七批', '第八批'], pre: [159, 48, 136, 124, 184, 172, 66], post: [89, 17, 58, 46, 70, 94, 27], change: [-44.4, -65.3, -57.5, -62.8, -61.9, -45.6, -58.3] },
            b2: { title: '中选 - 原研', batches: ['第一批', '第二批', '第三批', '第四批', '第五批', '第七批', '第八批'], pre: [73, 38, 8, 8, 48, 13, 14], post: [36, 7, 2, 2, 24, 4, 7], change: [-51.4, -81.6, -59.3, -72.3, -50.6, -71.1, -43] },
            b3: { title: '未中选 - 仿制', batches: ['第一批', '第二批', '第三批', '第四批', '第五批', '第七批', '第八批'], pre: [130, 65, 108, 124, 228, 135, 258], post: [48, 12, 38, 36, 62, 60, 121], change: [-63, -82, -64.8, -71.1, -73.1, -55.3, -53.3] },
            b4: { title: '中选 - 仿制', batches: ['第一批', '第二批', '第三批', '第四批', '第五批', '第七批', '第八批'], pre: [185, 47, 75, 60, 159, 146, 146], post: [136, 52, 60, 78, 168, 99, 119], change: [-26.3, 9.1, 19.8, 30.2, 5.8, -31.9, -18.2] }
        };
        
        // 定义需要标红的药品列表
        const redLabels = ['甲磺酸奥希替尼片', '替雷利珠单抗注射液', '丁苯酞氯化钠注射液', '重组人血小板生成素注射液', '司美格鲁肽注射液'];

        // --- 配置图表A ---
        const optionA = {
            title: {
                text: '2023H2-2024H1中国院内外TOP20药品销售情况',
                left: 'center',
                top: '5%',
                textStyle: { fontSize: 28, fontWeight: 'bold' }
            },
            tooltip: { 
                trigger: 'axis', 
                axisPointer: { type: 'shadow' },
                formatter: function (params) {
                    const drugName = dataA.names[params[0].dataIndex];
                    let tooltipString = `${drugName}<br/>`;
                    params.forEach(param => {
                        tooltipString += `${param.marker} ${param.seriesName}: ${param.value}<br/>`;
                    });
                    return tooltipString;
                }
            },
            legend: { bottom: '2%', textStyle: { fontSize: 14 } },
            grid: { left: '3%', right: '4%', bottom: '12%', top: '22%', containLabel: true },
            xAxis: [{
                type: 'category',
                data: dataA.names,
                axisTick: { show: false },
                axisLine: { show: false },
                axisLabel: { 
                    interval: 0, 
                    rotate: 30, 
                    fontSize: 11,
                    formatter: function(value) {
                        let shortenedValue = value.length > 10 ? value.substring(0, 10) + '...' : value;
                        if (redLabels.includes(value)) {
                            return `{red|${shortenedValue}}`;
                        }
                        return shortenedValue;
                    },
                    rich: {
                        red: {
                            color: '#E63946'
                        }
                    }
                }
            }],
            yAxis: [{ type: 'value', name: '增速 (%)', show: false }],
            graphic: {
                type: 'text',
                right: '4%',
                bottom: '3%',
                style: {
                    text: '*标红药品为独家在售品种',
                    fill: '#888',
                    fontSize: 12,
                    fontWeight: 'normal'
                }
            },
            series: [
                { 
                    name: '5 年增速（%）', 
                    type: 'bar', 
                    barGap: 0, 
                    emphasis: { focus: 'series' }, 
                    data: dataA.growth5Year, 
                    color: colors.color1,
                    label: { show: true, position: 'top', fontSize: 9, color: colors.color1 }
                },
                { 
                    name: '同比增长率（%）', 
                    type: 'bar', 
                    emphasis: { focus: 'series' }, 
                    data: dataA.growthYoY, 
                    color: colors.color2,
                    label: { show: true, position: 'top', fontSize: 9, color: colors.color2 }
                }
            ]
        };
        chartA.setOption(optionA);

        // --- 配置图表B (通用函数) ---
        const getOptionB = (data) => {
            const labelData = data.pre.map((val, i) => Math.max(val, data.post[i]) + 5);
            return {
                title: {
                    text: data.title,
                    left: 'center',
                    top: '5%',
                    textStyle: { fontSize: 18, fontWeight: 'normal' }
                },
                tooltip: { 
                    trigger: 'axis', 
                    axisPointer: { type: 'shadow' },
                    formatter: function (params) {
                        let tooltipString = `${params[0].axisValueLabel}<br/>`;
                        params.forEach(param => {
                            if (param.seriesName !== '变化率') {
                                tooltipString += `${param.marker} ${param.seriesName}: ${param.value}<br/>`;
                            }
                        });
                        return tooltipString;
                    }
                },
                grid: { left: '5%', right: '5%', bottom: '10%', top: '25%', containLabel: true },
                xAxis: {
                    type: 'category',
                    data: data.batches,
                    axisTick: { show: false },
                    axisLine: { show: false },
                },
                yAxis: { type: 'value', show: false },
                series: [
                    { name: '集采前销售额(亿元)', type: 'bar', barWidth: '30%', data: data.pre, color: colors.color1, barGap: '10%' },
                    { name: '集采后销售额(亿元)', type: 'bar', barWidth: '30%', data: data.post, color: colors.color2 },
                    {
                        name: '变化率',
                        type: 'pictorialBar',
                        symbol: 'circle',
                        symbolSize: [0, 0], 
                        itemStyle: { color: 'transparent' },
                        label: {
                            show: true,
                            position: 'top',
                            formatter: (params) => `${data.change[params.dataIndex]}%`,
                            fontSize: 12,
                            fontWeight: 'bold',
                            color: '#fff',
                            backgroundColor: data.change[0] > -50 ? 'rgba(61, 64, 91, 0.7)' : 'rgba(224, 122, 95, 0.7)',
                            padding: [4, 6],
                            borderRadius: 20,
                        },
                        data: labelData,
                        z: 10
                    }
                ]
            };
        };

        // 设置图表B的选项
        chartB1.setOption(getOptionB(dataB.b1));
        chartB2.setOption(getOptionB(dataB.b2));
        chartB3.setOption(getOptionB(dataB.b3));
        chartB4.setOption(getOptionB(dataB.b4));

        // --- 分页切换逻辑 ---
        const btnA = document.getElementById('btnA');
        const btnB = document.getElementById('btnB');
        const contentA = document.getElementById('contentA');
        const contentB = document.getElementById('contentB');

        btnA.addEventListener('click', () => {
            btnA.classList.add('active');
            btnB.classList.remove('active');
            contentA.classList.add('active');
            contentB.classList.remove('active');
            chartA.resize();
        });

        btnB.addEventListener('click', () => {
            btnB.classList.add('active');
            btnA.classList.remove('active');
            contentB.classList.add('active');
            contentA.classList.remove('active');
            [chartB1, chartB2, chartB3, chartB4].forEach(chart => chart.resize());
        });

        // --- 侧边栏交互 ---
        const sidebarItems = document.querySelectorAll('#page12-container .sidebar-item');
        sidebarItems.forEach(item => {
            item.addEventListener('click', function() {
                // 移除所有active类
                sidebarItems.forEach(si => si.classList.remove('active'));
                // 添加active类到当前点击项
                this.classList.add('active');
            });
        });

        // --- 窗口大小调整 ---
        window.addEventListener('resize', function () {
            allCharts.forEach(chart => chart.resize());
        });

        // --- 页面可见性检测 ---
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 页面进入视口时，重新调整图表大小
                    setTimeout(() => {
                        allCharts.forEach(chart => chart.resize());
                    }, 100);
                }
            });
        }, {
            threshold: 0.1
        });

        observer.observe(page12Container);

        console.log('Page12 script loaded successfully');
    });

})(); 