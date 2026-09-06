function changeMainColor(colorName){
	let html = document.querySelector('html'),
		currentColor = getComputedStyle(html).getPropertyValue(`--${colorName}-color`);
	html.style.setProperty('--main-color',currentColor);
}

function changeImg(imgName,imgEle,common){
	let imgSrc = imgEle.src,
		imgSrcArr = imgSrc.split('/');
	imgSrcArr[imgSrcArr.length - 1] = `${imgName}-${common}.png`;
	let newSrc = imgSrcArr.join('/');
	imgEle.setAttribute('src',newSrc);
}

function updateImgLogo(imgName){
	let imgHref = logoIcon.href,
		imgHrefArr = imgHref.split('/');
	imgHrefArr[imgHrefArr.length - 1] = `${imgName}-logo.png`;
	let newHref = imgHrefArr.join('/');
	logoIcon.href = newHref;
}

function checkScrollNav(){
	if(window.scrollY >= 10){
		navEle.classList.add('scrolled');
	}else{
		navEle.classList.remove('scrolled');
	}
}