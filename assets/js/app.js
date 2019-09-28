$(document).foundation()
JsBarcode("#upc-svg", '11111111111', {format: "upc"});


$('#generate').on('click', function(e) {
	e.preventDefault();

	var itemMaster = $('#item_master').val();
	var upc = $('#upc').val();
	var sku = $('#sku').val();
	var desc = $('#description').val();
	var qr = $('#qr').val();

	JsBarcode("#upc-svg", upc, {format: "upc"});
	$('.master-container').text(itemMaster);
	$('.description-container').text(desc);
	$('.sku-container').text(sku);
	//$('.quantity-container').text('qr')
});