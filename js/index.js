let scCarousel = document.querySelector("#SC-Carousel"),
	nextCarousel = scCarousel.querySelector(".next"),
	prevCarousel = scCarousel.querySelector(".prev"),
	logoEle = document.querySelector('img#Logo'),
	logoIcon = document.querySelector('#LogoIcon'),
	sectionImgs = document.querySelectorAll('.title img'),
	navEle = document.querySelector('nav.navbar'),
	navItems = navEle.querySelectorAll('.nav-item'),
	sections = document.querySelectorAll('section, header');

//check scroll to remove opacity from nav when page loaded
checkScrollNav();

nextCarousel.addEventListener('click',function(){
	let currentSlide = scCarousel.querySelector(".SC-Carousel-item.active"),
		newSlide = currentSlide.nextElementSibling ?? scCarousel.querySelector(".SC-Carousel-item:first-child"),
		currentColor = newSlide.dataset.colorName;
	currentSlide.classList.remove('active');
	newSlide.classList.add('active');
	changeMainColor(currentColor);
	changeImg(currentColor,logoEle,'logo');
	sectionImgs.forEach(function(img){
		changeImg(currentColor,img,'correct');
	})
	updateImgLogo(currentColor);
});

prevCarousel.addEventListener('click',function(){
	let currentSlide = scCarousel.querySelector(".SC-Carousel-item.active"),
		newSlide = currentSlide.previousElementSibling ?? scCarousel.querySelector(".SC-Carousel-item:last-child"),
		currentColor = newSlide.dataset.colorName;
	currentSlide.classList.remove('active');
	newSlide.classList.add('active');
	changeMainColor(currentColor);
	changeImg(currentColor,logoEle,'logo');
	sectionImgs.forEach(function(img){
		changeImg(currentColor,img,'correct');
	})
	updateImgLogo(currentColor);
});

navItems.forEach(function(navItem){
	navItem.addEventListener('click',function(e){
		e.preventDefault();
		let currentNavItem = navEle.querySelector('.nav-item.active');
		currentNavItem.classList.remove('active');
		navItem.classList.add('active');

		let currentSectionId = navItem.querySelector('a').getAttribute('href'),
		currentSection = document.querySelector(currentSectionId),
		sectionTop = currentSection.offsetTop,
		navHeight = navEle.clientHeight;
		
		window.scrollTo(0,sectionTop - navHeight);
	});
});

window.addEventListener('scroll',function(){
	checkScrollNav();
	sections.forEach(function(section){
		updateNavItem(section.id);	
	});
});