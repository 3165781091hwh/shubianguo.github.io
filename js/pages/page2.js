(function() {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    function init() {
        const pageContainer = document.getElementById('page2-container');
        if (!pageContainer) return;

        const scenes = pageContainer.querySelectorAll('.scene');
        const paginationContainer = pageContainer.querySelector('.pagination');
        const scrollHint = pageContainer.querySelector('#scroll-hint');
        let currentSceneIndex = 0;
        let isThrottled = false;
        let dots = [];

        function createPagination() {
            if (!paginationContainer) return;
            paginationContainer.innerHTML = '';
            scenes.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                dot.addEventListener('click', () => {
                    if (index !== currentSceneIndex && !isThrottled) {
                        isThrottled = true;
                        goToScene(index);
                        setTimeout(() => { isThrottled = false; }, 1000);
                    }
                });
                paginationContainer.appendChild(dot);
                dots.push(dot);
            });
        }
        
        const scene3Elements = {
            bubbles: pageContainer.querySelectorAll('#scene3 .thought-bubble'),
            fountain: pageContainer.querySelector('#thumbs-up-fountain'),
            timers: []
        };

        function resetScene3() {
            if (!scene3Elements.fountain) return;
            scene3Elements.bubbles.forEach(b => b.classList.remove('is-fading'));
            scene3Elements.fountain.innerHTML = '';
            scene3Elements.timers.forEach(clearTimeout);
            scene3Elements.timers = [];
        }

        function animateScene3() {
            resetScene3();
            const fadeBubbleTimer = setTimeout(() => {
                scene3Elements.bubbles.forEach(b => b.classList.add('is-fading'));
            }, 2800);
            const fountainTimer = setTimeout(startThumbsUpFountain, 3800);
            scene3Elements.timers.push(fadeBubbleTimer, fountainTimer);
        }

        function startThumbsUpFountain() {
            const fountainContainer = scene3Elements.fountain;
            if (!fountainContainer) return;
            for (let i = 0; i < 40; i++) {
                const thumb = document.createElement('div');
                thumb.classList.add('thumb');
                thumb.innerHTML = '👍';
                const xEnd = (Math.random() - 0.5) * 400;
                const yEnd = -(Math.random() * 200 + 150);
                const rotation = (Math.random() - 0.5) * 90;
                thumb.style.setProperty('--transform-end', `translate(${xEnd}px, ${yEnd}px) rotate(${rotation}deg)`);
                thumb.style.animation = `page2-fountain-rise ${1.5 + Math.random() * 2}s ${Math.random() * 0.5}s ease-out forwards`;
                fountainContainer.appendChild(thumb);
            }
        }

        function goToScene(index) {
            if (index < 0 || index >= scenes.length) return;
            scenes.forEach((scene, i) => scene.classList.toggle('is-active', i === index));
            if(dots.length > 0) {
                dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
            }
            if (scrollHint) scrollHint.classList.toggle('hidden', index > 0);
            if (index === 2) {
                animateScene3();
            } else {
                resetScene3();
            }
            currentSceneIndex = index;
        }

        function handleScroll(direction) {
            if (isThrottled) return true;
            if (direction === 'down') {
                if (currentSceneIndex < scenes.length - 1) {
                    isThrottled = true;
                    goToScene(currentSceneIndex + 1);
                    setTimeout(() => { isThrottled = false; }, 1000);
                    return true;
                } else {
                    return false;
                }
            } else if (direction === 'up') {
                if (currentSceneIndex > 0) {
                    isThrottled = true;
                    goToScene(currentSceneIndex - 1);
                    setTimeout(() => { isThrottled = false; }, 1000);
                    return true;
                } else {
                    return false;
                }
            }
            return false;
        }

        window.Page2 = { handleScroll: handleScroll };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (dots.length === 0) {
                       createPagination();
                    }
                    goToScene(0);
                } else {
                    resetScene3();
                }
            });
        }, { threshold: 0.5 });

        observer.observe(pageContainer);
    }
})();