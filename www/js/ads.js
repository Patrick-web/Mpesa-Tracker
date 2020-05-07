document.addEventListener('deviceready',initAds);

function initAds(){
    var admobid = {
        banner: 'ca-app-pub-3940256099942544/6300978111', // or DFP format "/6253334/dfp_example_ad"
        interstitial: 'ca-app-pub-3940256099942544/1033173712'
    };

    AdMob.createBanner({
        adId: admobid.banner,
        position: AdMob.AD_POSITION.BOTTOM_CENTER,
        autoShow: true
    });
}