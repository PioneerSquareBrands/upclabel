$(document).foundation()
		
$(window).on('load', function() {
	switchDefault();
	qrSwitch();
	$('#qr').prop('disabled', true);
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

	$('.upc-label--heading').text(upcHeading);

	$('#' + brand + '_label').each(function() {
		$(this).siblings().hide();
		$(this).show();

		var upcSVG = '#' + brand + '_upc-svg';



		$(this).find('.master-container').text(itemMaster);
		JsBarcode(upcSVG, upc, {
			format: 'upc',
			font: 'OCRB',
			fontSize: 16,
			valid:  	function(valid){
				if(valid) {
					$('.validate-upc').removeClass('invalid').addClass('valid').text('Valid UPC');
				} else {
					$('.validate-upc').removeClass('valid').addClass('invalid').text('Invalid UPC');
				}
			}
		});

		// Font Adjustment for middle barcode
		var upcSelector = ('#' + brand + '_upc-svg g:nth-child(4) text, #' + brand + '_upc-svg g:nth-child(6) text');
		$(upcSelector).css('font', '18px OCRB');

		// Barcode Number fix/hack
			// Clear pseudo svg container
		$('#' + brand + '_upc-svg').siblings('.' + brand + '_svg-sub').find('.svg-sub-wrap').html('');
		$('.' + brand + '_svg-sub').css({'width': $('#' + brand + '_upc-svg').attr('width'), 'height': $('#' + brand + '_upc-svg').attr('height')})
		$('#' + brand + '_upc-svg g text').each(function(i) {
			var posTop = $(this).parent('g').attr('transform').replace('translate(', '').replace(')', '').replace(',', '').split(' ')[1];
			var posLeft = $(this).parent('g').attr('transform').replace('translate(', '').replace(')', '').replace(',', '').split(' ')[0];
			$(this).parent('g').attr('id', brand + '_svg_clear_' + i);
			var posMar = 0;
			if( i > 0 ) {
				posMar = (document.getElementById(brand + '_svg_clear_' + i).getBoundingClientRect().left) - ((document.getElementById(brand + '_svg_clear_' + (i - 1)).getBoundingClientRect().left) + document.getElementById(brand + '_svg_clear_' + (i - 1)).getBoundingClientRect().width);
			}
			var posWid = document.getElementById(brand + '_svg_clear_' + i).getBoundingClientRect().width + 'px';
			var posHyt = document.getElementById(brand + '_svg_clear_' + i).getBoundingClientRect().height + 'px';
			var posText = $(this).text();
			var upcParent = $(this).parents('.upc-container');
			$(upcParent).find('.' + brand + '_svg-sub .svg-sub-wrap').append('<span class="clear-svg" style="margin-left: ' + posMar + 'px; width: ' + posWid + '; height: ' + posHyt + '; left: ' + posLeft + 'px; top: ' + posTop + 'px;"><span style="position: absolute;display: block;top: 99px;">' + posText + '</span></span>');

			// Hide svg texts
			$(this).css({'opacity': 0});
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
		var qrWid = $(this).find('#qrcode').width() * 2;
		$(this).find('#qrcode').html('').qrcode({width: qrWid, height: qrWid, text: qr});
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

function qrSwitch() {
	var brand = $('#brand').val().toLowerCase();
	var sku = $('#sku').val();
	var site;
	if(brand == 'gd') {
		site = 'https://gumdropcases.com/'
		if(sku.endsWith('E01-0')){
			sku = sku.slice(0,-5);
			//console.log('Gumdrop SKU ending with E01-0');
		}
	} else if(brand == 'bh') {
		site = 'https://brenthaven.com/'
		if(sku.endsWith('000')){
			sku = sku.slice(0,-3);
			//console.log('Brenthaven SKU ending with 000');
		}
	}
	$('#qr').val(site + sku);
}

$('#brand').on('change', function() {
	//switchDefault();
});

$('#generator_form').on('change keyup paste', function(e) {
	generate();
});

$('#generator_form #brand, #generator_form #sku').on('change keyup paste', function(e) {
	qrSwitch();
});

// Toggles editing on the qr link field
$('.qr-lock').on('click', function(e) {
	e.preventDefault();
	$('#qr').prop('disabled', function(i, v) { return !v; });
	if($('#qr').hasClass('js-locked')) {
		$('#qr').removeClass('js-locked');
	} else {
		$('#qr').addClass('js-locked');
	}
});

// Moves to next input on enter
$('.inputs').keydown(function (e) {
	if (e.which === 13) {
		e.preventDefault();
		$(this).nextAll('.inputs').first().find('input, select').focus();
	}
});

$('#generator_form').keydown(function(ev) {
	if (ev.ctrlKey && ev.keyCode === 13) {
		$('#download-pdf').trigger('click');
	}
})

$('#download-pdf').on('click', function(e) {
	e.preventDefault();
	var bag = $('#upc_header').val();
	var bagHeader;
	var sku = $('#sku').val();
	var qty = $('#qty').val();

	if (bag == 'Polybag UPC Label') {
		bagHeader = 'PB';
	} else if (bag == 'Master Carton UPC Label') {
		bagHeader = 'MC';
	} else if (bag == 'Inner Carton UPC Label') {
		bagHeader = 'IC';
	}

	var fileName = sku + ' ' + bagHeader + 'UPC Label (' + qty + ').pdf';
	 
	var element = document.getElementById('generated_wrapper');
	var opt = {
		margin: 1,
		filename: fileName,
		image: { type: 'png' },
		html2canvas: { scale: 2 },
		jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
	};

	html2pdf().set(opt).from(element, 'element').save();
	$(".download-note").fadeIn().delay(3000).fadeOut();
});