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

$('#download-pdf button').on('click', function(e) {
	var element = document.getElementById('pdf-gen');
	var opt = {
		margin:       1,
		filename:     'myfile.pdf',
		image:        { type: 'png' },
		html2canvas:  { scale: 2 },
		jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
	};

	html2pdf().set(opt).from(element, 'element').save();
});

/* 
var pdf = new jsPDF('p', 'pt', 'letter');
	pdf.html(document.getElementById('pdf-gen'), {
		callback: function (pdf) {
			var iframe = document.createElement('iframe');
			iframe.setAttribute('style', 'position:absolute;right:0; top:0; bottom:0; height:100%; width:500px');
			document.body.appendChild(iframe);
			iframe.src = pdf.output('datauristring');
		}
	}
); */