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

// function prepareSizeList(sizes){
// 	let sizeList = "";
// 	sizes.forEach(function(size,index){
// 		sizeList += `
// 			<li class="mainBorder rounded-2 mainButton ${(index == 0) : "active" : ""}">${size}</li>
// 		`;
// 	});
// }

function prepareImagesList(images){
	let imagesList = "";
	images.forEach(function(img){
		imagesList += `
			<li class="rounded-2 mainBorder"><img src="images/products/${img}" alt="products" class="img-fluid"></li>
		`;
	});
	return imagesList;
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