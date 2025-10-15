// js/pages/page24.js - [REBUILT]

// We use a self-invoking function to avoid polluting the global scope
(function() {
    /**
     * This function initializes the interactive tooltips for page 23.
     * It waits for the entire window to load to ensure all elements are ready.
     */
    const initpage24Tooltips = () => {
        const container = document.getElementById('page24-container');
        
        // If the page 23 container doesn't exist on the page, do nothing.
        if (!container) {
            return;
        }

        // Select all nodes that are supposed to have a tooltip.
        const nodesWithTooltips = container.querySelectorAll('.node.has-tooltip');
        
        if (nodesWithTooltips.length === 0) {
            return;
        }

        // Iterate over each interactive node.
        nodesWithTooltips.forEach(node => {
            const tooltip = node.querySelector('.tooltip');
            
            if (tooltip) {
                // Event listener for when the mouse enters the node area.
                node.addEventListener('mouseenter', () => {
                    // Directly manipulate the style to show the tooltip.
                    // This is more robust than adding a class.
                    tooltip.style.visibility = 'visible';
                    tooltip.style.opacity = '1';
                });

                // Event listener for when the mouse leaves the node area.
                node.addEventListener('mouseleave', () => {
                    // Directly manipulate the style to hide the tooltip again.
                    tooltip.style.visibility = 'hidden';
                    tooltip.style.opacity = '0';
                });
            }
        });
        
        
    };

    /**
     * We use the 'load' event instead of 'DOMContentLoaded'. 
     * 'load' waits for all resources (like images and CSS) to be fully loaded, 
     * which can be more reliable in a complex, multi-section page.
     */
    window.addEventListener('load', initpage24Tooltips);

})(); // End of self-invoking function