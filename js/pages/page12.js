// js/pages/page12.js - 经过适配和冲突隔离的全新版本
document.addEventListener('DOMContentLoaded', function () {
    const page12_container = document.getElementById('page12-container');
    if (!page12_container) { return; }

    // --- 适配点1：硬编码颜色变量 ---
    // 移除对CSS变量的依赖，确保在任何CSS结构下都能正确渲染图表颜色。
    const colors = {
        color1: '#3D405B',
        color2: '#E07A5F'
    };

    // --- 初始化 ECharts 实例 ---
    // 使用 a-z 的前缀确保变量名在全局作用域内是唯一的，虽然有闭包但这是个好习惯
    const p12_chartA = echarts.init(page12_container.querySelector('#chartA'));
    const p12_chartB1 = echarts.init(page12_container.querySelector('#chartB1'));
    const p12_chartB2 = echarts.init(page12_container.querySelector('#chartB2'));
    const p12_chartB3 = echarts.init(page12_container.querySelector('#chartB3'));
    const p12_chartB4 = echarts.init(page12_container.querySelector('#chartB4'));
    const p12_allCharts = [p12_chartA, p12_chartB1, p12_chartB2, p12_chartB3, p12_chartB4];

    // --- 数据准备 (与原文件相同) ---
    const dataA = {
        names: ['人血白蛋白', '氯化钠注射液', '静注人免疫球蛋白(PH4)', '贝伐珠单抗注射液', '阿托伐他汀钙片', '注射用哌拉西林钠他唑巴坦钠', '葡萄糖注射液', '硫酸氢氯吡格雷片', '达格列净片', '甲磺酸奥希替尼片', '他克莫司胶囊', '苯磺酸氨氯地平片', '注射用头孢哌酮钠舒巴坦钠', '利妥昔单抗注射液', '硝苯地平控释片', '替雷利珠单抗注射液', '丁苯酞氯化钠注射液', '重组人血小板生成素注射液', '司美格鲁肽注射液', '聚乙二醇化重组人粒细胞刺激因子注射液'],
        growth5Year: [9.29, 6.19, 10.77, 31.88, -4.7, 6.23, 1.67, -10.64, 78.88, 9.53, 3.53, -3.37, 4.65, 3.92, -6.76, 150.15, 6.85, 12.53, 113.85, 7.98],
        growthYoY: [-2.86, 6.78, -0.27, 28.48, -0.48, 0.4, 0.84, 0.64, 27.44, 2.42, -2.33, -1.21, -16.92, 9.7, -24.51, 36.66, -3.33, 9.72, 43.11, -6.88]
    };
    const dataB = {
        b1: { title: '未中选 - 原研', batches: ['第一批', '第二批', '第三批', '第四批', '第五批', '第七批', '第八批'], pre: [159, 48, 136, 124, 184, 172, 66], post: [89, 17, 58, 46, 70, 94, 27], change: [-44.4, -65.3, -57.5, -62.8, -61.9, -45.6, -58.3] },
        b2: { title: '中选 - 原研', batches: ['第一批', '第二批', '第三批', '第四批', '第五批', '第七批', '第八批'], pre: [73, 38, 8, 8, 48, 13, 14], post: [36, 7, 2, 2, 24, 4, 7], change: [-51.4, -81.6, -59.3, -72.3, -50.6, -71.1, -43] },
        b3: { title: '未中选 - 仿制', batches: ['第一批', '第二批', '第三批', '第四批', '第五批', '第七批', '第八批'], pre: [130, 65, 108, 124, 228, 135, 258], post: [48, 12, 38, 36, 62, 60, 121], change: [-63, -82, -64.8, -71.1, -73.1, -55.3, -53.3] },
        b4: { title: '中选 - 仿制', batches: ['第一批', '第二批', '第三批', '第四批', '第五批', '第七批', '第八批'], pre: [185, 47, 75, 60, 159, 146, 146], post: [136, 52, 60, 78, 168, 99, 119], change: [-26.3, 9.1, 19.8, 30.2, 5.8, -31.9, -18.2] }
    };
    const redLabels = ['甲磺酸奥希替尼片', '替雷利珠单抗注射液', '丁苯酞氯化钠注射液', '重组人血小板生成素注射液', '司美格鲁肽注射液'];

    // --- 配置图表A (逻辑与原文件相同) ---
    const optionA = {
        title: { text: '2023H2-2024H1中国院内外TOP20药品销售情况', left: 'center', top: '5%', textStyle: { fontSize: 28, fontWeight: 'bold' } },
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: function (params) { const drugName = dataA.names[params[0].dataIndex]; let tooltipString = `${drugName}<br/>`; params.forEach(param => { tooltipString += `${param.marker} ${param.seriesName}: ${param.value}<br/>`; }); return tooltipString; } },
        legend: { bottom: '2%', textStyle: { fontSize: 14 } },
        grid: { left: '3%', right: '4%', bottom: '12%', top: '22%', containLabel: true },
        xAxis: [{ type: 'category', data: dataA.names, axisTick: { show: false }, axisLine: { show: false }, axisLabel: { interval: 0, rotate: 30, fontSize: 11, formatter: function(value) { let shortenedValue = value.length > 10 ? value.substring(0, 10) + '...' : value; if (redLabels.includes(value)) { return `{red|${shortenedValue}}`; } return shortenedValue; }, rich: { red: { color: '#E63946' } } } }],
        yAxis: [{ type: 'value', name: '增速 (%)', show: false }],
        graphic: { type: 'text', right: '4%', bottom: '3%', style: { text: '*标红药品为独家在售品种', fill: '#888', fontSize: 12, fontWeight: 'normal' } },
        series: [ { name: '5 年增速（%）', type: 'bar', barGap: 0, emphasis: { focus: 'series' }, data: dataA.growth5Year, color: colors.color1, label: { show: true, position: 'top', fontSize: 9, color: colors.color1 } }, { name: '同比增长率（%）', type: 'bar', emphasis: { focus: 'series' }, data: dataA.growthYoY, color: colors.color2, label: { show: true, position: 'top', fontSize: 9, color: colors.color2 } } ]
    };
    p12_chartA.setOption(optionA);

    // --- 配置图表B (通用函数，逻辑与原文件相同) ---
    const getOptionB = (data) => {
        const labelData = data.pre.map((val, i) => Math.max(val, data.post[i]) + 5);
        return {
            title: { text: data.title, left: 'center', top: '5%', textStyle: { fontSize: 18, fontWeight: 'normal' } },
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: function (params) { let tooltipString = `${params[0].axisValueLabel}<br/>`; params.forEach(param => { if (param.seriesName !== '变化率') { tooltipString += `${param.marker} ${param.seriesName}: ${param.value}<br/>`; } }); return tooltipString; } },
            grid: { left: '5%', right: '5%', bottom: '10%', top: '25%', containLabel: true },
            xAxis: { type: 'category', data: data.batches, axisTick: { show: false }, axisLine: { show: false }, },
            yAxis: { type: 'value', show: false },
            series: [ { name: '集采前销售额(亿元)', type: 'bar', barWidth: '30%', data: data.pre, color: colors.color1, barGap: '10%' }, { name: '集采后销售额(亿元)', type: 'bar', barWidth: '30%', data: data.post, color: colors.color2 }, { name: '变化率', type: 'pictorialBar', symbol: 'circle', symbolSize: [0, 0], itemStyle: { color: 'transparent' }, label: { show: true, position: 'top', formatter: (params) => `${data.change[params.dataIndex]}%`, fontSize: 12, fontWeight: 'bold', color: '#fff', backgroundColor: data.change[0] > -50 ? 'rgba(61, 64, 91, 0.7)' : 'rgba(224, 122, 95, 0.7)', padding: [4, 6], borderRadius: 20, }, data: labelData, z: 10 } ]
        };
    };
    p12_chartB1.setOption(getOptionB(dataB.b1));
    p12_chartB2.setOption(getOptionB(dataB.b2));
    p12_chartB3.setOption(getOptionB(dataB.b3));
    p12_chartB4.setOption(getOptionB(dataB.b4));

    // --- 分页切换逻辑 (逻辑与原文件相同) ---
    const btnA = page12_container.querySelector('#btnA');
    const btnB = page12_container.querySelector('#btnB');
    const contentA = page12_container.querySelector('#contentA');
    const contentB = page12_container.querySelector('#contentB');

    btnA.addEventListener('click', () => {
        btnA.classList.add('active');
        btnB.classList.remove('active');
        contentA.classList.add('active');
        contentB.classList.remove('active');
        p12_chartA.resize();
    });

    btnB.addEventListener('click', () => {
        btnB.classList.add('active');
        btnA.classList.remove('active');
        contentB.classList.add('active');
        contentA.classList.remove('active');
        [p12_chartB1, p12_chartB2, p12_chartB3, p12_chartB4].forEach(chart => chart.resize());
    });

    // --- 适配点2：优化窗口大小调整的事件监听 ---
    // 只有当Page12是当前活动页面时，才执行图表重绘，避免不必要的性能消耗。
    window.addEventListener('resize', function () {
        // 关键检查：确保页面处于激活状态
        if (page12_container && page12_container.classList.contains('is-active')) {
            p12_allCharts.forEach(chart => chart.resize());
        }
    });
});