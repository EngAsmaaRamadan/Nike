let scCarousel = document.querySelector("#SC-Carousel"),
	nextCarousel = scCarousel.querySelector(".next"),
	prevCarousel = scCarousel.querySelector(".prev"),
	logoEle = document.querySelector('img#Logo'),
	logoIcon = document.querySelector('#LogoIcon'),
	sectionImgs = document.querySelectorAll('.title img'),
	navImg = document.querySelector('nav img'),
	navEle = document.querySelector('nav.navbar'),
	navItems = navEle.querySelectorAll('.nav-item'),
	sections = document.querySelectorAll('section, header'),
	loadingPage = document.querySelector('.loading-page'),
	latestContent = document.querySelector('#Latest .content'),
	featuredContentRow = document.querySelector('#Featured .content .row'),
	html = document.querySelector('html'),
	newSrc;

//check scroll to remove opacity from nav when page loaded
checkScrollNav();

// if(localStorage.getItem('currentMainColor') != null ){
// 	html.style.setProperty('--main-color',localStorage.getItem('currentMainColor'));
// }else{
// 	updateCurrentColor(getComputedStyle(html).getPropertyValue('--main-color'));
// }

// if(localStorage.getItem('currentImgLogoHref') != null){
// 	logoIcon.href = localStorage.getItem('currentImgLogoHref');
// }else{
// 	updateCurrentImgLogo(logoIcon.href);
// }

// if(localStorage.getItem('currentNavImg') != null){
// 	navImg.src = localStorage.getItem('currentNavImg');
// }else{
// 	updateCurrentNavImg(navImg.src);
// }

// if(localStorage.getItem('currentsectionImg') != null){
// 	sectionImgs.forEach(function(sectionImg){
// 		sectionImg.src = localStorage.getItem('currentsectionImg');
// 	});
// }else{
// 	updateCurrentsectionImg(sectionImgs[0].src);
// }




nextCarousel.addEventListener('click',function(){
	let currentSlide = scCarousel.querySelector(".SC-Carousel-item.active"),
		newSlide = currentSlide.nextElementSibling ?? scCarousel.querySelector(".SC-Carousel-item:first-child"),
		currentColor = newSlide.dataset.colorName;
	currentSlide.classList.remove('active');
	newSlide.classList.add('active');
	changeMainColor(currentColor);
	updateImgLogo(currentColor);
	changeImg(currentColor,logoEle,'logo');
	// updateCurrentImg(newSrc);
	sectionImgs.forEach(function(img){
		changeImg(currentColor,img,'correct');
	});
	// updateCurrentsectionImg(newSrc);
});

prevCarousel.addEventListener('click',function(){
	let currentSlide = scCarousel.querySelector(".SC-Carousel-item.active"),
		newSlide = currentSlide.previousElementSibling ?? scCarousel.querySelector(".SC-Carousel-item:last-child"),
		currentColor = newSlide.dataset.colorName;
	currentSlide.classList.remove('active');
	newSlide.classList.add('active');
	changeMainColor(currentColor);
	updateImgLogo(currentColor);
	changeImg(currentColor,logoEle,'logo');
	// updateCurrentImg(newSrc);
	sectionImgs.forEach(function(img){
		changeImg(currentColor,img,'correct');
	});
	// updateCurrentsectionImg(newSrc);
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

//when page loaded
window.addEventListener('DOMContentLoaded',function(){
	loadingPage.classList.add('hide');
	setTimeout(function(){
		loadingPage.classList.add('d-none');
	},1000);
});
/*prepareImagesList*/
latest.forEach(function(product){
	latestContent.innerHTML += `
		<div class="product mainBorder rounded-3 pt-3 px-3 mb-3">
			<div class="row">
				<div class="col-lg-6 part1">
					<div class="item">
						<div class="row">
							<div class="col-lg-2">
								<div class="item">
									<ul class="list-unstyled d-flex column-gap-2 flex-md-column row-gap-md-2">
										${prepareImagesList(product.images)}
									</ul>
								</div>
							</div>
							<div class="col-lg-10">
								<div class="item h-100">
									<div class="h-100 selectedImgDiv">
										<img src="images/products/${product.images[0]}" class="selectedImg" alt="products">
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="col-lg-6 part2">
					<div class="item mb-4">
						<h3 class="mainColor fw-normal">${product.name}</h3>
						<p>${product.description}</p>
						<div class="info d-flex mb-2">
							<h6 class="price fw-bolder mb-0 me-3">Price :</h6>
							${preparePrices(product.price,product.discount)}
						</div>
						<div class="info d-flex mt-3">
							<h6 class="size fw-bolder mb-0 me-3">Size :</h6>
							<ul class="list-unstyled d-flex column-gap-2">
								${prepareSizeList(product.sizes)}
							</ul>
						</div>
						<button class="btn mainColor mainButton">Add To Cart</button>
					</div>
				</div>
			</div>
				</div>
	`;
});

features.forEach(function(product){
	featuredContentRow.innerHTML += `
		<div class="col-lg-3">
			<div class="item">
				<div class="product">
					<p class="discount text-center ${(product.discount == 0) ? 'd-none': ''}">-${product.discount * 100}%</p>
					<div class="head mb-5">
						<img src="images/products/${product.images[0]}" class="img-fluid selectedImg" alt="shoes image">
						<i class="fa-solid fa-magnifying-glass search rounded-circle"></i>
						<ul class="list-unstyled indicators d-flex column-gap-2">
							${prepareIndicators(product.images)}
						</ul>
					</div>
					<div class="body text-center">
						<h6 class="fw-light">${product.name}</h6>
						${preparePrices(product.price,product.discount)}
					</div>
				</div>
			</div>
		</div>
	</div>
	`;
});