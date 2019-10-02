$(document).foundation()

$(window).on('load', function() {
	switchDefault();
	$('#generator_form').trigger('change');
});

function generate() {
	var brand = $('#brand').val();
	var upcHeading = $('#upc_header').val();
	$('.upc-label--heading').text(upcHeading);

	if (brand == 'GD') {
		$('#gd_label').show();
		$('#bh_label').hide();

		var itemMaster = $('#item_master').val();
		var upc = $('#upc').val();
		var sku = $('#sku').val();
		var desc = $('#description').val();
		var qtyLabel = $('#quantity_label').val();
		var qty = $('input[name="qty"]:checked').val();
		var qr = $('#qr').val();

		JsBarcode("#gd_label #upc-svg", upc, {format: "upc"});
		$('#gd_label .master-container').text(itemMaster);
		$('#gd_label .description-container').text(desc);
		$('#gd_label .sku-container').text(sku);
		$('#gd_label .quantity-container .qty-label').text(qtyLabel + ':')
		$('#gd_label .quantity-container .qty-val').text(qty)
		$('#gd_label #qrcode').html('');
		$('#gd_label #qrcode').qrcode({width: 75, height: 75, text: qr});
		$('#gd_label .qr-link').text(qr);
	} 
	else if(brand == 'BH') {
		$('#bh_label').show();
		$('#gd_label').hide();

		var itemMaster = $('#item_master').val();
		var upc = $('#upc').val();
		var sku = $('#sku').val();
		var desc = $('#description').val();
		var qtyLabel = $('#quantity_label').val();
		var qty = $('input[name="qty"]:checked').val();
		var qr = $('#qr').val();

		JsBarcode("#bh_label #upc-svg", upc, {format: "upc"});
		$('#bh_label .master-container').text(itemMaster);
		$('#bh_label .description-container').text(desc);
		$('#bh_label .sku-container').text(sku);
		$('#bh_label .quantity-container .qty-label').text(qtyLabel + ':')
		$('#bh_label .quantity-container .qty-val').text(qty)
		$('#bh_label #qrcode').html('');
		$('#bh_label #qrcode').qrcode({width: 75, height: 75, text: qr});
		$('#bh_label .qr-link').text(qr);
	}
}

function switchDefault() {
	$('.switch-default').each(function() {
		var brand = $('#brand').val().toLowerCase();
		var defVal = $(this).data(brand);
		$(this).val(defVal);
	});
}

$('#generator_form').on('change keyup paste', function(e) {
	generate();
});

$('#generate').on('click', function(e) {
	e.preventDefault();
	generate();
});

$('#brand').on('change', function() {
	switchDefault();
})

$('#download-pdf').on('click', function(e) {
	e.preventDefault();
	var brand = $('#brand').val();
	var itemMaster = $('#item_master').val();
	var qtyLabel = $('#quantity_label').val().replace(' ', '_');
	var qty = $('input[name="qty"]:checked').val();

	var fileName =  brand + '-' + itemMaster + ' (' + qtyLabel + '-' + qty + ').pdf';
	var element = document.getElementById('generated_wrapper');
	var opt = {
		margin: 1,
		filename: fileName,
		image: { type: 'png' },
		html2canvas: { scale: 2 },
		jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
	};

	html2pdf().set(opt).from(element, 'element').save();
});

/* 
	git fetch --all
	git reset --hard origin/master

	to overwrite local copy from repository
*/