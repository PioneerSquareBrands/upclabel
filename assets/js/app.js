$(document).foundation()
		
$(window).on('load', function() {
	switchDefault();
	$('#generator_form').trigger('change');
});

function generate() {
	// Check the values
	var brand = $('#brand').val().toLowerCase();
	var upcHeading = $('#upc_header').val();
	var itemMaster = $('#item_master').val();
	
	var sku = $('#sku').val();
	var skuLen = $('#sku').val().length;
	
	var desc = $('#description').val();
	var descLen = $('#description').val().length;
	var descLimit = $('#description').data( brand + '-limit' ).split(', ');
	var descMed = descLimit[0];
	var descLong = descLimit[1];
	
	var upc = $('#upc').val();
	var qr = $('#qr').val();
	var qtyLabel = $('#quantity_label').val();
	var qty = $('#qty').val();
	qty.length == 1 ? $('#qty').val('0' + qty) : $('#qty').val(qty);

	$('.upc-label--heading').text(upcHeading);

	$('#' + brand + '_label').each(function() {
		$(this).siblings().hide();
		$(this).show();

		var upcSVG = '#' + brand + '_upc-svg';

		$(this).find('.master-container').text(itemMaster);
		JsBarcode(upcSVG, upc, {
			format: 'upc',
			font: 'OCRB',
			fontSize: 16
		});

		// Font Adjustment for middle barcode
		var upcSelector = ('#' + brand + '_upc-svg g:nth-child(4) text, #' + brand + '_upc-svg g:nth-child(6) text');
		$(upcSelector).css('font', '18px OCRB');

		// Barcode Number fix/hack
		$('#' + brand + '_upc-svg').siblings('.' + brand + '_svg-sub').html('');
		$('#' + brand + '_upc-svg g text').each(function() {
			var posTop = Math.floor($(this).position().top) - Math.floor($('.' + brand + '_svg-sub').offset().top) - 1;
			var posLeft = (Math.floor($(this).position().left) + 2) - Math.floor($('.' + brand + '_svg-sub').offset().left); 
			var posText = $(this).text();
			var upcParent = $(this).parents('.upc-container');
			
			$(upcParent).find('.' + brand + '_svg-sub').append('<span class="clear-svg" style="top: ' + posTop + 'px; left: ' + posLeft + 'px;">' + posText + '</span>');
			$(this).hide();
		});
		// End Barcode Number fix/hack

		$(this).find('.description-container').text(desc);
		if(descLen > descMed && descLen < descLong) {
			$(this).find('.description-container').addClass('desc-medium');	
		} else if(descLen >= descLong ) {
			$(this).find('.description-container').removeClass('desc-medium');	
			$(this).find('.description-container').addClass('desc-long');	
		}
		else {
			$(this).find('.description-container').removeClass('desc-medium');
			$(this).find('.description-container').removeClass('desc-long');
		}

		$(this).find('.sku-container').text(sku);
		if(skuLen > 15) {
			$(this).find('.sku-container').addClass('sku-long');
		} else {
			$(this).find('.sku-container').removeClass('sku-long');
		}

		$(this).find('.quantity-container .qty-label').text(qtyLabel + ':')
		$(this).find('.quantity-container .qty-val').text(qty)
		$(this).find('#qrcode').html('').qrcode({width: 128, height: 128, text: qr});
		$(this).find('.qr-link').text(qr);
	});
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

$('#brand').on('change', function() {
	switchDefault();
});

$('.qr-lock').on('click', function(e) {
	e.preventDefault();
	$('#qr').prop('disabled', function(i, v) { return !v; });
});

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

	svgToCanvas(element);
	html2pdf().set(opt).from(element, 'element').save();
});

/* 
	git fetch --all
	git reset --hard origin/master

	to overwrite local copy from repository
*/