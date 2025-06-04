document.addEventListener('DOMContentLoaded', () => {
    // 页脚年份自动更新
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // 移动端导航栏汉堡菜单
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    const navLinkItems = document.querySelectorAll('.nav-links li');

    if (burger && navLinks) {
        burger.addEventListener('click', () => {
            // Toggle Nav
            navLinks.classList.toggle('nav-active');

            // Animate Links
            navLinkItems.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });

            // Burger Animation
            burger.classList.toggle('toggle');
        });
    }

    // 点击导航链接后关闭移动端菜单 (如果菜单是打开的)
    navLinkItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('nav-active')) {
                navLinks.classList.remove('nav-active');
                burger.classList.remove('toggle');
                // 清除动画，以便下次点击时重新播放
                navLinkItems.forEach(link => link.style.animation = '');
            }
        });
    });

    // (可选) 导航栏滚动时活动状态 (简单版本，精确匹配请用 Intersection Observer)
    const sections = document.querySelectorAll('main section');
    const navLi = document.querySelectorAll('header nav ul li a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; // 减去导航栏高度的偏移
            if (pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLi.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').substring(1) === current) {
                a.classList.add('active');
            }
        });
         // 如果滚动到顶部，则移除所有 active 类，或者高亮第一个
        if (pageYOffset < sections[0].offsetTop - 100) {
             navLi.forEach(a => a.classList.remove('active'));
             // 可以选择高亮第一个链接
             // if (navLi.length > 0) navLi[0].classList.add('active');
        }
    });

});

// CSS keyframes for nav link fade (需要添加到 style.css 或内联 <style>)
// 如果不希望 JS 控制 CSS 动画，可以将这个 @keyframes 块直接放到 style.css 文件中
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
@keyframes navLinkFade {
    from {
        opacity: 0;
        transform: translateX(50px);
    }
    to {
        opacity: 1;
        transform: translateX(0px);
    }
}
`;
document.head.appendChild(styleSheet);
