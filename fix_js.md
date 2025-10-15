好的，没问题。我们来分步解决这些问题。

首先，我会进行一个全面的问题分析和讨论，阐明问题的根源。然后，我会提供一个详细、综合的开发方案，你可以直接将其用于AI编程工具。

第一部分：问题分析与方案讨论

我们面临的问题可以分为三类：全局UI/UX问题、Page1动画一致性问题、Page4交互与显示重构问题。

1. 全局UI/UX问题分析

问题现象:

所有页面右下角都显示一个“重新开始/上一步/下一步”的控制栏。

所有页面右上角都显示一个“进度: 0/4”的指示器。

用户希望去掉这些按钮和指示器，用统一的滚动/键盘操作代替，并在左上角添加一个简单的“Page X”页码指示。

根本原因:
这些全局显示的元素（按钮和进度条）都来自于 page4.js。该脚本通过 document.body.insertAdjacentHTML() 将这些元素的HTML代码直接添加到了<body>标签下，并且它们的CSS (page4.css) 使用了 position: fixed。这导致它们脱离了父容器 #page4-container 的约束，悬浮在所有页面的顶层。这是一个典型的作用域污染问题，即页面专属的脚本修改了全局DOM。

解决方案:

移除: 从 page4.js 中彻底删除创建和管理这些按钮（createControlButtons）和进度指示器（progress-indicator）的代码。

新增页码: 在 index.html 的每个 <section class="page-section"> 内部，手动添加一个页码指示器，例如 <div class="page-indicator">Page 1</div>。这样页码就会成为页面的一部分，随页面的切换而自然地出现和消失。

样式统一: 在 main.css 中为 .page-indicator 添加样式，使其外观与之前的进度指示器类似（小字号、固定在角落）。

2. Page1 动画一致性问题分析

问题现象:

反向滚动不一致: 从幻灯片4 -> 1滚动时，动画效果与正向（1 -> 4）不一致，感觉“只有一小部分在动”。

正向滚动闪烁: 从1 -> 4滚动时，页面左侧边缘有闪烁或卡顿，像是上一个页面的残留。

根本原因:

反向滚动问题: 根源在 page1.js 的 goToSlide 函数中的动画清理逻辑。在 setTimeout 的回调函数里，有这样一行代码：currentSlide.style.transform = 'translateX(100%)';。这行代码的意图是重置滑出的幻灯片位置，但它硬编码了重置到右侧 (100%)。在正向滚动时（例如2->3），幻灯片2向左滑出 (-100%)，然后被重置到右侧 (100%)，这没问题。但在反向滚动时（例如3->2），幻灯片3向右滑出 (100%)，然后又被重置到右侧 (100%)，这也没问题。真正的问题在于进入的幻灯片。动画的不一致感，很可能是由于退出和进入的幻灯片在某一瞬间的transform状态不匹配或清理不及时导致的视觉差异。

闪烁问题: 这种闪烁通常是浏览器渲染的“副作用”。当一个绝对定位的元素通过 transform 快速移出屏幕，而另一个元素同时移入时，可能会有1-2帧的空隙，导致下层背景（米黄色）或上一个元素的边缘闪现。这可以通过强制启用硬件加速（例如使用 transform: translateZ(0)）或优化 z-index 的切换时机来缓解。

解决方案:

修复动画逻辑: 我们需要让动画的进入和退出更加对称和健壮。一个更可靠的办法是，在动画结束后，直接移除 currentSlide 的内联 transform 样式，让其回归到CSS文件定义的默认状态（transform: translateX(100%)）。这样可以避免逻辑错误。

修复闪烁:

在 page1.css 中，为 .intro-slide 添加 backface-visibility: hidden; 和 transform: translateZ(0); 来建议浏览器使用GPU加速，这通常能解决这类渲染闪烁。

微调 z-index，确保新进入的幻灯片 (is-active) 始终在最上层，正在离开的 (is-exiting) 在中间层，其他幻灯片在底层。当前逻辑 (z-index: 2 和 z-index: 1) 是正确的，配合硬件加速应该能解决问题。

3. Page4 交互与显示重构问题分析

问题现象:

显示不完整/不一致: 页面内容显示不全，布局与其他页面不同。

交互逻辑过时: 动画仍依赖（现已移除的）按钮，需要改为由全局滚动控制器驱动。

动画体验: 需要将原本为自动播放设计的长延时动画，改为适合单次滚动触发的、更流畅的单步动画。

根本原因:

