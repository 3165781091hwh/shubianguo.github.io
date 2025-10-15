// js/pages/page13.js

(function() {
    // 使用 IIFE (立即调用函数表达式) 封装代码，避免全局作用域污染。
    // 这是项目遵循的良好实践。

    document.addEventListener('DOMContentLoaded', function() {
        
        // 获取当前页面的容器元素
        const page13Container = document.getElementById('page13-container');

        // 确认页面元素存在
        if (!page13Container) {
            console.error('Page 13 container not found!');
            return;
        }

        // 目前 Page 13 是一个静态内容展示页面，没有复杂的交互逻辑。
        // 此文件主要用于保持项目结构的统一性和完整性。
        // 未来的任何针对 Page 13 的特定交互都可以添加到这里。

        // 例如，我们可以监听侧边栏的点击事件（尽管目前只是样式变化）
        const sidebarItems = page13Container.querySelectorAll('.sidebar-item');
        sidebarItems.forEach(item => {
            item.addEventListener('click', () => {
                // 目前没有定义点击后的行为，仅作为示例
                console.log(`Sidebar item clicked: ${item.textContent}`);
                
                // 如果需要实现点击切换 active 状态，可以在这里添加逻辑
                // sidebarItems.forEach(i => i.classList.remove('active'));
                // item.classList.add('active');
            });
        });
        
        console.log("Page 13 script loaded and initialized successfully.");
    });

})();