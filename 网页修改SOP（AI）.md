

## **《项目前端开发与维护黄金标准》**

### **目标**
本文档旨在提供一套清晰、统一的前端开发规范，以确保项目在持续迭代和扩展过程中，所有页面组件（HTML, CSS, JavaScript）都能保持**高度独立（沙箱化）**、**无冲突**且**易于维护**。

### **法则一：HTML 结构必须标准化**

**所有新页面的创建，都必须从复制以下“标准页面模板”开始。**

```html
<!-- ▼▼▼ PAGEXX HTML CONTENT START (V5.0 标准) ▼▼▼ -->
<section id="pageXX-container" class="page-section">
    <!-- 
      唯一的包装器 (wrapper)，用于创建CSS和JS沙箱。
      类名可以是 .pageXX-wrapper, .page-container, 或 .page-wrapper
    -->
    <div class="pageXX-wrapper">

        <!-- ↓↓↓ 在此区域内，自由地编写页面专属的HTML内容 ↓↓↓ -->

        <header>...</header>
        <main>...</main>
        <footer>...</footer>

        <!-- ↑↑↑ 页面专属HTML内容结束 ↑↑↑ -->

    </div>
</section>
<!-- ▲▲▲ PAGEXX HTML CONTENT END ▲▲▲ -->
```

*   **`section`**：是最外层容器。
*   **`id="pageXX-container"`**：**【强制】** 必须是唯一的，`XX` 是页码。这是CSS和JS沙箱化的“根”。
*   **`class="page-section"`**：**【强制】** 必须保留。这是全局翻页控制器 `main.js` 识别页面的依据。
*   **`.pageXX-wrapper`**：**【强制】** 必须有一个内层包装器 `div`。**所有**本页面的复杂布局（Grid, Flex）、内边距（`padding`）和内部滚动（`overflow`）都应在这个包装器上定义。

### **法则二：CSS 必须完全沙箱化**

**所有新页面的 `pageXX.css` 文件，都必须遵循以下规则。**

1.  **使用ID前缀：** **【强制】** `pageXX.css` 中的**每一条**CSS规则，都必须以 `#pageXX-container` 作为选择器的开头。

    ```css
    /* 正确 ✅ */
    #pageXX-container .title {
        font-size: 2rem;
    }
    #pageXX-container .sidebar button:hover {
        background-color: blue;
    }

    /* 错误 ❌ (会造成全局污染) */
    .title {
        font-size: 2rem;
    }
    button:hover {
        background-color: blue;
    }
    ```

2.  **动画名称加前缀：** **【推荐】** 如果页面定义了 `@keyframes` 动画，给动画名称加上页面前缀，以防重名。

    ```css
    /* 推荐 ✅ */
    @keyframes pageXX-fadeIn { ... }

    #pageXX-container .some-element {
        animation: pageXX-fadeIn 1s;
    }
    ```

3.  **禁止全局标签选择器：** **【严禁】** 永远不要在任何页面的CSS文件中直接为 `body`, `h1`, `p`, `main` 等通用HTML标签定义样式。所有样式都应通过带ID前缀的类选择器来应用。

### **法则三：JavaScript 必须完全沙箱化**

**所有新页面的 `pageXX.js` 文件，都必须遵循以下结构。**

1.  **使用 IIFE 封装：** **【强制】** 将所有代码包裹在 `(function() { ... })();` 或 `document.addEventListener('DOMContentLoaded', () => { ... });` 中，防止任何变量或函数泄漏到全局。

2.  **从根容器开始查询：** **【强制】** 脚本的第一步必须是获取当前页面的根容器。后续**所有**的DOM查询和事件绑定，都必须基于这个根容器变量进行。

    ```javascript
    // pageXX.js 的标准模板
    (function() {
        document.addEventListener('DOMContentLoaded', () => {
            
            // 1. 获取自己的“房子”
            const pageContainer = document.getElementById('pageXX-container');
            
            // 2. 如果“房子”不存在，立即停止执行，避免在其他页面报错
            if (!pageContainer) {
                return;
            }

            // 3. 在自己的“房子”里找“家具”
            const titleElement = pageContainer.querySelector('.title');
            const actionButton = pageContainer.querySelector('.action-button');

            // 4. 只在自己的“家具”上绑定事件
            actionButton.addEventListener('click', () => {
                // 这个操作只会影响 pageXX 内部的元素
                titleElement.style.color = 'red';
            });

            // 5. 如果需要页面激活时才执行动画，使用 MutationObserver
            const observer = new MutationObserver((mutations) => {
                if (pageContainer.classList.contains('is-active')) {
                    // 页面被 main.js 激活了，可以在这里播放入场动画
                    // ...
                    observer.disconnect(); // 播放一次后停止观察，以节省性能
                }
            });
            observer.observe(pageContainer, { attributes: true, attributeFilter: ['class'] });

        });
    })();
    ```

### **总结**

这个项目的架构现在已经非常成熟。我们遇到的所有问题，最终都指向了同一个核心原则：**组件化和隔离**。

*   **HTML** 负责定义“我是谁”（`id="pageXX-container"`）。
*   **CSS** 负责定义“我在我的地盘里长什么样”（`#pageXX-container ...`）。
*   **JavaScript** 负责定义“我在我的地盘里做什么”（`const pageContainer = ...`）。

只要我们严格遵守这三大法则，未来的开发工作将会变得异常轻松和安全。