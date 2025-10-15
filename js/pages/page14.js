document.addEventListener('DOMContentLoaded', function () {
    const pageContainer = document.querySelector('#page14-container');
    if (!pageContainer) {
        return;
    }

    const chartDom = pageContainer.querySelector('#main-chart');
    if (!chartDom) {
        return;
    }

    let myChart = null; // 初始为 null
    let chartInitialized = false; // 添加一个标志位，确保只初始化一次

    const btnA = pageContainer.querySelector('#btn-chart-a');
    const btnB = pageContainer.querySelector('#btn-chart-b');

    const optionA = {
        title: [
            {
                text: '全国范围集采前院内药品市场各批次销售额分布',
                left: 'center',
                top: '2%', 
                textStyle: { fontSize: 18, fontWeight: 'bold', color: '#3D405B' }
            },
            {
                text: '院内医疗\n机构合计',
                left: '50%',
                top: '57%', 
                textAlign: 'center',
                textStyle: {
                    fontSize: 20, 
                    color: '#666', 
                    fontWeight: 'normal' 
                }
            }
        ],
        tooltip: { show: false },
        legend: { orient: 'vertical', left: 'left', top: 'center', textStyle: { fontSize: 14 } },
        series: [
            {
                name: '销售额分布',
                type: 'pie',
                radius: ['50%', '75%'],
                center: ['50%', '60%'], 
                avoidLabelOverlap: true,
                label: {
                    show: true,
                    formatter: '{b}\n{d}%',
                    fontSize: 13,
                    minMargin: 5,
                    edgeDistance: 10,
                    lineHeight: 15
                },
                labelLine: { show: true, length: 15, length2: 10 },
                data: [
                    { value: 6.10, name: '第1批' }, { value: 2.80, name: '第2批' },
                    { value: 3.80, name: '第3批' }, { value: 3.20, name: '第4批' },
                    { value: 6.90, name: '第5批' }, { value: 2.00, name: '第6批' },
                    { value: 5.50, name: '第7批' }, { value: 4.50, name: '第8批' },
                    { value: 2.00, name: '第9批' }, { value: 63.10, name: '非集采' }
                ]
            }
        ],
        color: ['#8ECFC9', '#FFBE7A', '#FA7F6F', '#82B0D2', '#BEB8DC', '#E7DAD2', '#96C37D', '#F4A460', '#C0C0C0', '#D3D3D3']
    };

    const optionB = {
        title: {
            text: '1~8批集采品种院内渠道销售额变化（亿元）',
            left: 'center',
            textStyle: {
                fontSize: 16
            }
        },
        grid: {
            left: '3%',
            right: '5%',
            bottom: '3%',
            containLabel: true
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' }
        },
        xAxis: {
            type: 'category',
            data: ['2019年', '第1批', '第2批', '第3批', '第4批', '第5批', '第6批', '第7批', '2023年-第8批'],
            axisLabel: {
                interval: 0,
                rotate: 30
            }
        },
        yAxis: {
            type: 'value',
            name: '销售额 (亿元)'
        },
        series: [{
            name: '销售额',
            type: 'bar',
            data: [4623.4, 4165, 3913.8, 3641.8, 3433.5, 3106.6, 2992.2, 2617.8, 2547.6],
            barWidth: '60%',
            itemStyle: {
                color: 'var(--primary-color-1)'
            }
        }],
        graphic: {
            elements: [
                {
                    type: 'group',
                    right: '5%',
                    top: '12%',
                    children: [
                        {
                            type: 'ellipse',
                            shape: { cx: 0, cy: 0, rx: 105, ry: 25 },
                            style: { fill: '#81B29A' }
                        },
                        {
                            type: 'text',
                            style: {
                                text: '累计-2076（-44.9%）',
                                fill: '#fff',
                                font: 'bold 14px sans-serif'
                            },
                            left: 'center',
                            top: 'middle'
                        }
                    ]
                }
            ]
        }
    };

    function renderChart(type) {
        if (!myChart) { // 如果图表实例不存在，先初始化
            myChart = echarts.init(chartDom);
        }
        chartDom.style.opacity = 0;
        setTimeout(() => {
            myChart.clear(); // 使用 clear 替代 dispose，避免完全销毁
            
            if (type === 'A') {
                myChart.setOption(optionA);
                btnA.classList.add('active');
                btnB.classList.remove('active');
            } else {
                myChart.setOption(optionB);
                btnB.classList.add('active');
                btnA.classList.remove('active');
            }
            myChart.resize(); // 确保尺寸正确
            chartDom.style.opacity = 1;
        }, 300);
    }

    function initializeChart() {
        if (chartInitialized) return; // 如果已经初始化，则不重复执行
        chartInitialized = true;
        renderChart('A');
    }

    btnA.addEventListener('click', () => renderChart('A'));
    btnB.addEventListener('click', () => renderChart('B'));

    // 使用 MutationObserver 监听 is-active 类的变化
    const observer = new MutationObserver((mutationsList, observer) => {
        for(const mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const targetElement = mutation.target;
                if (targetElement.classList.contains('is-active')) {
                    // 页面变为激活状态，初始化图表
                    initializeChart();
                }
            }
        }
    });

    // 开始观察 pageContainer 的 class 属性变化
    observer.observe(pageContainer, { attributes: true });

    // 以防页面加载时就已经是 active（例如直接访问或刷新）
    if (pageContainer.classList.contains('is-active')) {
        initializeChart();
    }

    window.addEventListener('resize', function () {
        if (myChart) {
            myChart.resize();
        }
    });
});