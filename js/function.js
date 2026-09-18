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
			<span class="text-decoration-line-through mainColor ${(discount == 0) ? 'd-none' : '' }">${price} <sup>$</sup></span> <span class="fw-semibold"><span class="latestPrice"> ${ (Number.isInteger(newPrice) ) ? (newPrice) : newPrice.toFixed(2) }</span> <sup>$</sup></span>
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

function changeActive(that,productId = 0,isPopup){
	if(productId == 0){
		let currentActiveIndicator = that.parentElement.querySelector('.active');
			currentActiveIndicator.classList.remove('active');
			that.classList.add('active');
	}else{
		let product;
		if(isPopup != null){
			product = document.querySelector(`.popup .product[data-product-id="${productId}"]`),
			productOriginalData = getProduct(productId);	
		}else{
			product = document.querySelector(`.product[data-product-id="${productId}"]`),
			productOriginalData = getProduct(productId);
		}
		
		console.log(productId,product,productOriginalData);
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

function prepareIndicators(imagesList,isProductIntoCart = null){
	let liElements = "";
	imagesList.forEach(function(image,index){
		liElements += `
			<li class="mainButton ${(index == 0)? 'active' : ''}" onclick="changeSelectedImg(this,'${image}');changeActive(this,0,1);"></li>
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
				<div class="col-md-6">
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
		<div class="col-md-6 part2">
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
				<div class="info d-flex mb-2">
					<h6 class="color fw-bolder mb-0 me-3">Color  :</h6>
					<ul class="list-unstyled d-flex column-gap-2 mb-2 color">
						${prepareColorList(currentProduct.colors,isProductIntoCart)}
					</ul>

				</div>
					${
						(isProductIntoCart == null)? 
						`<button class="btn mainColor mainButton" onclick="addToCart(this,${currentProduct.id});toggleBtn(this,'remove');">Add To Cart</button>`
						:
						`<button class="btn mainColor mainButton remove" onclick="removeFromCart(this,${currentProduct.id},'shop');toggleBtn(this,'add');">Remove From Cart</button>`
					}						
			</div>
		</div>
			</div>
			</div>

		
	`;
	openPopup('product');
}

function checkIfProductIntoCart(productId,typeOfProducts = cartProducts,productType){
	let result = typeOfProducts.filter( (typeOfProduct) => typeOfProduct.id == productId);
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
			color: product.getAttribute('data-selected-color'),
			selectedImgSrc: product.querySelector('img.selectedImg').src,
		};
	cartProducts.push(newOrder);
	updateordersInLocalStorage();
	toggleBtn(that,'remove');
	that.setAttribute('onclick',`removeFromCart(this,${productId},'shop')`);
}

function addToFavouriteCart(that,productId,isFeatures){
	let isIcon = (that.className.includes('favouriteIcon') ? true : false),
		iconAnimate;
	console.log(isIcon,isFeatures);
	if(isIcon == true){
		let product;
		if(isFeatures == true){
			product = that.parentElement.querySelector('.product');
			console.log(product);
			iconAnimate = product.parentElement.querySelector('.heart');
			iconAnimate.classList.add('animate');
			updateAttributes(product,productId,isFeatures,true);
		}else if(isFeatures == false){
			product = that.parentElement;
			updateAttributes(product,productId,isFeatures,true);
		}
		
	}else if(isIcon == false){
		if(isFeatures == true){
			iconAnimate = that.parentElement.querySelector('.heart');
			iconAnimate.classList.add('animate');
			updateAttributes(that,productId,isFeatures,false);
		}else if(isFeatures == false){
			updateAttributes(that,productId,isFeatures,false);
		}
	}
	
}

function updateAttributes(that,productId,isFeatures,isIcon){
	let currentThat;
	if(isIcon == true){
		if(isFeatures == true){
			currentThat = that.closest('.item').querySelector('.product');	
		}else if(isFeatures == false){
			currentThat = that;
		}	
	}else{currentThat = that;}
	console.log(currentThat);
	let newOrder = {
			id: productId,
			size: currentThat.getAttribute('data-selected-size'),
			color: currentThat.getAttribute('data-selected-color'),
			selectedImgSrc: currentThat.querySelector('img.selectedImg').src,
		};
		updateWhenAdd(that,newOrder,isFeatures);
		
}

function updateWhenAdd(that,newOrder,isFeatures){
		if(that.getAttribute('data-favourite-type') == "add"){
				favouriteProducts.push(newOrder);
				updateFavouritesInLocalStorage();
				that.setAttribute('data-favourite-type','delete');
					if(isFeatures == true){
						let iconHeart = that.closest('.item').querySelector('.favouriteIcon'),
							heartAnimation = that.closest('.item').querySelector('.heart');
						heartAnimation.classList.add('animate');
						iconHeart.classList.remove('fa-regular');
						iconHeart.classList.add('fa-solid');
						that.closest('.item').classList.add('favourited');	
					}else if(isFeatures == false){
						let iconHeart = that.querySelector('.favouriteIcon');
						iconHeart.classList.remove('fa-regular');
						iconHeart.classList.add('fa-solid');
						that.classList.add('favourited');
					}
		}else if(that.getAttribute('data-favourite-type') == 'delete'){
			favouriteProducts.pop(newOrder);
			updateFavouritesInLocalStorage();
			that.setAttribute('data-favourite-type','add');

			if(isFeatures == true){
				let iconHeart = that.closest('.item').querySelector('.favouriteIcon'),
						heartAnimation = that.closest('.item').querySelector('.heart');
					heartAnimation.classList.remove('animate');
				iconHeart.classList.add('fa-regular');
				iconHeart.classList.remove('fa-solid');
				that.closest('.item').classList.remove('favourited');	
			}else if(isFeatures == false){
				let iconHeart = that.querySelector('.favouriteIcon');
				iconHeart.classList.add('fa-regular');
				iconHeart.classList.remove('fa-solid');
				that.classList.remove('favourited');
			}
		}
}

function updateWhenRemove(that,isFeatures){
	console.log(that);
	console.log('before remove favourite');
		if(that.getAttribute('data-favourite-type') == "add"){
				
			that.setAttribute('data-favourite-type','delete');
				if(isFeatures == true){
					let iconHeart = that.closest('.item').querySelector('.favouriteIcon'),
						heartAnimation = that.closest('.item').querySelector('.heart');
					heartAnimation.classList.add('animate');
					iconHeart.classList.remove('fa-regular');
					iconHeart.classList.add('fa-solid');
					that.closest('.item').classList.add('favourited');	
				}else if(isFeatures == false){
					let iconHeart = that.querySelector('.favouriteIcon');
					iconHeart.classList.remove('fa-regular');
					iconHeart.classList.add('fa-solid');
					that.classList.add('favourited');
				}
		}else if(that.getAttribute('data-favourite-type') == 'delete'){
			console.log('when deleting',isFeatures);
			that.setAttribute('data-favourite-type','add');
			if(isFeatures == true){
				console.log('when deleting on true');
				let iconHeart = that.closest('.item').querySelector('.favouriteIcon'),
					heartAnimation = that.closest('.item').querySelector('.heart');
				heartAnimation.classList.remove('animate');
				iconHeart.classList.add('fa-regular');
				iconHeart.classList.remove('fa-solid');
				that.closest('.item').classList.remove('favourited');
				console.log('done remove favourite');
			}else if(isFeatures == false){
				console.log('when deleting on false');
				let iconHeart = that.querySelector('.favouriteIcon');
				iconHeart.classList.add('fa-regular');
				iconHeart.classList.remove('fa-solid');
				that.classList.remove('favourited');	
			}
		}
}

function removeFromCartInPopup(that,productId,popupName,isFeatures){
	console.log('hello from removeFromCartInPopup',popupName);
	if(popupName.includes('shop')){
		let btnOfLatestCurrentProduct = document.querySelector(`.product[data-product-id='${productId}'] button`);
		console.log(btnOfLatestCurrentProduct);
		removeFromCart(btnOfLatestCurrentProduct,productId,popupName);
		if(cartProducts.length == 0){
		console.log('hello');
		let alert = document.querySelector(`.popup .alert.${popupName}`);
		alert.classList.remove('d-none');
		buyButton.classList.add('d-none');
	}
	}else if(popupName.includes('favourite')){
		let product = document.querySelector(`.product[data-product-id="${productId}"]`);
		if(isFeatures == true){
			updateWhenRemove(product,true);
		}else if(isFeatures == false){
			console.log('it is latest');
			updateWhenRemove(product,false);
		}

		removeFromCart(that,productId,popupName);
		if(favouriteProducts.length == 0){
			let alert = document.querySelector(`.popup .alert.${popupName}`);
			alert.classList.remove('d-none');
		}else{
			let alert = document.querySelector(`.popup .alert.${popupName}`);
			alert.classList.add('d-none');
		}
	}
	
	that.parentElement.parentElement.parentElement.remove();
	
}

function removeFromCart(that,productId,popupName){
	console.log('in fn removeFromCart',popupName,that);
	if(popupName.includes('shop')){
		cartProducts = cartProducts.filter( (cartProduct) => cartProduct.id != productId);
		updateordersInLocalStorage();
	}else if(popupName.includes('favourite')){
		favouriteProducts = favouriteProducts.filter( (favouriteProduct) => favouriteProduct.id != productId);
		updateFavouritesInLocalStorage();

	}
	if(that != null && popupName.includes('shop')){
		toggleBtn(that,'add');
		that.setAttribute('onclick',`addToCart(this,${productId})`);
		changeActive(that,productId,that.closest('.popup'));
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

function showProductsInPopup(popupName,typeOfProducts){
	let productsContent = document.querySelector(`.popup[data-popup-name="${popupName}"] .row`),
		 featuresIds = [];
		 
	features.forEach(function(feature){
		featuresIds.push(feature.id);
	});
	if(typeOfProducts.length == 0){
		let alert = document.querySelector(`.popup .alert.${popupName}`);
		alert.classList.remove('d-none');
		shopDoneAlert.classList.add('d-none');
		if(popupName.includes('shop')){
			buyButton.classList.add('d-none');
		}
		productsContent.innerHTML = '';
	}else{
		let alert = document.querySelector(`.popup .alert.${popupName}`);
		alert.classList.add('d-none');
		if(popupName.includes('shop')){
			buyButton.classList.remove('d-none');
		}
		productsContent.innerHTML = '';
		if(popupName.includes('shop')){
			typeOfProducts = cartProducts;
		}else if(popupName.includes('favourite')){
			typeOfProducts = favouriteProducts;
		}
		console.log(featuresIds);
		console.log(typeOfProducts,favouriteProducts);
	typeOfProducts.forEach(function(typeOfProduct){
		let product = getProduct(typeOfProduct.id);
		console.log(product);
			let cur_product = document.querySelector(`.popup[data-popup-name="product"] .product[data-product-id="${product.id}"]`),
			cur_productSelectedImgSrc = typeOfProduct.selectedImgSrc,
			isFeatures;
			featuresIds.forEach(function(id){
				if(typeOfProduct.id == id){
					isFeatures = true;
				}
			});
			isFeatures = (isFeatures != true) ? false : true ;
		productsContent.innerHTML += `
			<div class="col-sm-6 col-md-4">
				<div class="item text-start">
					<div class="product">
						<img src="${cur_productSelectedImgSrc}" alt="products" class="img-fluid">
						<h4 class="fw-normal mb-3">${(product.name).slice(0,14)}...</h4>
						
						<div class="info d-flex mb-2">
							<h6 class="price fw-bolder mb-0 me-3">Price :</h6>
							${preparePrices(product.price,product.discount)}
						</div>

						<div class="info d-flex mt-3">
							<h6 class="size fw-bolder mb-0 me-3">Size :</h6>
							<ul class="list-unstyled d-flex column-gap-2 size">
								${prepareSizeList([typeOfProduct.size])}
							</ul>
						</div>
						<div class="info d-flex">
							<h6 class="color fw-bolder mb-0 me-3">Color  :</h6>
							<ul class="list-unstyled d-flex column-gap-2 mb-2 color">
								${prepareColorList([typeOfProduct.color])}
							</ul>

						</div>
						<button class="btn btn-danger w-100 mt-3" onclick="removeFromCartInPopup(this,${product.id},'${popupName}',${isFeatures});">Remove</button>
					</div>
				</div>
			</div>
				</div>
		`;
	});
	}
	openPopup(popupName);
}

function openPopup(popupName){
	console.log(popupName);
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

function closePopupBuy(){//in case one more than another popup.active
	let popup = document.querySelector(`.popup-buy.active`);
	popup.classList.remove('show');
	setTimeout(function(){
		popup.classList.remove('active');
	},500);
}

function search(searchButton){
	let allProductsHidden = document.querySelectorAll('[data-type="hide"]');
	if(allProductsHidden.length > 0){
		allProductsHidden.forEach(function(product){
			product.setAttribute('data-type','show');
		});
	}
	
	let searchValue = searchButton.parentElement.querySelector('input').value;
	if(searchValue !=''){
		let existedIds = [],
		result = products.filter(function(product){
			return product.name.toLowerCase().includes(searchValue.toLowerCase());
		});
		if(result.length > 0){
				result.forEach(function(product){
				existedIds.push(product.id);
			});
			hideAllNotMatchedProducts(existedIds);	
		}else{
			let statementWhenEmpty = document.querySelector('.popup .statement');
			statementWhenEmpty.textContent = "please try in different words";
			openPopup('search');
		}
		
	}else{
		let statementWhenEmpty = document.querySelector('.popup .statement');
		statementWhenEmpty.textContent = "please write something to search";
		openPopup('search');
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
				currentRemoveLatestProduct.setAttribute('data-type','hide');
			}else if(features.includes(notMatchedProduct)){
				let currentRemoveFeaturesProduct = document.querySelector(`.product[data-product-id="${notMatchedProduct.id}"]`);
				let currentRemoveProduct = currentRemoveFeaturesProduct.parentElement.parentElement;
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

function buyNow(that){
	let popup = that.closest('.popup'),
		totalPrice = 0;
	productsInPopupShop = popup.querySelectorAll('.product');
	console.log(productsInPopupShop);
	productsInPopupShop.forEach(function(product){
		console.log(totalPrice)
		totalPrice += Number(product.querySelector('.latestPrice').textContent);
	});
	console.log(totalPrice);
	let popupBuy = document.querySelector('.popup[data-popup-name="buy"]'),
		spanContent = popupBuy.querySelector('span'),
		popupStatement = popupBuy.querySelector('.statement');
	popupStatement.textContent = "Are you sure to buy this " + productsInPopupShop.length + " products";
	spanContent.textContent = "Total price is " + totalPrice;
	openPopup('buy');
}

function confirmBuy(){
	cartProducts = [];
	updateordersInLocalStorage();
	productsInPopupShop.forEach(function(product){
		product.parentElement.parentElement.remove();
	});
	closePopupBuy();
	buyButton.classList.add('d-none');
	shopDoneAlert.classList.remove('d-none');
	console.log(shopDoneAlert);
}

function updateordersInLocalStorage(){
	localStorage.setItem('cartProducts',JSON.stringify(cartProducts));
}

function updateFavouritesInLocalStorage(){
	localStorage.setItem('favouriteProducts',JSON.stringify(favouriteProducts));
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