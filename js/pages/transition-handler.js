// js/pages/transition-handler.js - 过渡页内部滚动动画控制器

window.TransitionHandler = {
    // 定义动画持续时间，与CSS中的transition时间保持一致
    animationDuration: 500, // 0.5s

    /**
     * 处理过渡页的内部滚动。
     * @param {string} direction - 滚动方向 ('up', 'down', 'left', 'right')。
     * @param {HTMLElement} scrollContainer - 当前活动的过渡页内部的 .scroll-container 元素。
     * @returns {boolean} - 如果滚动事件被内部处理则返回 true，否则返回 false。
     */
    handleScroll: function(direction, scrollContainer) {
        if (!scrollContainer) {
            return false;
        }

        const aSide = scrollContainer.querySelector('.a-side');
        if (!aSide) {
            return false;
        }

        const a1 = aSide.querySelector('img:first-child');
        const a2 = aSide.querySelector('img:last-child');

        if (!a1 || !a2) {
            return false;
        }

        // 判断A面当前是否可见 (通过透明度判断，因为transform可能在动画中间)
        // 注意：getComputedStyle会强制浏览器重新计算样式，可能影响性能，但为了准确判断状态是必要的
        const a1Opacity = parseFloat(window.getComputedStyle(a1).opacity);
        const a2Opacity = parseFloat(window.getComputedStyle(a2).opacity);

        // 假设A面完全可见时opacity为1，完全隐藏时为0
        const isASideVisible = a1Opacity > 0.5 && a2Opacity > 0.5; // 使用0.5作为阈值，避免浮点数比较问题
        const isASideHidden = a1Opacity < 0.5 && a2Opacity < 0.5;

        // 将左右方向映射到上下方向
        const effectiveDirection = (direction === 'left') ? 'up' : (direction === 'right' ? 'down' : direction);

        if (effectiveDirection === 'down') {
            // 如果A面可见，则执行向下动画（隐藏A面，显示B面）
            if (isASideVisible) {
                // 滚动到容器底部，触发粘性定位的B面完全可见
                scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: 'smooth' });

                // 隐藏 A 面
                a1.style.transform = 'translateY(-100%)';
                a1.style.opacity = '0';
                a2.style.transform = 'translateY(100%)';
                a2.style.opacity = '0';

                console.log('TransitionHandler: 内部向下滚动，显示B面。');
                // 动画结束后再允许全局翻页，这里返回true消耗事件
                return true;
            }
            // 如果A面已经隐藏，则允许全局翻页
            return false;

        } else if (effectiveDirection === 'up') {
            // 如果A面隐藏，则执行向上动画（恢复A面）
            if (isASideHidden) {
                // 滚动回容器顶部
                scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });

                // 恢复 A 面
                a1.style.transform = 'translateY(0)';
                a1.style.opacity = '1';
                a2.style.transform = 'translateY(0)';
                a2.style.opacity = '1';

                console.log('TransitionHandler: 内部向上滚动，恢复A面。');
                // 动画结束后再允许全局翻页，这里返回true消耗事件
                return true;
            }
            // 如果A面已经可见，则允许全局翻页
            return false;
        }

        return false; // 其他情况不处理
    }
};

console.log('过渡页滚动处理器 (transition-handler.js) 已加载。');
