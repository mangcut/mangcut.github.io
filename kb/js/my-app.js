// Initialize your app
var myApp = new Framework7();

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

// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageInit('about', function (page) {
    // run createContentPage func after link was clicked
    $$('.create-page').on('click', function () {
        createContentPage();
    });
});