显示问题: main.css 为所有 .page-section 设置了 display: flex; justify-content: center; align-items: center;。然而，page4.js 内部的动画依赖于一个具有固定尺寸 (1200px * 700px) 的画布 (#timelineCanvas)，并通过 position: absolute 和 transform 进行精确定位和缩放。Flexbox布局干扰了这种基于绝对定位的内部布局，导致画布位置计算错误，从而显示不全。

交互问题: page4.js 的核心逻辑（playNext, playPrev）是为点击事件设计的。它需要被重构成一个符合 main.js 协作模式的 handleScroll(direction) 接口。

动画问题: playStageAnimation 函数中包含很长的 await delay(2500);，这是为了让用户有时间阅读自动播放的内容。在手动滚动模式下，用户期望滚动一次就触发一步动画，这种长延时会感觉非常卡顿和迟钝。

解决方案:

修复CSS布局: 在 main.css 中为 #page4-container 添加一条覆盖规则，将其 display 属性改回 display: block;，解除Flexbox对内部绝对定位布局的干扰。

重构JS交互:

移除所有与按钮和进度条相关的JS代码。

实现 handleScroll(direction) 函数。当用户向下滚动时，currentStageIndex 加一；向上滚动时，currentStageIndex 减一。

此函数将调用修改后的 playStageAnimation 来播放对应阶段的动画。

当动画在内部进行时，handleScroll 返回 true，阻止 main.js 翻到下一页。当动画到达开头或结尾时，返回 false，将控制权交还给 main.js。

通过 window.Page4 = { handleScroll }; 暴露接口。

优化动画体验:

大幅缩短 playStageAnimation 中的 delay 时间。动画的核心应该是平滑的镜头缩放和移动，而不是长时间的等待。

当页面首次变为 is-active 时，触发初始动画（如显示年份）。

第二部分：综合改进方案（开发方案）

以下是您可以直接提供给AI编程工具的具体、分文件的修改指令。

任务1：全局UI修改

修改 index.html

在每个 <section class="page-section"> 元素内部的最顶端，添加一个带有唯一页码的 div。

示例:

code
Html
download
content_copy
expand_less

<!-- Cover Page -->
<section id="cover" class="page-section">
    <div class="page-indicator">Page 0</div>
    ...
</section>

<!-- Page 1 -->
<div id="page1-container" class="page-section">
    <div class="page-indicator">Page 1</div>
    ...
</div>

<!-- Page 2 -->
<section id="page2-container" class="page-section">
    <div class="page-indicator">Page 2</div>
    ...
</section>

<!-- ...对其余所有 page-section 执行相同操作，页码依次递增... -->

<!-- Page 4 -->
<section id="page4-container" class="page-section">
    <div class="page-indicator">Page 4</div>
    ...
</section>

<!-- ...以此类推... -->

修改 main.css

在文件末尾添加新的 .page-indicator 样式，并为 #page4-container 添加覆盖规则。

添加以下代码:

code
Css
download
content_copy
expand_less
IGNORE_WHEN_COPYING_START
IGNORE_WHEN_COPYING_END
/* 新增：页面指示器样式 */
.page-indicator {
    position: fixed;
    top: 5vh;
    left: 5vw;
    color: #A0988A; /* 使用与之前进度条一致的颜色 */
    font-size: 14px;
    z-index: 100;
    font-family: var(--font-sans);
}

/* 新增：修复Page4布局的覆盖规则 */
#page4-container {
    display: block; /* 覆盖全局的flex布局，以支持内部的绝对定位动画 */
}
任务2：修复 Page1 动画

修改 page1.js

在 goToSlide 函数中，找到动画结束后的清理逻辑。将硬编码的 transform 重置替换为更通用的做法。

找到这部分代码:

code
JavaScript
download
content_copy
expand_less
IGNORE_WHEN_COPYING_START
IGNORE_WHEN_COPYING_END
// 动画完成后清理
setTimeout(() => {
    currentSlide.classList.remove('is-active', 'is-exiting');
    currentSlide.style.transform = 'translateX(100%)'; // 重置位置
    
    // 更新索引
    currentSlideIndex = nextIndex;
    isAnimating = false;
}, 1200);

修改为:

code
JavaScript
download
content_copy
expand_less
IGNORE_WHEN_COPYING_START
IGNORE_WHEN_COPYING_END
// 动画完成后清理
setTimeout(() => {
    currentSlide.classList.remove('is-active', 'is-exiting');
    // 移除内联 transform 样式，让其回归到 CSS 定义的默认状态。
    // 这样无论从哪个方向来，都能正确重置。
    currentSlide.style.transform = ''; 
    
    // 更新索引
    currentSlideIndex = nextIndex;
    isAnimating = false;
}, 1200);

