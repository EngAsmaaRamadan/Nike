function changeMainColor(colorName){
	let currentColor = getComputedStyle(html).getPropertyValue(`--${colorName}-color`);
	html.style.setProperty('--main-color',currentColor);
	// updateCurrentColor(currentColor);
}

function changeImg(imgName,imgEle,common){
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
	let newPrice = price * (1 - discount);
	return `
		<p class="value mb-0">
			<span class="text-decoration-line-through mainColor ${(discount == 0) ? 'd-none' : '' }">${price} <sup>$</sup></span> <span class="fw-semibold">${ (Number.isInteger(newPrice) ) ? (newPrice) : newPrice.toFixed(2) } <sup>$</sup></span>
		</p>
	`;
}

function prepareSizeList(sizesList,isProductIntoCart){
	let liElements = "";
	if(isProductIntoCart == null){
		sizesList.forEach(function(size,index){
		liElements += `
			<li class="mainBorder rounded-2 mainButton ${(index == 0)? 'active' : ''}" onclick="changeActive(this);updateSelectedSize(this,'${size}');">${size}</li>
		`;
		});	
	}else{
		sizesList.forEach(function(size){
		liElements += `
			<li class="mainBorder rounded-2 mainButton ${(size == isProductIntoCart.size)? 'active' : ''}" onclick="changeActive(this);updateSelectedSize(this,'${size}');">${size}</li>
		`;
		});
	}
	
	return liElements;
}

function updateSelectedSize(that,newSize){
	let product = that.closest('.product');
	product.setAttribute('data-selected-size',newSize);
}

function updateSelectedColor(that,newColor){
	let product = that.closest('.product');
	product.setAttribute('data-selected-color',newColor);
}

function prepareImagesList(imagesList,isProductValue = false){
	let liElements = "";
	imagesList.forEach(function(image){
		liElements += `
			<li class="${(isProductValue)? '': 'mainBorder rounded-2'}"><img src="images/products/${image}" onclick="changeSelectedImg(this,'${image}');" alt="products" class="img-fluid"></li>
		`;
	});
	return liElements;
}

function changeSelectedImg(that,imageName){
	let productDiv = that.closest('.product'),
		selectedImg = productDiv.querySelector('.selectedImg'),
		selectedImgSrc = selectedImg.src,
		selectedImgSrcArr = selectedImgSrc.split('/');
	selectedImgSrcArr[selectedImgSrcArr.length - 1] = imageName;
	selectedImgNewSrc = selectedImgSrcArr.join('/');
	selectedImg.src = selectedImgNewSrc
}

function changeActive(that){
	let currentActiveIndicator = that.parentElement.querySelector('.active');
	currentActiveIndicator.classList.remove('active');
	that.classList.add('active');
}

function prepareIndicators(imagesList){
	let liElements = "";
	imagesList.forEach(function(image,index){
		liElements += `
			<li class="mainButton ${(index == 0)? 'active' : ''}" onclick="changeSelectedImg(this,'${image}');changeActive(this);"></li>
		`;
	});
	return liElements;
}

function showProduct(productId){
	let isProductIntoCart = checkIfProductIntoCart(productId),
		popupProductContent = document.querySelector('.popup[data-popup-name="product"] .popup-box'),
		currentProduct = getProduct(productId);
	popupProductContent.innerHTML = `
		<div class="product" data-selected-color="${isProductIntoCart?.color ?? currentProduct.colors[0]}" data-selected-size="${isProductIntoCart?.size ?? currentProduct.sizes[0]}">
			<div class="row">
				<div class="col-lg-6">
			<div class="item">
				<div class="head">
					<img src="images/products/${currentProduct.images[0]}" alt="" class="img-fluid selectedImg">
				</div>
				<div class="body">
					<ul class="list-unstyled d-flex column-gap-3 mb-0">
						${prepareImagesList(currentProduct.images,true)}
					</ul>
				</div>
			</div>
		</div>
		<div class="col-lg-6">
			<div class="item">
				<h3 class="mb-3">${currentProduct.name}</h3>
				${preparePrices(currentProduct.price,currentProduct.discount)}
				<hr>
				<p>${currentProduct.description}</p>

				<div class="info d-flex mt-3">
					<h6 class="size fw-bolder mb-0 me-3">Size :</h6>
					<ul class="list-unstyled d-flex column-gap-2">
						${prepareSizeList(currentProduct.sizes,isProductIntoCart)}
					</ul>
				</div>
				<div class="info d-flex">
					<h6 class="color fw-bolder mb-0 me-3">Color  :</h6>
					<ul class="list-unstyled d-flex column-gap-2 mb-2 color">
						${prepareColorList(currentProduct.colors,isProductIntoCart)}
					</ul>

				</div>
					${
						(isProductIntoCart == null)? 
						`<button class="btn mainColor mainButton" onclick="addToCart(this,${currentProduct.id});toggleBtn(this,'remove');">Add To Cart</button>`
						:
						`<button class="btn mainColor mainButton remove" onclick="removeFromCart(this,${currentProduct.id});toggleBtn(this,'add');">Remove From Cart</button>`
					}						
			</div>
		</div>
			</div>
			</div>

		
	`;
	openPopup('product');
}

function checkIfProductIntoCart(productId){
	let result = cartProducts.filter( (cartProduct) => cartProduct.id == productId);
	return (result.length != 0) ? result[0] : null ;
}

function prepareColorList(colorList,isProductIntoCart){
	let liElements = "";
	if(isProductIntoCart == null){
		colorList.forEach(function(color,index){
		liElements += `
			<li class=" rounded-circle ${(index == 0)? 'active' : 'mainBorder'}" onclick="changeActive(this);updateSelectedColor(this,'${color}');"style="background-color: ${color};"></li>
		`;
		});	
	}else{
		colorList.forEach(function(color){
		liElements += `
			<li class=" rounded-circle ${(color == isProductIntoCart.color)? 'active' : 'mainBorder'}" onclick="changeActive(this);updateSelectedColor(this,'${color}');"style="background-color: ${color};"></li>
		`;
		});
	}
	
	return liElements;
}

function getProduct(productId){
	let result = products.filter( (product) => product.id == productId )[0];
	return result;
}

function addToCart(that,productId){
	let product = that.closest('.product'),
		newOrder = {
			id: productId,
			size: product.getAttribute('data-selected-size'),
			color: product.getAttribute('data-selected-color')
		};

	cartProducts.push(newOrder);
	updateordersInLocalStorage();
	toggleBtn(that,'remove');
	that.setAttribute('onclick',`removeFromCart(this,${productId})`);
}

function removeFromCart(that,productId){
	cartProducts = cartProducts.filter( (cartProduct) => cartProduct.id != productId);
	updateordersInLocalStorage();
	toggleBtn(that,'add');
	that.setAttribute('onclick',`addToCart(this,${productId})`);
}

function toggleBtn(that,status){
	if(status == 'add'){
		that.classList.remove('remove');
		that.textContent = 'Add To Cart';
	}else if(status == 'remove'){
		that.classList.add('remove');
		that.textContent = 'Remove From Cart';
	}
}

function openPopup(popupName){
	let popup = document.querySelector(`.popup[data-popup-name="${popupName}"]`);
	popup.classList.add('active');
	setTimeout(function(){
		popup.classList.add('show');
	},1);
}

function closePopup(){
	let popup = document.querySelector(`.popup.active`);
	popup.classList.remove('show');
	setTimeout(function(){
		popup.classList.remove('active');
	},500);
}

function updateordersInLocalStorage(){
	localStorage.setItem('cartProducts',JSON.stringify(cartProducts));
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