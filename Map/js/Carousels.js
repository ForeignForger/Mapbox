function initializeCaroulsel(elementId){
	$('#' + elementId + '-carousel').owlCarousel({
		autoplay: true,
		autoplayTimeout: 2000,
		loop: true,
		margin: 0,
		nav: false,
		items: 1
	});
}
