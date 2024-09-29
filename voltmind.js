const MAX_CUBES = 120;
const MOBILE_MAX_CUBES = 45; // モバイル用の最大立方体数
const MOBILE_BREAKPOINT = 768; // モバイルとデスクトップの境界となる画面幅（ピクセル）

let cubeWrappers = []; // グローバル変数として立方体のラッパーを保存

function createCube(background, top, left) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('cube-wrapper');
    
    const cube = document.createElement('div');
    cube.classList.add('cube');
    
    const size = Math.random() * 50 + 40; // サイズを20px〜50pxに変更

    wrapper.style.top = `${top}px`;
    wrapper.style.left = `${left}px`; // %ではなくpxを使用
    cube.style.width = `${size}px`;
    cube.style.height = `${size}px`;

    // 6つの面を作成
    const positions = [
        { transform: `rotateY(0deg) translateZ(${size/2}px)` },
        { transform: `rotateY(180deg) translateZ(${size/2}px)` },
        { transform: `rotateY(90deg) translateZ(${size/2}px)` },
        { transform: `rotateY(-90deg) translateZ(${size/2}px)` },
        { transform: `rotateX(90deg) translateZ(${size/2}px)` },
        { transform: `rotateX(-90deg) translateZ(${size/2}px)` }
    ];

    const hasFaces = Math.random() < 0.3;

    for (let j = 0; j < 6; j++) {
        const face = document.createElement('div');
        face.classList.add('cube-face');
        face.style.width = `${size}px`;
        face.style.height = `${size}px`;
        face.style.transform = positions[j].transform;

        if (hasFaces) {
            face.style.backgroundColor = Math.random() < 0.5 ? '#1a3a8f' : '#d4b95f';
        } else {
            face.style.backgroundColor = 'transparent';
            face.style.border = '2px solid ' + (Math.random() < 0.5 ? '#1a3a8f' : '#d4b95f');
        }

        cube.appendChild(face);
    }

    const rotateDuration = Math.random() * 10 + 20;
    const floatDuration = Math.random() * 10 + 20;
    const delay = Math.random() * -30;

    cube.style.animation = `rotate ${rotateDuration}s linear infinite`;
    wrapper.style.animation = `float ${floatDuration}s ease-in-out infinite`;
    
    cube.style.animationDelay = `${delay}s`;
    wrapper.style.animationDelay = `${delay}s`;

    wrapper.appendChild(cube);
    background.appendChild(wrapper);
    cubeWrappers.push(wrapper);
}

function createCubes() {
    const background = document.querySelector('.animated-background');
    const totalHeight = background.offsetHeight;
    const totalWidth = background.offsetWidth;
    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
    const cubesCount = isMobile ? MOBILE_MAX_CUBES : MAX_CUBES;

    for (let i = 0; i < cubesCount; i++) {
        let top;
        if (isMobile) {
            // モバイルの場合、下半分に多く配置
            top = Math.random() * totalHeight * 0.9 + totalHeight * 0.1;
        } else {
            top = Math.random() * totalHeight;
        }
        const left = Math.random() * totalWidth;
        createCube(background, top, left);
    }
}

function updateCubesPosition() {
    const scrollY = window.pageYOffset;
    const speed = 0.2;
    const backgroundElement = document.querySelector('.animated-background');
    const backgroundRect = backgroundElement.getBoundingClientRect();
    const backgroundHeight = backgroundElement.offsetHeight;

    cubeWrappers.forEach((wrapper) => {
        if (wrapper.closest('.animated-background')) {
            const initialTop = parseFloat(wrapper.getAttribute('data-initial-top') || wrapper.style.top);
            const initialLeft = parseFloat(wrapper.getAttribute('data-initial-left') || wrapper.style.left);
            
            if (!wrapper.getAttribute('data-initial-top')) {
                wrapper.setAttribute('data-initial-top', initialTop);
                wrapper.setAttribute('data-initial-left', initialLeft);
            }

            let newTop = initialTop - (scrollY - backgroundRect.top) * speed;

            // 立方体が背景の範囲内に収まるようにする
            newTop = Math.max(0, Math.min(newTop, backgroundHeight - wrapper.offsetHeight));

            wrapper.style.top = `${newTop}px`;
            wrapper.style.left = `${initialLeft}px`;
        }
    });
}

