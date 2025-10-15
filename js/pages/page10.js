/* =================================================================== */
/*                            PAGE10 脚本                               */
/*                    药品质量与可及性得到保证页面                        */
/* =================================================================== */

(function() {
    'use strict';
    
    // 等待DOM加载完成
    document.addEventListener('DOMContentLoaded', () => {
        // 检查页面是否存在
        const page10Container = document.getElementById('page10-container');
        if (!page10Container) {
            console.warn('Page10 container not found');
            return;
        }
        
        // 数据定义
        const chart1Data = [
            { year: 2000, total: 1488, tcm: 913 },
            { year: 2009, total: 2127, tcm: 987 },
            { year: 2017, total: 2535, tcm: 1238 },
            { year: 2019, total: 2643, tcm: 1321 },
            { year: 2020, total: 2800, tcm: 1374 },
            { year: 2021, total: 2860, tcm: 1374 },
            { year: 2022, total: 2967, tcm: 1381 },
            { year: 2023, total: 3088, tcm: 1390 },
            { year: 2024, total: 3159, tcm: 1394 }
        ];
        
        const chart2Data = [
            { label: '抗肿瘤药和免疫机能调节药物', value: 29 },
            { label: '神经系统药物', value: 15 },
            { label: '消化系统与代谢药物', value: 15 },
            { label: '系统用抗感染药物', value: 7 },
            { label: '心血管系统药物', value: 7 },
            { label: '呼吸系统药物', value: 5 },
            { label: '血液和造血系统药物', value: 5 }
        ];
        
        // 初始化图表
        initializeCharts();
        
        // 设置动画序列
        setupAnimationSequence();
    });
    
    /**
     * 初始化图表
     */
    function initializeCharts() {
        // 初始化图表1：垂直柱状图
        const chart1Container = document.querySelector('#page10-container #chart1 .bar-chart-vertical');
        if (chart1Container) {
            const maxTotal = Math.max(...chart1Data.map(d => d.total));
            chart1Data.forEach(d => {
                const heightPercent = (d.total / maxTotal) * 100;
                const tcmHeightPercent = (d.tcm / d.total) * 100;
                chart1Container.innerHTML += `
                    <div class="bar-group">
                        <div class="bar" style="height: 0%;" data-height="${heightPercent}%">
                            <div class="bar-tcm" style="height: ${tcmHeightPercent}%;"></div>
                            <div class="bar-value" data-value="${d.total}">0</div>
                        </div>
                        <div class="bar-label">${d.year}</div>
                    </div>
                `;
            });
        }
        
        // 初始化图表2：水平条形图
        const chart2Container = document.querySelector('#page10-container #chart2 .bar-chart-horizontal');
        if (chart2Container) {
            const maxValue = Math.max(...chart2Data.map(d => d.value));
            chart2Data.forEach(d => {
                const widthPercent = (d.value / maxValue) * 100;
                chart2Container.innerHTML += `
                    <div class="bar-row">
                        <div class="bar-row-label">${d.label}</div>
                        <div class="bar-horizontal-wrapper">
                            <div class="bar-horizontal" style="width: 0%;" data-width="${widthPercent}%">
                                <span class="bar-horizontal-value" data-value="${d.value}">0</span>
                            </div>
                        </div>
                    </div>
                `;
            });
        }
    }
    
    /**
     * 数字滚动动画函数
     * @param {HTMLElement} element - 要动画的元素
     * @param {number} start - 起始值
     * @param {number} end - 结束值
     * @param {number} duration - 动画持续时间（毫秒）
     */
    function animateValue(element, start, end, duration) {
        if (!element) return;
        
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            element.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
    
    /**
     * 设置动画序列
     */
    function setupAnimationSequence() {
        // 获取页面元素
        const stPatient = document.querySelector('#page10-container #st-patient');
        const stIndustry = document.querySelector('#page10-container #st-industry');
        const stSociety = document.querySelector('#page10-container #st-society');
        const chart1 = document.querySelector('#page10-container #chart1');
        const chart2 = document.querySelector('#page10-container #chart2');
        const summary = document.querySelector('#page10-container #summary');
        const conclusion = document.querySelector('#page10-container #conclusion');
        
        // 检查元素是否存在
        if (!stPatient || !stIndustry || !stSociety || !chart1 || !chart2 || !summary || !conclusion) {
            console.warn('Some page10 elements not found');
            return;
        }
        
        // 动画序列定义
        const sequence = [
            // 1. 场景建立: 左侧关键词
            () => { 
                stPatient.classList.add('is-visible'); 
            },
            () => { 
                stIndustry.classList.add('is-visible'); 
            },
            () => { 
                stSociety.classList.add('is-visible'); 
            },
            
            // 2. 焦点1: 医保目录数量图表
            () => {
                chart1.classList.add('is-visible');
                Array.from(chart1.querySelectorAll('.bar')).forEach((el, i) => {
                    setTimeout(() => {
                        el.style.height = el.dataset.height;
                        const valueEl = el.querySelector('.bar-value');
                        if (valueEl) {
                            animateValue(valueEl, 0, parseInt(valueEl.dataset.value), 1200);
                        }
                    }, i * 80);
                });
            },

            // 3. 焦点2: 新增药品分类图表
            () => {
                chart1.classList.add('is-dimmed'); // 将上一个焦点变暗
                chart2.classList.add('is-visible');
                Array.from(chart2.querySelectorAll('.bar-row')).forEach((el, i) => {
                    setTimeout(() => {
                        el.classList.add('is-visible');
                        const bar = el.querySelector('.bar-horizontal');
                        if (bar) {
                            bar.style.width = bar.dataset.width;
                        }
                        const valueEl = el.querySelector('.bar-horizontal-value');
                        if (valueEl) {
                            animateValue(valueEl, 0, parseInt(valueEl.dataset.value), 1200);
                        }
                    }, i * 120);
                });
            },

            // 4. 焦点3: 说明文案
            () => {
                chart2.classList.add('is-dimmed'); // 将上一个焦点变暗
                summary.classList.add('is-visible');
            },

            // 5. 最终结论
            () => {
                summary.classList.add('is-dimmed');
                conclusion.classList.add('is-visible');
            }
        ];

        // 动画延迟时间
        const delays = [200, 400, 600, 1000, 3500, 5500, 6800];
        
        // 执行动画序列
        sequence.forEach((action, index) => {
            setTimeout(action, delays[index]);
        });
    }
    
    /**
     * 页面可见性检测（与PPT翻页系统协作）
     */
    function handlePageVisibility() {
        const page10Container = document.getElementById('page10-container');
        if (!page10Container) return;
        
        // 使用IntersectionObserver检测页面可见性
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 页面进入视口时，可以触发一些初始化逻辑
                    console.log('Page10 is now visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px'
        });
        
        observer.observe(page10Container);
    }
    
    // 初始化页面可见性检测
    handlePageVisibility();
    
})(); 