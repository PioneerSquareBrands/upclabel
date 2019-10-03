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
		$('#' + brand + '_upc-svg').siblings('.' + brand + '_svg-sub .svg-sub-wrap').html('');
		$('.' + brand + '_svg-sub').css({'width': $('#' + brand + '_upc-svg').attr('width'), 'height': $('#' + brand + '_upc-svg').attr('height')})
		$('#' + brand + '_upc-svg g text').each(function(i) {
			var posTop = $(this).parent('g').attr('transform').replace('translate(', '').replace(')', '').replace(',', '').split(' ')[1];
			var posLeft = $(this).parent('g').attr('transform').replace('translate(', '').replace(')', '').replace(',', '').split(' ')[0];
			$(this).parent('g').attr('id', 'svg_clear_' + i);
			var posMar = 0;
			if( i > 0 ) {
				posMar = (document.getElementById('svg_clear_' + i).getBoundingClientRect().left) - ((document.getElementById('svg_clear_' + (i - 1)).getBoundingClientRect().left) + document.getElementById('svg_clear_' + (i - 1)).getBoundingClientRect().width);
			}
			var posWid = document.getElementById('svg_clear_' + i).getBoundingClientRect().width + 'px';
			var posHyt = document.getElementById('svg_clear_' + i).getBoundingClientRect().height + 'px';
			var posText = $(this).text();
			var upcParent = $(this).parents('.upc-container');

			console.log($(this).parent('g').attr('transform').replace('translate(', '').replace(')', '').replace(',', '').split(' ')[0]);
			$(upcParent).find('.' + brand + '_svg-sub .svg-sub-wrap').append('<span class="clear-svg" style="margin-left: ' + posMar + 'px; width: ' + posWid + '; height: ' + posHyt + '; left: ' + posLeft + 'px; top: ' + posTop + 'px;"><span style="position: absolute;display: block;top: 99px;">' + posText + '</span></span>');

			// Hide svg texts
			$(this).hide();
		});
		// End Barcode Number fix/hack

		// Description Fill and validation
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

		// SKU Fill and validation
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

	html2pdf().set(opt).from(element, 'element').save();
});

/* 
	git fetch --all
	git reset --hard origin/master

	to overwrite local copy from repository
*/