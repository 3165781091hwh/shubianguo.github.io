// js/pages/page10.js (v2 - 采用 Origin2327 验证过的稳定逻辑)
(function() {
    // 严格遵循SOP，在 DOMContentLoaded 后执行
    document.addEventListener('DOMContentLoaded', () => {
        // 严格遵循SOP，获取页面根容器
        const pageContainer = document.getElementById('page10-container');
        
        // 如果页面容器不存在，则立即停止，避免在其他页面执行
        if (!pageContainer) {
            return;
        }

        // --- 以下为 Origin2327/page10.html 中经过验证的核心代码 ---

        const chart1Data = [ { year: 2000, total: 1488, tcm: 913 }, { year: 2009, total: 2127, tcm: 987 }, { year: 2017, total: 2535, tcm: 1238 }, { year: 2019, total: 2643, tcm: 1321 }, { year: 2020, total: 2800, tcm: 1374 }, { year: 2021, total: 2860, tcm: 1374 }, { year: 2022, total: 2967, tcm: 1381 }, { year: 2023, total: 3088, tcm: 1390 }, { year: 2024, total: 3159, tcm: 1394 } ];
        const chart2Data = [ { label: '抗肿瘤药和免疫机能调节药物', value: 29 }, { label: '神经系统药物', value: 15 }, { label: '消化系统与代谢药物', value: 15 }, { label: '系统用抗感染药物', value: 7 }, { label: '心血管系统药物', value: 7 }, { label: '呼吸系统药物', value: 5 }, { label: '血液和造血系统药物', value: 5 } ];

        // 严格遵循SOP，从页面根容器开始查询
        const chart1Container = pageContainer.querySelector('#chart1 .bar-chart-vertical');
        const chart2Container = pageContainer.querySelector('#chart2 .bar-chart-horizontal');

        // 确保容器存在
        if (!chart1Container || !chart2Container) {
            console.error('Page 10: Chart containers not found!');
            return;
        }

        // 清空现有内容，防止重复渲染
        chart1Container.innerHTML = '';
        chart2Container.innerHTML = '';

        const maxTotal = Math.max(...chart1Data.map(d => d.total));
        chart1Data.forEach(d => {
            const heightPercent = (d.total / maxTotal) * 100;
            const tcmHeightPercent = (d.tcm / d.total) * 100;
            // 采用原始文件中被验证过的正确HTML结构
            chart1Container.innerHTML += `<div class="bar-group"><div class="bar" style="height: 0%;" data-height="${heightPercent}%"><div class="bar-tcm" style="height: ${tcmHeightPercent}%;"></div><div class="bar-value" data-value="${d.total}">0</div></div><div class="bar-label">${d.year}</div></div>`;
        });

        const maxValue = Math.max(...chart2Data.map(d => d.value));
        chart2Data.forEach(d => {
            const widthPercent = (d.value / maxValue) * 100;
            chart2Container.innerHTML += `<div class="bar-row"><div class="bar-row-label">${d.label}</div><div class="bar-horizontal-wrapper"><div class="bar-horizontal" style="width: 0%;" data-width="${widthPercent}%"><span class="bar-horizontal-value" data-value="${d.value}">0</span></div></div></div>`;
        });

        // 数字滚动动画函数
        function animateValue(element, start, end, duration) {
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
        
        // 动画序列编排
        const runAnimations = () => {
            // 严格遵循SOP，从页面根容器开始查询
            const stPatient = pageContainer.querySelector('#st-patient');
            const stIndustry = pageContainer.querySelector('#st-industry');
            const stSociety = pageContainer.querySelector('#st-society');
            const chart1 = pageContainer.querySelector('#chart1');
            const chart2 = pageContainer.querySelector('#chart2');
            const summary = pageContainer.querySelector('#summary');
            const conclusion = pageContainer.querySelector('#conclusion');

            // 确保所有动画元素都存在
            const allElementsExist = stPatient && stIndustry && stSociety && chart1 && chart2 && summary && conclusion;
            if (!allElementsExist) {
                console.error('Page 10: One or more animation elements not found!');
                return;
            }

            const sequence = [
                () => { stPatient.classList.add('is-visible'); },
                () => { stIndustry.classList.add('is-visible'); },
                () => { stSociety.classList.add('is-visible'); },
                () => {
                    chart1.classList.add('is-visible');
                    Array.from(chart1.querySelectorAll('.bar')).forEach((el, i) => {
                        setTimeout(() => {
                            el.style.height = el.dataset.height;
                            const valueEl = el.querySelector('.bar-value');
                            animateValue(valueEl, 0, parseInt(valueEl.dataset.value), 1200);
                        }, i * 80);
                    });
                },
                () => {
                    chart1.classList.add('is-dimmed');
                    chart2.classList.add('is-visible');
                    Array.from(chart2.querySelectorAll('.bar-row')).forEach((el, i) => {
                        setTimeout(() => {
                            el.classList.add('is-visible');
                            const bar = el.querySelector('.bar-horizontal');
                            bar.style.width = bar.dataset.width;
                            const valueEl = el.querySelector('.bar-horizontal-value');
                            animateValue(valueEl, 0, parseInt(valueEl.dataset.value), 1200);
                        }, i * 120);
                    });
                },
                () => {
                    chart2.classList.add('is-dimmed');
                    summary.classList.add('is-visible');
                },
                () => {
                    summary.classList.add('is-dimmed');
                    conclusion.classList.add('is-visible');
                }
            ];

            const delays = [100, 200, 300, 500, 1900, 2200, 2400];
            sequence.forEach((action, index) => {
                setTimeout(action, delays[index]);
            });
        };

        // 修改：不再使用 MutationObserver，而是在页面加载后，
        // 如果页面初始就是激活状态，或者在未来某个时刻被激活，就执行一次动画。
        // 这是一个更健壮的折中方案。
        let animationHasRun = false;
        const observer = new MutationObserver(() => {
            if (pageContainer.classList.contains('is-active') && !animationHasRun) {
                animationHasRun = true;
                // 延迟一小段时间启动动画，给页面过渡动画留出时间
                setTimeout(runAnimations, 300);
                observer.disconnect(); // 动画只播放一次
            }
        });

        // 立即检查一次，以防页面加载时就是激活状态
        if (pageContainer.classList.contains('is-active') && !animationHasRun) {
            animationHasRun = true;
            setTimeout(runAnimations, 300);
        } else {
            // 如果不是，则开始观察
            observer.observe(pageContainer, { attributes: true, attributeFilter: ['class'] });
        }
    });
})();
