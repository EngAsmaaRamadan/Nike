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
	popupBoxes = document.querySelectorAll('.popup .popup-box'),
	alert = document.querySelector('.popup[data-popup-name="shop"] .body .alert'),
	navButton = document.querySelector('.navbar-toggler'),
	buyButton = document.querySelector('.popup[data-popup-name="shop"] .body .buy'),
	navUlDiv = document.querySelector('.sc-collapse'),
	cartProducts = [];

//check scroll to remove opacity from nav when page loaded
checkScrollNav();

if(localStorage.getItem('cartProducts') == null){
	updateordersInLocalStorage();
}else{
	cartProducts = JSON.parse(localStorage.getItem('cartProducts'));
}

if(localStorage.getItem('currentMainColor') != null ){
	html.style.setProperty('--main-color',localStorage.getItem('currentMainColor'));
}else{
	updateCurrentColor(getComputedStyle(html).getPropertyValue('--main-color'));
}

if(localStorage.getItem('lastActiveSliderIndex') != null){
	let currentIndex = JSON.parse(localStorage.getItem('lastActiveSliderIndex')),
		currentActiveSlider = scCarousel.querySelector(`.SC-Carousel-item[data-index-item="${currentIndex}"]`);
	currentActiveSlider.classList.add('active');
	if(currentIndex != 0 ){
		scCarousel.querySelector(`.SC-Carousel-item:first-child`).classList.remove('active');
	}
}else{
	scCarousel.querySelector(`.SC-Carousel-item:first-child`).classList.add('active');
}

if(localStorage.getItem('currentImgLogoHref') != null){
	logoIcon.href = localStorage.getItem('currentImgLogoHref');
}else{
	updateCurrentImgLogo(logoIcon.href);
}

if(localStorage.getItem('currentsectionAndNavImagesSrc') != null){
	let sources = JSON.parse(localStorage.getItem('currentsectionAndNavImagesSrc'));
	logoEle.src = sources[0];
	sectionImgs.forEach(function(sectionImg,index){
		sectionImg.src = sources[index + 1];
	});
}else{
	let srcArr = [];
	srcArr.push(logoEle.src)
	sectionImgs.forEach(function(sectionImg){
		srcArr.push(sectionImg.src);
	});
	updateCurrentsectionAndNavImagesSrc(srcArr);
}




nextCarousel.addEventListener('click',function(){
	let currentSlide = scCarousel.querySelector(".SC-Carousel-item.active"),
		newSlide = currentSlide.nextElementSibling ?? scCarousel.querySelector(".SC-Carousel-item:first-child"),
		currentColor = newSlide.dataset.colorName;
	currentSlide.classList.remove('active');
	newSlide.classList.add('active');
	updateActiveSlider(newSlide.getAttribute('data-index-item'));
	changeMainColor(currentColor);
	updateImgLogo(currentColor);
	let newSrcArr = [];
	newSrcArr.push(changeImg(currentColor,logoEle,'logo'));
	sectionImgs.forEach(function(img){
		newSrcArr.push(changeImg(currentColor,img,'correct'));
	});
	updateCurrentsectionAndNavImagesSrc(newSrcArr);
});

prevCarousel.addEventListener('click',function(){
	let currentSlide = scCarousel.querySelector(".SC-Carousel-item.active"),
		newSlide = currentSlide.previousElementSibling ?? scCarousel.querySelector(".SC-Carousel-item:last-child"),
		currentColor = newSlide.dataset.colorName;
	currentSlide.classList.remove('active');
	newSlide.classList.add('active');
	updateActiveSlider(newSlide.getAttribute('data-index-item'));
	changeMainColor(currentColor);
	updateImgLogo(currentColor);
	let newSrcArr = [];
	newSrcArr.push(changeImg(currentColor,logoEle,'logo'));
	sectionImgs.forEach(function(img){
		newSrcArr.push(changeImg(currentColor,img,'correct'));
	});
	updateCurrentsectionAndNavImagesSrc(newSrcArr);
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

latest.forEach(function(product){
	let isProductIntoCart = checkIfProductIntoCart(product.id);
	latestContent.innerHTML += `
		<div class="product mainBorder rounded-3 pt-3 px-3 mb-3" data-selected-color="${isProductIntoCart?.color ?? product.colors[0]}" data-selected-size="${isProductIntoCart?.size ?? product.sizes[0]}" data-product-id="${product.id}" data-type="show">
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
							<ul class="list-unstyled d-flex column-gap-2 size">
								${prepareSizeList(product.sizes,isProductIntoCart)}
							</ul>
						</div>
						
						${
						(isProductIntoCart == null)? 
						`<button class="btn mainColor mainButton" onclick="addToCart(this,${product.id});toggleBtn(this,'remove');">Add To Cart</button>`
						:
						`<button class="btn mainColor mainButton remove" onclick="removeFromCart(this,${product.id});toggleBtn(this,'add');">Remove From Cart</button>`
						}

					</div>
				</div>
			</div>
				</div>
	`;
});

features.forEach(function(product){
	featuredContentRow.innerHTML += `
		<div class="col-lg-3 part" data-type="show">
			<div class="item">
				<div class="product" data-product-id="${product.id}">
					<p class="discount text-center ${(product.discount == 0) ? 'd-none': ''}">-${product.discount * 100}%</p>
					<div class="head mb-5">
						<img src="images/products/${product.images[0]}" class="img-fluid selectedImg" alt="shoes image">
						<i class="fa-solid fa-magnifying-glass search rounded-circle"onclick="showProduct(${product.id});"></i>
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

popupBoxes.forEach(function(popupBox){
	popupBox.addEventListener('click',function(e){
	e.stopPropagation();
	});
});

navButton.addEventListener('click',function(){
	if(navButton.className.includes('hide')){
		navUlDiv.classList.add('active');
		setTimeout(function(){
			navUlDiv.classList.add('show');
			navUlDiv.closest('nav.navbar').classList.add('show');
		},500);
		navButton.classList.remove('hide');
	}else{
		navUlDiv.classList.remove('show');
		navUlDiv.closest('nav.navbar').classList.remove('show');
		setTimeout(function(){
			navUlDiv.classList.remove('active');
		},500);
		navButton.classList.add('hide');
	}
});
