var env = process.env;

var COLOR = is(env.npm_config_color);

function is(it) {
  return !!it && it !== '0' && it !== 'false';
}

var BANNER = '\u001B[96mThank you for using xayah (\u001B[94m https://github.com/telstatic/xayah \u001B[96m)\u001B[0m';

function showBanner() {
  console.log(COLOR ? BANNER : BANNER.replace(/\u001B\[\d+m/g, ''));
}

showBanner();
