$(document).foundation()

$(window).on('load', function() {
	$('#generator_form').trigger('change');
});

$("#generator_form input[type='text']").on("click", function () {
	$(this).select();
});

function generate() {
	var itemMaster = $('#item_master').val();
	var upc = $('#upc').val();
	var sku = $('#sku').val();
	var desc = $('#description').val();
	var qty = $('input[name="qty"]:checked').val();
	var qr = $('#qr').val();

	JsBarcode("#upc-svg", upc, {format: "upc"});
	$('.master-container').text(itemMaster);
	$('.description-container').text(desc);
	$('.sku-container').text(sku);
	$('.quantity-container .qty-val').text(qty)
}

$('#generator_form').on('change keyup paste', function(e) {
	generate();
});

$('#generate').on('click', function(e) {
	e.preventDefault();
	generate();
});

$('#download-pdf').on('click', function(e) {
	e.preventDefault();
	var fileName =  $('#item_master').val() + ' (' + $('input[name="qty"]:checked').val() + 'pack).pdf';
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