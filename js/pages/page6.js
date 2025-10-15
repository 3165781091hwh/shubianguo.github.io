/* =================================================================== */
/*                            PAGE6 泳道图脚本                           */
/* =================================================================== */

(function() {
    'use strict';
    
    // 泳道图连接线配置
    const connections = [
        { from: 'task1-1', to: 'task2-2', type: 'solid' },
        { from: 'task2-2', to: 'task1-3', type: 'solid' },
        { from: 'task1-3', to: 'task1-4', type: 'solid' },
        { from: 'task1-4', to: 'task2-5', type: 'solid' },
        { from: 'task1-4', to: 'task3-5', type: 'solid' },
        { from: 'task2-5', to: 'task4-6', type: 'solid' },
        { from: 'task3-5', to: 'task4-6', type: 'solid' },
        // 虚线连接（反馈/依赖关系）
        { from: 'task3-1', to: 'task1-1', type: 'dashed' },
        { from: 'task4-3', to: 'task1-3', type: 'dashed' }
    ];

    // 绘制连接线
    function drawLines() {
        const svg = document.getElementById('line-svg');
        const grid = document.getElementById('grid');
        
        if (!svg || !grid) return;
        
        svg.innerHTML = '';
        const gridRect = grid.getBoundingClientRect();

        // 创建箭头标记定义
        createArrowMarker(svg);

        connections.forEach(conn => {
            const fromEl = document.getElementById(conn.from);
            const toEl = document.getElementById(conn.to);
            if (!fromEl || !toEl) return;

            const fromRect = fromEl.getBoundingClientRect();
            const toRect = toEl.getBoundingClientRect();

            const startX = fromRect.right - gridRect.left;
            const startY = fromRect.top + fromRect.height / 2 - gridRect.top;
            const endX = toRect.left - gridRect.left;
            const endY = toRect.top + toRect.height / 2 - gridRect.top;
            
            // 跨泳道连接使用路径，同泳道使用直线
            if (fromRect.top !== toRect.top) {
                drawPath(svg, startX, startY, endX, endY, conn.type);
            } else {
                drawLine(svg, startX, startY, endX, endY, conn.type);
            }
        });
    }

    // 创建箭头标记
    function createArrowMarker(svg) {
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
        
        marker.setAttribute('id', 'arrow');
        marker.setAttribute('viewBox', '0 0 10 10');
        marker.setAttribute('refX', '8');
        marker.setAttribute('refY', '5');
        marker.setAttribute('markerWidth', '6');
        marker.setAttribute('markerHeight', '6');
        marker.setAttribute('orient', 'auto-start-reverse');
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
        path.setAttribute('fill', '#555');
        
        marker.appendChild(path);
        defs.appendChild(marker);
        svg.appendChild(defs);
    }

    // 绘制直线连接
    function drawLine(svg, startX, startY, endX, endY, type) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', startX);
        line.setAttribute('y1', startY);
        line.setAttribute('x2', endX);
        line.setAttribute('y2', endY);
        line.setAttribute('stroke', '#555');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('marker-end', 'url(#arrow)');

        if (type === 'dashed') {
            line.setAttribute('stroke-dasharray', '5,5');
        }
        
        svg.appendChild(line);
    }

    // 绘制路径连接（跨泳道）
    function drawPath(svg, startX, startY, endX, endY, type) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const midX = startX + 20;
        
        path.setAttribute('d', `M ${startX} ${startY} H ${midX} V ${endY} H ${endX}`);
        path.setAttribute('stroke', '#555');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('fill', 'none');
        path.setAttribute('marker-end', 'url(#arrow)');
        
        if (type === 'dashed') {
            path.setAttribute('stroke-dasharray', '5,5');
        }
        
        svg.appendChild(path);
    }

    // 添加任务框交互效果
    function addTaskInteractions() {
        const taskBoxes = document.querySelectorAll('.task-box');
        
        taskBoxes.forEach(box => {
            // 鼠标悬停效果
            box.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
                this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.15)';
                this.style.transition = 'all 0.3s ease';
            });
            
            box.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = '0 3px 8px rgba(0,0,0,0.05)';
            });
            
            // 点击效果
            box.addEventListener('click', function() {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            });
        });
    }

    // 初始化函数
    function init() {
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        
        // 绘制连接线
        drawLines();
        
        // 添加交互效果
        addTaskInteractions();
        
        // 监听窗口大小变化，重新绘制连接线
        window.addEventListener('resize', debounce(drawLines, 250));
    }

    // 防抖函数
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 启动初始化
    init();
    
})(); 