function createHeroCubes() {
    const heroBackground = document.querySelector('.hero-background');
    const heroHeight = heroBackground.offsetHeight;
    const heroWidth = heroBackground.offsetWidth;
    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
    const heroCubesCount = Math.floor((isMobile ? MOBILE_MAX_CUBES : MAX_CUBES) * 0.5);

    for (let i = 0; i < heroCubesCount; i++) {
        const top = Math.random() * heroHeight;
        const left = Math.random() * heroWidth;
        createCube(heroBackground, top, left);
    }
}

function updateHeroCubesPosition() {
    const heroBackground = document.querySelector('.hero-background');
    const heroRect = heroBackground.getBoundingClientRect();
    const scrollY = window.pageYOffset;

    cubeWrappers.forEach(wrapper => {
        if (wrapper.closest('.hero-background')) {
            const initialTop = parseFloat(wrapper.getAttribute('data-initial-top') || wrapper.style.top);
            const initialLeft = parseFloat(wrapper.getAttribute('data-initial-left') || wrapper.style.left);
            
            if (!wrapper.getAttribute('data-initial-top')) {
                wrapper.setAttribute('data-initial-top', initialTop);
                wrapper.setAttribute('data-initial-left', initialLeft);
            }

            const newTop = initialTop - scrollY * 0.5;

            wrapper.style.top = `${newTop}px`;
            wrapper.style.left = `${initialLeft}px`;
        }
    });
}

function setupFadeInEffects() {
    const fadeElements = document.querySelectorAll('.fade-in-left, .fade-in-right, .fade-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.5}s`;
        observer.observe(element);
    });
}

function setupAboutFadeInEffects() {
    const fadeElements = document.querySelectorAll('.fade-in-up');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay * 400; // 各要素の遅延時間を設定
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach((element) => {
        observer.observe(element);
    });
}

function setupFloatingText() {
    const titles = document.querySelectorAll('.about-title, .services-title, .news-title');
    
    titles.forEach(title => {
        const letters = title.textContent.split('');
        title.textContent = '';
        letters.forEach(letter => {
            const span = document.createElement('span');
            span.textContent = letter;
            title.appendChild(span);
        });
    });
}

function animateFloatingText() {
    const titles = document.querySelectorAll('.about-title, .services-title, .news-title');
    
    titles.forEach(title => {
        const letters = title.querySelectorAll('span');
        let currentIndex = 0;
        
        function animateLetter() {
            if (currentIndex < letters.length) {
                letters[currentIndex].style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    letters[currentIndex].style.transform = 'translateY(0)';
                    currentIndex++;
                    setTimeout(animateLetter, 200);
                }, 200);
            } else {
                currentIndex = 0;
                setTimeout(animateLetter, 1000);
            }
        }
        
        animateLetter();
    });
}

function setupHeroFadeIn() {
    const heroContent = document.querySelector('.hero-content');
    heroContent.classList.add('fade-in');
}

function setupHeroLogoAnimation() {
    const logoParts = document.querySelectorAll('.logo-part');
    logoParts.forEach((part, index) => {
        part.style.animationDelay = `${index * 0.5}s`;
    });
}

function setupScrollEffect() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');

    function updateScroll() {
        const scrollPosition = window.scrollY;

        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollPosition >= sectionTop - sectionHeight * 0.25 &&
                scrollPosition < sectionTop + sectionHeight - sectionHeight * 0.25) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLinks[index]) {
                    navLinks[index].classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', updateScroll);
    updateScroll();
}

