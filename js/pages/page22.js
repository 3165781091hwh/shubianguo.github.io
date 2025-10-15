// js/pages/page22.js
document.addEventListener('DOMContentLoaded', function() {
    // 1. 定义页面的主容器，所有查询都将基于此元素
    const pageContainer = document.querySelector('#page22-container');
    if (!pageContainer) {
        return; // 如果页面容器不存在，则不执行任何操作
    }

    // 2. 从主容器中查询所有需要的元素
    const secondaryNodes = pageContainer.querySelectorAll('.node-secondary');
    const popup = pageContainer.querySelector('#mindmapPopup');

    // 3. 为所有查询到的元素绑定事件监听器
    secondaryNodes.forEach(node => {
        node.addEventListener('mouseover', function() {
            const content = this.getAttribute('data-content');
            if (content && popup) {
                popup.innerHTML = content;
                popup.classList.add('visible');
            }
        });

        node.addEventListener('mouseout', function() {
            if (popup) {
                popup.classList.remove('visible');
            }
        });
    });
});