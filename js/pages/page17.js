document.addEventListener('DOMContentLoaded', function () {
    // 将所有DOM查询限定在#page17-container内，实现JS沙箱化
    const pageContainer = document.querySelector('#page17-container');
    if (!pageContainer) {
        return; // 如果页面容器不存在，则不执行任何操作
    }

    const btnPaneA = pageContainer.querySelector('#btn-pane-A');
    const btnPaneB = pageContainer.querySelector('#btn-pane-B');
    const contentPaneA = pageContainer.querySelector('#content-pane-A');
    const contentPaneB = pageContainer.querySelector('#content-pane-B');

    // 检查是否所有元素都已找到
    if (!btnPaneA || !btnPaneB || !contentPaneA || !contentPaneB) {
        return;
    }

    function renderTabContent(type) {
        if (type === 'A') {
            contentPaneA.classList.add('active');
            contentPaneB.classList.remove('active');
            btnPaneA.classList.add('active');
            btnPaneB.classList.remove('active');
        } else { // type 'B'
            contentPaneB.classList.add('active');
            contentPaneA.classList.remove('active');
            btnPaneB.classList.add('active');
            btnPaneA.classList.remove('active');
        }
    }

    btnPaneA.addEventListener('click', () => renderTabContent('A'));
    btnPaneB.addEventListener('click', () => renderTabContent('B'));

    // 初始状态已经在HTML中通过class="active"设置，无需JS再次调用
    // renderTabContent('A'); 
});