修改 page1.css

为 .intro-slide 元素添加硬件加速建议，以消除渲染闪烁。

找到 .intro-slide 选择器:

code
Css
download
content_copy
expand_less
IGNORE_WHEN_COPYING_START
IGNORE_WHEN_COPYING_END
.intro-slide {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: transform 1.2s cubic-bezier(0.8, 0, 0.2, 1);
    transform: translateX(100%); /* 默认移出屏幕外 */
    background-color: #fffbf0;
    color: #333;
}

在其中添加两行:

code
Css
download
content_copy
expand_less
IGNORE_WHEN_COPYING_START
IGNORE_WHEN_COPYING_END
.intro-slide {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: transform 1.2s cubic-bezier(0.8, 0, 0.2, 1);
    transform: translateX(100%); /* 默认移出屏幕外 */
    background-color: #fffbf0;
    color: #333;
    /* 新增：建议GPU渲染以优化动画，防止闪烁 */
    backface-visibility: hidden;
    transform: translateZ(0);
}

重要: 由于我们添加了 transform: translateZ(0)，需要同步修改 .intro-slide 的其他 transform 状态。

修改 .intro-slide.is-active:

code
Css
download
content_copy
expand_less
IGNORE_WHEN_COPYING_START
IGNORE_WHEN_COPYING_END
/* 从 */
.intro-slide.is-active {
    transform: translateX(0);
    z-index: 2;
}
/* 改为 */
.intro-slide.is-active {
    transform: translateX(0) translateZ(0); /* 保持Z轴变换 */
    z-index: 2;
}
任务3：重构 Page4 动画与交互

修改 page4.js

完全替换 page4.js 的内容 为以下重构后的代码。新代码移除了按钮逻辑，实现了 handleScroll 接口，并优化了动画流程。

