document.addEventListener('DOMContentLoaded', function() {
    // 将所有选择器限定在 #page6-container 内部，防止与其它页面冲突
    const container = document.getElementById('page6-container');
    if (!container) return; // 如果页面不存在，则不执行任何操作

    // 使用更新后、唯一的ID来查找元素
    const grid = container.querySelector('#page6-grid');
    const svgOverlay = container.querySelector('#page6-svg-overlay');
    const playBtn = container.querySelector('#play-animation-btn');

    // 确保元素都存在
    if (!grid || !svgOverlay || !playBtn) {
        console.error("Page 6 script: Could not find one or more essential elements (grid, svgOverlay, playBtn).");
        return;
    }

    const columnHeaders = ["", "第一阶段：筹备与启动", "第二阶段：竞价与中选", "第三阶段：签约与执行", "第四阶段：监管与续约"];
    const rowHeaders = ["国家联采办", "医药企业", "医疗机构", "监管/支付方"];
    const chartData = [
        [{ text: "品种遴选<br>& 规则制定", type: "core" }, { text: "组织开标<br>& 现场唱标", type: "core" }, { text: "公布正式中选<br>& 组织签约", type: "core" }, { text: "组织期满续约<br>/ 重新招标", type: "core" }],
        [{ text: "分析标书<br>& 制定策略", type: "regular" }, { text: "提交申报材料<br>& 关键报价", type: "core" }, { text: "签订三方协议<br>& 组织生产", type: "core" }, { text: "保障全周期<br>稳定供应", type: "core" }],
        [{ text: "填报年度<br>采购需求量", type: "core" }, { text: "等待中选结果", type: "regular" }, { text: "签订三方协议<br>& 执行采购", type: "core" }, { text: "完成约定用量<br>& 优先使用", type: "regular" }],
        [{ text: "政策指导", type: "regular" }, { text: "开标现场监督", type: "core" }, { text: "医保基金预付<br>& 及时结算", type: "core" }, { text: "全流程质量监测<br>& 信用评价", type: "core" }]
    ];
    
    const linesData = [
        { from: [0, 0], to: [1, 1], type: 'main' }, { from: [1, 1], to: [0, 1], type: 'main' },
        { from: [0, 1], to: [0, 2], type: 'main' }, { from: [0, 2], to: [1, 2], type: 'main' },
        { from: [1, 2], to: [2, 2], type: 'main' }, { from: [0, 2], to: [0, 3], type: 'main' },
        { from: [2, 0], to: [0, 0], type: 'coordination' }, { from: [2, 3], to: [0, 3], type: 'coordination' },
        { from: [3, 1], to: [0, 1], type: 'oversight' }, { from: [3, 2], to: [1, 2], type: 'oversight' },
        { from: [3, 3], to: [1, 3], type: 'oversight' },
        { from: [2, 0], to: [3, 0], type: 'coordination' }
    ];
    
    function generateGrid() {
        grid.innerHTML = ''; // 清空
        columnHeaders.forEach((text, i) => {
            const header = document.createElement('div');
            // 使用与CSS匹配的类名
            header.className = 'header column-header';
            if (i > 0) header.innerHTML = text;
            grid.appendChild(header);
        });
        rowHeaders.forEach((text, r) => {
            const header = document.createElement('div');
            header.className = 'header row-header';
            header.innerHTML = text;
            grid.appendChild(header);
            chartData[r].forEach((data, c) => {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                const node = document.createElement('div');
                node.className = `node node-${data.type}`;
                node.innerHTML = data.text;
                node.id = `page6-node-${r}-${c}`; // Scoped ID
                node.dataset.row = r;
                node.dataset.col = c;
                cell.appendChild(node);
                grid.appendChild(cell);
            });
        });
    }

    function drawLines() {
        if (!grid.isConnected) return; // Don't draw if grid is not in DOM
        svgOverlay.innerHTML = '';
        const gridGap = parseFloat(window.getComputedStyle(grid).gap) || 25;
        
        linesData.forEach((lineData) => {
            const { from, to, type } = lineData;
            const fromNode = container.querySelector(`#page6-node-${from[0]}-${from[1]}`);
            const toNode = container.querySelector(`#page6-node-${to[0]}-${to[1]}`);
            
            if (!fromNode || !toNode) return;

            const fromRect = fromNode.getBoundingClientRect();
            const toRect = toNode.getBoundingClientRect();
            const svgRect = svgOverlay.getBoundingClientRect();
            
            if (svgRect.width === 0 || svgRect.height === 0) return; // Don't draw if SVG is not visible

            const start = { x: fromRect.left - svgRect.left, y: fromRect.top - svgRect.top };
            const end = { x: toRect.left - svgRect.left, y: toRect.top - svgRect.top };
            
            let pathD;
            const points = {
                from: {
                    top: { x: start.x + fromRect.width / 2, y: start.y },
                    bottom: { x: start.x + fromRect.width / 2, y: start.y + fromRect.height },
                    left: { x: start.x, y: start.y + fromRect.height / 2 },
                    right: { x: start.x + fromRect.width, y: start.y + fromRect.height / 2 }
                },
                to: {
                    top: { x: end.x + toRect.width / 2, y: end.y },
                    bottom: { x: end.x + toRect.width / 2, y: end.y + toRect.height },
                    left: { x: end.x, y: end.y + toRect.height / 2 },
                    right: { x: end.x + toRect.width, y: end.y + toRect.height / 2 }
                }
            };

            const colDiff = to[1] - from[1];
            const rowDiff = to[0] - from[0];

            if (Math.abs(colDiff) <= 1 && Math.abs(rowDiff) <= 1) {
                let p1, p2;
                if (colDiff > 0) { p1 = points.from.right; p2 = points.to.left; }
                else if (colDiff < 0) { p1 = points.from.left; p2 = points.to.right; }
                else if (rowDiff > 0) { p1 = points.from.bottom; p2 = points.to.top; }
                else { p1 = points.from.top; p2 = points.to.bottom; }
                pathD = `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;
            } else {
                if (rowDiff !== 0 && colDiff !== 0) {
                    let p1 = points.from.bottom;
                    let p2 = points.to.left;
                    const midY = p1.y + gridGap / 2;
                    pathD = `M ${p1.x} ${p1.y} V ${midY} H ${p2.x - gridGap/2} V ${p2.y}`;
                } else {
                   if(rowDiff === 0){
                        let p1 = points.from.right; 
                        let p2 = points.to.left;
                        pathD = `M ${p1.x} ${p1.y} H ${p1.x + gridGap/2} V ${p2.y} H ${p2.x}`;
                   } else {
                        let p1, p2, midY;
                        if (rowDiff > 0) { p1 = points.from.bottom; p2 = points.to.top; midY = p1.y + gridGap / 2; }
                        else { p1 = points.from.top; p2 = points.to.bottom; midY = p1.y - gridGap / 2; }
                        pathD = `M ${p1.x} ${p1.y} V ${midY} H ${p2.x} V ${p2.y}`;
                   }
                }
            }

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', pathD);
            path.id = `page6-line-from-${from[0]}-${from[1]}-to-${to[0]}-${to[1]}`; // Scoped ID
            path.classList.add(`line-${type}`);
            svgOverlay.appendChild(path);
        });
    }
    
    function setupInteractions() {
        container.querySelectorAll('.page6-grid .node').forEach(node => {
            node.addEventListener('mouseenter', () => {
                 const r = parseInt(node.dataset.row);
                 const c = parseInt(node.dataset.col);
                 highlightConnections(r, c);
            });
            node.addEventListener('mouseleave', clearHighlights);
        });
    }
    
    function highlightConnections(row, col) {
        container.querySelectorAll('.page6-grid .node, #page6-svg-overlay path').forEach(el => el.classList.add('dimmed'));
        const highlightedNode = container.querySelector(`#page6-node-${row}-${col}`);
        const connectedElements = new Set(highlightedNode ? [highlightedNode] : []);
        
        linesData.forEach(({from, to}) => {
            const isRelated = (from[0] === row && from[1] === col) || (to[0] === row && to[1] === col);
            if (isRelated) {
                const fromNode = container.querySelector(`#page6-node-${from[0]}-${from[1]}`);
                const toNode = container.querySelector(`#page6-node-${to[0]}-${to[1]}`);
                if(fromNode) connectedElements.add(fromNode);
                if(toNode) connectedElements.add(toNode);

                const lineEl = container.querySelector(`#page6-line-from-${from[0]}-${from[1]}-to-${to[0]}-${to[1]}`) || container.querySelector(`#page6-line-from-${to[0]}-${to[1]}-to-${from[0]}-${from[1]}`);
                if(lineEl) connectedElements.add(lineEl);
            }
        });
        
        connectedElements.forEach(el => {
            if (el) {
                el.classList.remove('dimmed');
                el.classList.add('highlighted');
            }
        });
    }

    function clearHighlights() {
        container.querySelectorAll('.dimmed, .highlighted').forEach(el => {
            el.classList.remove('dimmed', 'highlighted');
        });
    }

    function playMainFlowAnimation() {
        clearHighlights();
        const mainFlowSequence = [
            { type: 'node', id: 'page6-node-0-0' },
            { type: 'line', id: `page6-line-from-0-0-to-1-1` },
            { type: 'node', id: 'page6-node-1-1' },
            { type: 'line', id: `page6-line-from-1-1-to-0-1` },
            { type: 'node', id: 'page6-node-0-1' },
            { type: 'line', id: `page6-line-from-0-1-to-0-2` },
            { type: 'node', id: 'page6-node-0-2' },
            { type: 'line', id: `page6-line-from-0-2-to-1-2` },
            { type: 'node', id: 'page6-node-1-2' },
            { type: 'line', id: `page6-line-from-1-2-to-2-2` },
            { type: 'node', id: 'page6-node-2-2' },
        ];

        container.querySelectorAll('.page6-grid .node, #page6-svg-overlay path').forEach(el => el.classList.add('dimmed'));
        mainFlowSequence.forEach(item => {
            const el = container.querySelector(`#${item.id}`);
            if(el) el.classList.remove('dimmed');
        });

        let delay = 0;
        mainFlowSequence.forEach(item => {
            const el = container.querySelector(`#${item.id}`);
            if (!el) return;

            if (item.type === 'node') {
                setTimeout(() => el.classList.add('active-flow'), delay);
                delay += 600;
            } else {
                setTimeout(() => {
                    el.classList.add('animated-draw');
                    el.addEventListener('animationend', () => el.classList.remove('animated-draw'), { once: true });
                }, delay);
                delay += 800;
            }
        });
        
        setTimeout(() => {
            container.querySelectorAll('.active-flow').forEach(el => el.classList.remove('active-flow'));
            container.querySelectorAll('.dimmed').forEach(el => el.classList.remove('dimmed'));
            if(playBtn) playBtn.disabled = false;
        }, delay + 500);
    }
    
    function init() {
        generateGrid();
        drawLines();
        setupInteractions();
        setTimeout(playMainFlowAnimation, 500);
        if(playBtn) {
            playBtn.addEventListener('click', () => {
                playBtn.disabled = true;
                playMainFlowAnimation();
            });
        }
    }

    const resizeObserver = new ResizeObserver(() => {
        drawLines();
    });
    resizeObserver.observe(container);

    init();
});