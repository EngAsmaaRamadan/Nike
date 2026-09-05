let scCarousel = document.querySelector("#SC-Carousel"),
	nextCarousel = scCarousel.querySelector(".next"),
	prevCarousel = scCarousel.querySelector(".prev"),
	logoEle = document.querySelector('img#Logo'),
	logoIcon = document.querySelector('#LogoIcon'),
	sectionImgs = document.querySelectorAll('.title img');

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