code
JavaScript
download
content_copy
expand_less
IGNORE_WHEN_COPYING_START
IGNORE_WHEN_COPYING_END
// Page4 - 时间轴动画页面脚本 (重构版)
(function() {
    'use strict';

    const STAGES_DATA = [
        { year: 2018.5, title: '探索试点阶段', date: '2018-2019年', side: 'left', details: '突破传统招标只招不采的弊端，以"量价挂钩"为核心。<br>集采范围从11座试点城市拓展到25省。' },
        { year: 2020.5, title: '制度建立阶段', date: '2020-2021年', side: 'right', details: '药品覆盖范围显著扩大：覆盖162个品种。<br>规则精细化："差比价机制"、"多家中标机制"等。' },
        { year: 2021.5, title: '制度完善阶段', date: '2021年', side: 'left', details: '生物药纳入集采范围，中成药地方试点。<br>建立临床综合评价体系，尊重医疗需求。' },
        { year: 2022.5, title: '医保治理阶段', date: '2022年至今', side: 'right', details: '覆盖全品类：中成药、化学药、罕见病药。<br>通过DRG、DIP机制完善医保资金调配。' }
    ];

    let currentStageIndex = -1;
    let isAnimating = false;
    let hasInitialized = false;
    let timelineCanvas, pathProgress, pathLength, startYear, endYear, stages, pageHeader, futureText;

    const mapRange = (v, i_min, i_max, o_min, o_max) => (v - i_min) * (o_max - o_min) / (i_max - i_min) + o_min;

    function setupTimeline() {
        const start = { x: 100, y: 650 }, end = { x: 1100, y: 50 };
        const pathData = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
        
        document.getElementById('path-bg').setAttribute('d', pathData);
        pathProgress.setAttribute('d', pathData);
        
        pathLength = pathProgress.getTotalLength();
        pathProgress.style.strokeDasharray = pathLength;
        pathProgress.style.strokeDashoffset = pathLength;
        
        startYear = 2018; endYear = 2023;
        
        const lastStageYear = STAGES_DATA[STAGES_DATA.length - 1].year;
        const lastPointP = mapRange(lastStageYear, startYear, endYear, 0.05, 0.95);
        const lastPoint = pathProgress.getPointAtLength(pathLength * lastPointP);
        document.getElementById('path-future').setAttribute('d', `M ${lastPoint.x} ${lastPoint.y} L ${end.x} ${end.y}`);

        let contentHTML = '';
        for (let year = startYear; year <= endYear; year++) {
            const p = mapRange(year, startYear, endYear, 0.05, 0.95);
            const point = pathProgress.getPointAtLength(pathLength * p);
            contentHTML += `<div class="year-marker" style="left:${point.x}px; top:${point.y}px;">${year}</div>`;
        }
        
        STAGES_DATA.forEach(data => {
            const p = mapRange(data.year, startYear, endYear, 0.05, 0.95);
            const point = pathProgress.getPointAtLength(pathLength * p);
            contentHTML += `<div class="timeline-stage" data-side="${data.side}" style="left:${point.x}px; top:${point.y}px;"><div class="node"></div><div class="stage-content"><h2>${data.title}</h2><span class="date">${data.date}</span><p class="details">${data.details}</p></div></div>`;
        });
        
        contentHTML += `<div id="to-be-continued" style="left:${end.x}px; top:${end.y}px;">未完待续...</div>`;
        timelineCanvas.insertAdjacentHTML('beforeend', contentHTML);

        stages = document.querySelectorAll('.timeline-stage');
        futureText = document.getElementById('to-be-continued');
    }

    async function playStageAnimation(stageIndex, direction = 'forward') {
        if (isAnimating) return;
        isAnimating = true;

        // Hide previous stage
        if (direction === 'forward' && stageIndex > 0) {
            stages[stageIndex - 1].classList.remove('is-active');
        } else if (direction === 'backward' && stageIndex < STAGES_DATA.length - 1) {
            stages[stageIndex + 1].classList.remove('is-active');
        }

        if (stageIndex === -1) { // Go back to start
            timelineCanvas.style.transform = 'translate(-50%, -50%) scale(1)';
            pathProgress.style.strokeDashoffset = pathLength;
            isAnimating = false;
            return;
        }

        const stage = stages[stageIndex];
        const data = STAGES_DATA[stageIndex];
        const p = mapRange(data.year, startYear, endYear, 0.05, 0.95);
        
        const nodeX = parseFloat(stage.style.left);
        const nodeY = parseFloat(stage.style.top);
        const scale = 1.6;
        const translateX = (600 - nodeX) * scale;
        const translateY = (350 - nodeY) * scale;
        
        timelineCanvas.style.transform = `translate(calc(-50% + ${translateX}px), calc(-50% + ${translateY}px)) scale(${scale})`;
        pathProgress.style.strokeDashoffset = pathLength - (pathLength * p);
        
        stage.classList.add('is-active');
        
        setTimeout(() => { isAnimating = false; }, 800); // Animation duration
    }

    async function initializeAnimation() {
        if (hasInitialized) return;
        hasInitialized = true;
        pageHeader.classList.add('is-visible');
        document.querySelectorAll('.year-marker').forEach((marker, i) => {
            setTimeout(() => marker.classList.add('is-visible'), i * 80);
        });
    }

    function handleScroll(direction) {
        initializeAnimation();
        if (isAnimating) return true;

        if (direction === 'down') {
            if (currentStageIndex < STAGES_DATA.length - 1) {
                currentStageIndex++;
                playStageAnimation(currentStageIndex, 'forward');
                return true; // Scroll handled internally
            } else {
                // At the end, allow scrolling to next page
                if (currentStageIndex === STAGES_DATA.length -1) {
                    stages[currentStageIndex].classList.remove('is-active');
                    timelineCanvas.style.transform = 'translate(-50%, -50%) scale(1)';
                    futureText.classList.add('is-visible');
                }
                return false; 
            }
        } else { // direction === 'up'
            if (currentStageIndex >= 0) {
                currentStageIndex--;
                playStageAnimation(currentStageIndex, 'backward');
                futureText.classList.remove('is-visible');
                return true; // Scroll handled internally
            } else {
                return false; // At the beginning, allow scrolling to previous page
            }
        }
    }

    function init() {
        timelineCanvas = document.getElementById('timelineCanvas');
        pathProgress = document.getElementById('path-progress');
        pageHeader = document.getElementById('pageHeader');
        
        if (!timelineCanvas || !pathProgress || !pageHeader) return;

        setupTimeline();
        
        // Expose the handleScroll function to the global scope
        window.Page4 = { handleScroll };
        
        console.log('Page4: Time-lapse animation page re-initialized for scroll control.');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

修改 page4.css

删除所有与手动控制按钮和进度指示器相关的样式。

删除以下所有CSS规则:

code
Css
download
content_copy
expand_less
IGNORE_WHEN_COPYING_START
IGNORE_WHEN_COPYING_END
/* 手动播放控制按钮 */
.manual-controls { ... }
.control-btn { ... }
.control-btn:hover { ... }
.control-btn:disabled { ... }

/* 进度指示器 */
.progress-indicator { ... }
.progress-indicator.is-visible { ... }
任务4：集成 Page4 到全局滚动控制器

修改 main.js

在 wheel 事件监听器中，添加对 page4-container 的滚动处理逻辑，就像 page1-container 和 page2-container 一样。

找到这个代码块:

code
JavaScript
download
content_copy
expand_less
IGNORE_WHEN_COPYING_START
IGNORE_WHEN_COPYING_END
// 新增：特殊处理 Page2 ...
if (sections[currentStageIndex].id === 'page2-container') {
    // ...
}

在其后添加:

code
JavaScript
download
content_copy
expand_less
IGNORE_WHEN_COPYING_START
IGNORE_WHEN_COPYING_END
// 新增：特殊处理 Page4 - 如果page4内部处理了滚动，就直接返回
if (sections[currentStageIndex].id === 'page4-container') {
    // 检查page4是否已经初始化并提供了接口
    if (window.Page4 && typeof window.Page4.handleScroll === 'function') {
        const isHandledByPage4 = window.Page4.handleScroll(direction);
        if (isHandledByPage4) {
            // page4处理了滚动，等待动画完成后解锁
            setTimeout(() => { isScrolling = false; }, 800);
            return;
        }
    }
}

执行完以上所有修改后，项目应该能达到您预期的效果：统一的滚动交互，无多余按钮，所有页面左上角都有页码，Page1动画流畅且双向一致，Page4动画能通过滚动平滑地控制。

# Page7图表显示问题修复记录

## 问题描述
Page7页面在PPT翻页系统中只显示文本，图表无法显示。

## 问题分析
通过代码分析发现以下问题：

1. **CSS变量缺失**：`page7.css`中使用了`--primary-color-green`、`--primary-color-yellow`、`--border-color`等CSS变量，但这些变量在`main.css`中没有定义。

2. **布局冲突**：`page7.css`中的Grid布局与`main.css`中的Flexbox布局产生冲突。

3. **图表初始化时机错误**：图表在DOM加载完成后立即初始化，但此时页面可能还未变为可见状态。

4. **图表容器尺寸问题**：图表容器的高度设置为90%，但在PPT翻页系统中可能无法正确计算。

## 修复方案

### 1. 添加缺失的CSS变量
在`css/main.css`中添加：
```css
:root {
    /* 添加page7需要的颜色变量 */
    --primary-color-green: #27ae60;
    --primary-color-yellow: #f39c12;
    --border-color: rgba(0, 0, 0, 0.1);
}
```

### 2. 修复布局冲突
在`css/pages/page7.css`中：
```css
#page7-container {
    /* 覆盖main.css的flex布局，使用grid布局 */
    display: grid !important;
    /* 确保在PPT翻页系统中正确显示 */
    position: relative;
    align-items: stretch;
    justify-content: stretch;
}
```

### 3. 修复图表初始化时机
在`js/pages/page7.js`中：
- 移除DOM加载完成后的立即初始化
- 添加页面可见性检测机制
- 在页面变为可见时才初始化图表

### 4. 修复图表容器尺寸
在`css/pages/page7.css`中：
```css
.chart-wrapper {
    min-height: 400px;
}

#main-chart {
    min-height: 350px;
    flex: 1;
    background-color: rgba(255, 255, 255, 0.8);
    border: 1px solid var(--border-color);
    border-radius: 8px;
}
```

### 5. 添加页面可见性检测
在`js/main.js`中添加：
```javascript
function setActiveSection(index) {
    // ... 现有代码 ...
    
    // 调用当前活动页面的可见性方法
    const currentSection = sections[index];
    if (currentSection) {
        const sectionId = currentSection.id;
        if (sectionId === 'page7-container' && window.Page7Controller && typeof window.Page7Controller.onPageVisible === 'function') {
            window.Page7Controller.onPageVisible();
        }
    }
}
```

## 修复效果
修复后，Page7页面应该能够：
1. 正确显示Grid布局
2. 在页面变为可见时自动初始化图表
3. 显示完整的双轴折线图（价格降幅和最高有效申报价）
4. 支持误差线显示
5. 响应式调整和交互功能

## 技术要点
- 使用`!important`覆盖CSS优先级冲突
- 通过页面可见性检测机制确保图表在正确时机初始化
- 为图表容器添加明确的尺寸和背景色
- 确保PPT翻页系统与页面专用逻辑的协作