function animateHeroLogo() {
    const logoParts = document.querySelectorAll('.logo-part');
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const finalScale = 1;

    const initialPositions = [
        { top: '-200%', left: '-200%', rotate: -1080, scale: 1 },
        { top: '300%', right: '-200%', rotate: 1080, scale: 1 },
        { bottom: '-200%', left: '50%', rotate: 720, scale: 1 }
    ];

    logoParts.forEach((part, index) => {
        const pos = initialPositions[index];
        part.style.transition = 'none';
        Object.assign(part.style, pos);
        part.style.transform = `translate(-50%, -50%) rotate(${pos.rotate}deg) scale(${pos.scale})`;
        part.style.opacity = '0';
    });

    setTimeout(() => {
        logoParts.forEach((part, index) => {
            part.style.transition = 'all 3s cubic-bezier(0.25, 0.1, 0.25, 1)';
            part.style.top = '140%';
            part.style.left = '50%';
            part.style.right = 'auto';
            part.style.bottom = 'auto';
            part.style.transform = `translate(-50%, -50%) rotate(0deg) scale(${finalScale}) translateY(80%)`;
            part.style.opacity = '1';
        });
    }, 100);

    setTimeout(() => {
        logoParts.forEach((part, index) => {
            part.style.transition = 'all 1.5s ease-in-out';
            part.style.width = '33.33%';
            part.style.height = 'auto';
            
            if (index === 0) {
                part.style.transform = `translate(-100%, -50%) rotate(0deg) scale(${finalScale})`;
            } else if (index === 2) {
                part.style.transform = `translate(0%, -50%) rotate(0deg) scale(${finalScale})`;
            } else {
                part.style.transform = `translate(-50%, -50%) rotate(0deg) scale(${finalScale})`;
            }
        });
    }, 3500);

    setTimeout(() => {
        function complexAnimation() {
            logoParts.forEach((part, index) => {
                part.style.transition = 'all 2s cubic-bezier(0.4, 0, 0.2, 1)';
                
                const randomX = (Math.random() - 0.5) * 150;
                const randomY = (Math.random() - 0.5) * 150;
                const randomRotate = (Math.random() - 0.5) * 45;
                const randomScale = finalScale * (0.9 + Math.random() * 0.2);

                if (index === 0) {
                    part.style.transform = `translate(calc(-100% + ${randomX}px), calc(-50% + ${randomY}px)) rotate(${randomRotate}deg) scale(${randomScale})`;
                } else if (index === 2) {
                    part.style.transform = `translate(calc(0% + ${randomX}px), calc(-50% + ${randomY}px)) rotate(${randomRotate}deg) scale(${randomScale})`;
                } else {
                    part.style.transform = `translate(calc(-50% + ${randomX}px), calc(-50% + ${randomY}px)) rotate(${randomRotate}deg) scale(${randomScale})`;
                }

                part.style.filter = `hue-rotate(${Math.random() * 360}deg) brightness(${0.8 + Math.random() * 0.4})`;
            });

            setTimeout(() => {
                logoParts.forEach((part, index) => {
                    part.style.transition = 'all 2s cubic-bezier(0.4, 0, 0.2, 1)';
                    const verticalOffset = '1vh';
                    if (index === 0) {
                        part.style.transform = `translate(-50%, calc(-50% + ${verticalOffset})) rotate(0deg) scale(${finalScale})`;
                    } else if (index === 2) {
                        part.style.transform = `translate(-50%, calc(-50% + ${verticalOffset})) rotate(0deg) scale(${finalScale})`;
                    } else {
                        part.style.transform = `translate(-50%, calc(-50% + ${verticalOffset})) rotate(0deg) scale(${finalScale})`;
                    }
                    part.style.filter = 'none';
                });
            }, 2000);
        }

        complexAnimation();
        setInterval(complexAnimation, 6000);
    }, 5500);
}

// 新しい関数を追加
function adjustElementsForScreenSize() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // ヒーローセクションの高さを調整
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.height = `${windowHeight}px`;
    }

    // animated-backgroundの高さを調整
    const animatedBackground = document.querySelector('.animated-background');
    const scrollableContent = document.querySelector('.scrollable-content');
    if (animatedBackground && scrollableContent) {
        // scrollableContentの全体の高さからpadding-topを引いた値を使用
        const scrollableContentHeight = scrollableContent.offsetHeight - windowHeight;
        animatedBackground.style.height = `${scrollableContentHeight}px`;
        // topの位置も調整
        animatedBackground.style.top = `${windowHeight}px`;
    }

    // その他の要素の調整...
}

document.addEventListener('DOMContentLoaded', function() {
    setupFadeInEffects();
    setupFloatingText();
    animateFloatingText();
    setupHeroFadeIn();
    setupHeroLogoAnimation();
    setupScrollEffect();
    createCubes();
    createHeroCubes();
    updateCubesPosition();
    updateHeroCubesPosition();
    animateHeroLogo();
    adjustElementsForScreenSize(); // ページ読み込み時に実行
    setupAboutFadeInEffects();

    window.addEventListener('load', adjustElementsForScreenSize); // 全リソース読み込み後に実行

    window.addEventListener('scroll', () => {
        updateCubesPosition();
        updateHeroCubesPosition();
    });

    window.addEventListener('resize', () => {
        updateCubesPosition();
        updateHeroCubesPosition();
        adjustElementsForScreenSize(); // リサイズ時に実行
    });

    const scrollLinks = document.querySelectorAll('.scroll-link');
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});