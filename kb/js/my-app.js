// Initialize your app
var myApp = new Framework7({
	modalTitle: ""
});

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

var storePicker = myApp.picker({
    input: '#storePicker',
    cols: [
        {
            textAlign: 'center',
            values: ['Kho Cầu Hạc', 'Kho Cầu Bố', 'Kho Bãi Cạn', 'Kho Lam Sơn', 'Kho Nghi Sơn', 'Kho Lang Chánh', 'Kho Tĩnh Gia']
        }
    ]
});

// playground requires you to assign document definition to a variable called dd

var pdfDef = {
	content: [
		{ 
			text: 'PHIẾU XUẤT KHO\n\n', 
			style: 'header' 
		},
		{
			text: [
				{ text: 'Tên kho: ', bold: true },
				'Nghi Sơn\n',
				{ text: 'Tên quản lý kho: ', bold: true },
				'Nguyễn Hải Hà\n',
				{ text: 'Thời gian: ', bold: true },
				'18:45, ngày 27/4/2018\n\n',
				{ text: 'Biển số xe: ', bold: true },
				'36A-3451\n',
				{ text: 'Tài xế: ', bold: true },
				'Lê Văn Việt\n',
				{ text: 'Kích thước thùng xe: ', bold: true },
				'5',
				{ text: ' (m3)\n\n', fontSize: 10},
				{ text: 'Cung đường: ', bold: true },
				'Tĩnh Gia - Ngọc Lặc\n\n',
				{ text: 'Loại hàng hóa: ', bold: true },
				'Xi măng\n',
				{ text: 'Số lượng: ', bold: true },
				'35\n\n',
			]
		},
		{ text: 'Hình ảnh kèm theo:', bold: true }
	],
	styles: {
		header: {
			fontSize: 15,
			bold: true
		}
	}
}

function getDataUri(img) {
	var canvas = document.createElement('canvas');
	canvas.width = 120 * img.naturalWidth / img.naturalHeight;
	canvas.height = 120;

	canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);

	return {
		image: canvas.toDataURL('image/png'),
		width: canvas.width,
		height: canvas.height
	}
}

$$("#btnLogin").on("click", function(){
	if (!storePicker.value){
		myApp.alert("Vui lòng chọn kho!");
		return;
	}
	
	if (!$$("#password").val().trim()) {
		myApp.alert("Vui lòng điền mật khẩu!", function(){
			$$("#password").focus();
		});
		return;
	}
	
	myApp.closeModal();
});

myApp.onPageInit('form', function (page) {
	FileReaderJS.setupInput(document.getElementById("fileImg"), {
	readAsDefault: "DataURL",
	on: {
		load: function(e, file) {
			var img = new Image();
			img.onload = function() {
				$$("<div class='small-img'/>")
					.append(img)
					.append('<i class="f7-icons">close</i>')
					.appendTo(".small-img-list");
			};
			img.src = e.target.result;
		}
	}
	});
	
	$$('#btnAddImg').on('click', function () {
		document.getElementById("fileImg").click();
	});
	$$('.small-img i').on('click', function () {
		$$(this).parent().remove();
	});
	$$('.voucher-type').on('click', function () {
		$$('.voucher-type').toggleClass("active");
	});
	$$('#btnCreate').on('click', function () {
		$$('.small-img img').each(function(){
			var uri = getDataUri(this);
			console.log(uri);
			pdfDef.content.push(uri);
		});
		pdfDef.content.push({
			text: [
				{ text: '\nGhi chú: ', bold: true },
				'N/A\n\n',
			]
		});
		pdfMake.createPdf(pdfDef).open();
	});	
});

myApp.onPageInit('view', function (page) {
	var myPhotoBrowser = myApp.photoBrowser({
			photos: ['/img/1.png', '/img/2.png']
	});   
	
	$$('.small-img').on('click', function () {
		myPhotoBrowser.open($$(this).index());
	});
	
	$$('.viewPdf').on('click', function () {
		$$('.small-img img').each(function(){
			var uri = getDataUri(this);
			console.log(uri);
			pdfDef.content.push(uri);
		});
		pdfDef.content.push({
			text: [
				{ text: '\nGhi chú: ', bold: true },
				'N/A\n\n',
			]
		});
		pdfMake.createPdf(pdfDef).open();
	});
});