function changeMainColor(colorName){
	let currentColor = getComputedStyle(html).getPropertyValue(`--${colorName}-color`);
	html.style.setProperty('--main-color',currentColor);
	updateCurrentColor(currentColor);
}

function changeImg(imgName,imgEle,common){
	let imgSrc = imgEle.src,
		imgSrcArr = imgSrc.split('/');
	imgSrcArr[imgSrcArr.length - 1] = `${imgName}-${common}.png`;
	let newSrc = imgSrcArr.join('/');
	imgEle.setAttribute('src',newSrc);
	return newSrc;
}

function updateImgLogo(imgName){
	let imgHref = logoIcon.href,
		imgHrefArr = imgHref.split('/');
	imgHrefArr[imgHrefArr.length - 1] = `${imgName}-logo.png`;
	let newHref = imgHrefArr.join('/');
	logoIcon.href = newHref;
	updateCurrentImgLogo(newHref);
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

function prepareSizeList(sizesList,isProductIntoCart = null){
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

function changeActive(that,productId = 0){
	if(productId == 0){
		let currentActiveIndicator = that.parentElement.querySelector('.active');
			currentActiveIndicator.classList.remove('active');
			that.classList.add('active');	
	}else{
		let product = document.querySelector(`.product[data-product-id="${productId}"]`),
			productOriginalData = getProduct(productId);;
		product.setAttribute('data-selected-size',productOriginalData.sizes[0]);
		product.setAttribute('data-selected-color',productOriginalData.colors[0]);
		let currentActiveIndicators = product.querySelectorAll('li.active');
			currentActiveIndicators.forEach(function(currentIndicator){
				currentIndicator.classList.remove('active');
			});
		let defaultIndicators = product.querySelectorAll('ul.size li:first-child, ul.color li:first-child');
		defaultIndicators.forEach(function(defaultIndicator){
			defaultIndicator.classList.add('active');
		});
	}
	
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
		<div class="product" data-product-id="${productId}" data-selected-color="${isProductIntoCart?.color ?? currentProduct.colors[0]}" data-selected-size="${isProductIntoCart?.size ?? currentProduct.sizes[0]}">
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
					<ul class="list-unstyled d-flex column-gap-2 size">
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

function prepareColorList(colorList,isProductIntoCart = null){
	let liElements = "";
	if(isProductIntoCart == null){
		colorList.forEach(function(color,index){
		liElements += `
			<li class=" rounded-circle color ${(index == 0)? 'active' : ''}" onclick="changeActive(this);updateSelectedColor(this,'${color}');"style="background-color: ${color};"></li>
		`;
		});	
	}else{
		colorList.forEach(function(color){
		liElements += `
			<li class=" rounded-circle color ${(color == isProductIntoCart.color)? 'active' : ''}" onclick="changeActive(this);updateSelectedColor(this,'${color}');"style="background-color: ${color};"></li>
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
	if(that != null){
		toggleBtn(that,'add');
		that.setAttribute('onclick',`addToCart(this,${productId})`);
		changeActive(that,productId);
	}
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

function showProductsInPopupShop(){
	let productsContent = document.querySelector('.popup[data-popup-name="shop"] .row');
	if(cartProducts.length == 0){
		alert.classList.remove('d-none');
		buyButton.classList.add('d-none');
	}else{
		alert.classList.add('d-none');
		buyButton.classList.remove('d-none');
		productsContent.innerHTML = '';
	cartProducts.forEach(function(cartProduct){
		let product = getProduct(cartProduct.id);
		productsContent.innerHTML += `
			<div class="col-lg-4">
				<div class="item text-start">
					<div class="product">
						<img src="images/products/${product.images[0]}" alt="products shop" class="img-fluid">
						<h4>${(product.name).slice(0,14)}...</h4>
						
						<div class="info d-flex mb-2">
							<h6 class="price fw-bolder mb-0 me-3">Price :</h6>
							${preparePrices(product.price,product.discount)}
						</div>

						<div class="info d-flex mt-3">
							<h6 class="size fw-bolder mb-0 me-3">Size :</h6>
							<ul class="list-unstyled d-flex column-gap-2 size">
								${prepareSizeList([cartProduct.size])}
							</ul>
						</div>
						<div class="info d-flex">
							<h6 class="color fw-bolder mb-0 me-3">Color  :</h6>
							<ul class="list-unstyled d-flex column-gap-2 mb-2 color">
								${prepareColorList([cartProduct.color])}
							</ul>

						</div>
						<button class="btn btn-danger w-100 mt-3" onclick="removeFromCartInPopup(this,${product.id});">Remove</button>
					</div>
				</div>
			</div>
				</div>
		`;
	});
		
	}
	
	openPopup('shop');
}

function removeFromCartInPopup(that,productId){
	let btnOfLatestCurrentProduct = document.querySelector(`#Latest .product[data-product-id='${productId}'] button`);
	removeFromCart(btnOfLatestCurrentProduct,productId);
	that.parentElement.parentElement.parentElement.remove();
	if(cartProducts.length == 0){
		alert.classList.remove('d-none');
		buyButton.classList.add('d-none');
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

function search(searchButton){
	let allProductsHidden = document.querySelectorAll('.d-none[data-type="hide"]');
	if(allProductsHidden.length > 0){
		allProductsHidden.forEach(function(product){
			product.classList.remove('d-none');
			product.setAttribute('data-type','show');
		});
	}
	
	let searchValue = searchButton.parentElement.querySelector('input').value;
	if(searchValue !=''){
		let existedIds = [],
		result = products.filter(function(product){
			return product.name.toLowerCase().includes(searchValue.toLowerCase());
		});
		result.forEach(function(product){
			existedIds.push(product.id);
		});
		hideAllNotMatchedProducts(existedIds);	
	}
	
}

function hideAllNotMatchedProducts(existedIds){
		let notMatchedProducts = [];
		products.forEach(function(product,productIndex){
			if(!existedIds.includes(product.id)){
				notMatchedProducts.push(product);				
			}
		});
		notMatchedProducts.forEach(function(notMatchedProduct){
			if(latest.includes(notMatchedProduct)){
				let currentRemoveLatestProduct = document.querySelector(`.product[data-product-id="${notMatchedProduct.id}"]`);
				currentRemoveLatestProduct.classList.add('d-none');
				currentRemoveLatestProduct.setAttribute('data-type','hide');
			}else{
				let currentRemoveFeaturesProduct = document.querySelector(`.product[data-product-id="${notMatchedProduct.id}"]`);
				let currentRemoveProduct = currentRemoveFeaturesProduct.parentElement.parentElement;
				currentRemoveProduct.classList.add('d-none');
				currentRemoveProduct.setAttribute('data-type','hide');
			}
		});
		let featuredProducts = document.querySelectorAll('.part[data-type="show"]'),
			latestProducts = document.querySelectorAll('.product[data-type="show"]');;
	scrollToFisrtExist(featuredProducts,latestProducts);
}

function scrollToFisrtExist(featuredProducts,latestProducts){
	let topOfFirstMatch;
	if(featuredProducts.length == 0 && latestProducts.length > 0){
		topOfFirstMatch = latestProducts[0].offsetTop;
		latestProducts.forEach(function(product){
			product.classList.add('searched');
		});
		
		setTimeout(function(){
			latestProducts.forEach(function(product){
					product.classList.remove('searched');	
			});
		},1000);

	}else if(latestProducts.length == 0 && featuredProducts.length > 0){
		topOfFirstMatch = featuredProducts[0].offsetTop;
		featuredProducts.forEach(function(product){
			product.querySelector('.item').classList.add('searched');
		});
		
		setTimeout(function(){
			featuredProducts.forEach(function(product){
					product.querySelector('.item').classList.remove('searched');	
			});
		},1000);
	}else if(latestProducts.length > 0 && featuredProducts.length > 0){
		let arr =[];
		arr.push(latestProducts,featuredProducts);
		topOfFirstMatch = arr[0][0].offsetTop;
		for(let i = 0 ; i < latestProducts.length; i++){
			arr[0][i].classList.add('searched');
			setTimeout(function(){
				arr[0][i].classList.remove('searched');	
			},1000);
		}
		for(let j = 0 ; j < featuredProducts.length ; j++){
			arr[1][j].querySelector('.item').classList.add('searched');
			setTimeout(function(){
				arr[1][j].querySelector('.item').classList.remove('searched');	
			},1000);
		}
	}
	window.scrollTo(0,topOfFirstMatch);
}

function updateordersInLocalStorage(){
	localStorage.setItem('cartProducts',JSON.stringify(cartProducts));
}

function updateCurrentColor(currentColor){
	localStorage.setItem('currentMainColor',currentColor);
}

function updateActiveSlider(lastActiveSliderIndex){
	localStorage.setItem('lastActiveSliderIndex',JSON.stringify(lastActiveSliderIndex));
}

function updateCurrentImgLogo(currentHref){
	localStorage.setItem('currentImgLogoHref',currentHref);
}

function updateCurrentsectionAndNavImagesSrc(imageSrcArr){
	localStorage.setItem('currentsectionAndNavImagesSrc',JSON.stringify(imageSrcArr));
}