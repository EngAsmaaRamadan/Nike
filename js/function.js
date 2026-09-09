function changeMainColor(colorName){
	let currentColor = getComputedStyle(html).getPropertyValue(`--${colorName}-color`);
	html.style.setProperty('--main-color',currentColor);
	// updateCurrentColor(currentColor);
}

function changeImg(imgName,imgEle,common){
	console.log(imgEle);
	let imgSrc = imgEle.src,
		imgSrcArr = imgSrc.split('/');
	imgSrcArr[imgSrcArr.length - 1] = `${imgName}-${common}.png`;
	newSrc = imgSrcArr.join('/');
	imgEle.setAttribute('src',newSrc);
}

function updateImgLogo(imgName){
	let imgHref = logoIcon.href,
		imgHrefArr = imgHref.split('/');
	imgHrefArr[imgHrefArr.length - 1] = `${imgName}-logo.png`;
	let newHref = imgHrefArr.join('/');
	logoIcon.href = newHref;
	// updateCurrentImgLogo(newHref);
}

function checkScrollNav(){
	if(window.scrollY >= 10){
		navEle.classList.add('scrolled');
	}else{
		navEle.classList.remove('scrolled');
	}
}

function updateNavItem(sectionId){
	let section = document.querySelector(`#${sectionId}`),
		sectionTop = section.offsetTop,
		sectionHeight = section.clientHeight,
		navHeight = navEle.clientHeight,
		sectionTopWithNavHeight = sectionTop - navHeight,
		sectionBottom = sectionTop + sectionHeight;
	
	if(window.scrollY >= sectionTopWithNavHeight && window.scrollY <= sectionBottom){
		let currentNavItem = navEle.querySelector('.nav-item.active'),
			navLinkOfSection = document.querySelector(`a[href="#${section.id}"]`);
			currentNavItem.classList.remove('active');
			navLinkOfSection.parentElement.classList.add('active');
	}
}

function preparePrices(price,discount){
	return `
		<p class="value mb-0">
			<span class="text-decoration-line-through mainColor ${(discount == 0) ? 'd-none' : '' }">${price} <sup>$</sup></span> <span class="fw-semibold">${(price * (1 - discount)).toFixed(2)} <sup>$</sup></span>
		</p>
	`;
}

function prepareSizeList(sizesList){
	let liElements = "";
	sizesList.forEach(function(size,index){
		liElements += `
			<li class="mainBorder rounded-2 mainButton ${(index == 0)? 'active' : ''}">${size}</li>
		`;
	});
	return liElements;
}

function prepareImagesList(imagesList){
	let liElements = "";
	imagesList.forEach(function(image){
		console.log(image);
		liElements += `
			<li class="rounded-2 mainBorder"><img src="images/products/${image}" onclick="changeSelectedImg(this,'${image}');" alt="products" class="img-fluid"></li>
		`;
	});
	return liElements;
}

function changeSelectedImg(that,imageName,isIndicator = false){
	let productDiv = that.closest('.product'),
		selectedImg = productDiv.querySelector('.selectedImg'),
		selectedImgSrc = selectedImg.src,
		selectedImgSrcArr = selectedImgSrc.split('/');
	selectedImgSrcArr[selectedImgSrcArr.length - 1] = imageName;
	selectedImgNewSrc = selectedImgSrcArr.join('/');
	selectedImg.src = selectedImgNewSrc
	if(isIndicator){
		let currentActiveIndicator = that.parentElement.querySelector('.active');
		currentActiveIndicator.classList.remove('active');
		that.classList.add('active');
	}
}

function prepareIndicators(imagesList){
	let liElements = "";
	imagesList.forEach(function(image,index){
		liElements += `
			<li class="mainBorder ${(index == 0)? 'active' : ''}" onclick="changeSelectedImg(this,'${image}',true);"></li>
		`;
	});
	return liElements;
}

// function updateCurrentColor(currentColor){
// 	localStorage.setItem('currentMainColor',currentColor);
// }

// function updateCurrentImgLogo(currentHref){
// 	localStorage.setItem('currentImgLogoHref',currentHref);
// }

// function updateCurrentNavImg(imgSrc){
// 	localStorage.setItem('currentNavImg',imgSrc);
// }

// function updateCurrentsectionImg(imgSrc){
// 	localStorage.setItem('currentsectionImg',imgSrc);
// }