 /* Retrieved directly from https://raw.githubusercontent.com/antimatter15/jsgif/master/b64.js */
function encode64(input) {
    var output = '', i = 0, l = input.length,
    key = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=', 
    chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    while (i < l) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
        if (isNaN(chr2)) enc3 = enc4 = 64;
        else if (isNaN(chr3)) enc4 = 64;
        output = output + key.charAt(enc1) + key.charAt(enc2) + key.charAt(enc3) + key.charAt(enc4);
    }
    return output;
}

/* Render ColourBrewer for reference */
var colorbrewerDisplay=document.getElementById('colorbrewerDisplay');
var allGradientArr=Object.keys(colorbrewer);
var colorbrewerDisplayHtmlStr='';
for(var colorGradient of allGradientArr) {
    colorbrewerDisplayHtmlStr+='<table class="colorGradientTable">';
    var colorPaletteObj=colorbrewer[colorGradient];
    var combi=Object.keys(colorPaletteObj);
    colorbrewerDisplayHtmlStr+=`<tr><td colspan='${combi.length}'><small><u>${colorGradient}</u></small></td></tr>`;
    colorbrewerDisplayHtmlStr+=`<tr>`;
    for(var noOfColors of combi) {
        var allColorsArr=colorPaletteObj[noOfColors];
        colorbrewerDisplayHtmlStr+=`<th class="blendTH"><small>${noOfColors}</small><span class="blend" style="background:${allColorsArr.join('"></span><span class="blend" style="background:')}"></span></th>`;
        colorbrewerDisplayHtmlStr+=`<th class="blendTH"><small>&nbsp;</small><span class="blend"><small>${allColorsArr.join('</small></span><span class="blend"><small>')}</small></span></th>`;
    } 
    colorbrewerDisplayHtmlStr+='</tr>';
    colorbrewerDisplayHtmlStr+='</table>';
}
colorbrewerDisplay.innerHTML=colorbrewerDisplayHtmlStr;

/* Copyright Year (i.e. Current Year) */
const yearDisplay=document.getElementById('yearDisplay');
yearDisplay.innerHTML=new Date().getFullYear();

/* Declare constants of GIF file output */
const w=150;
const h=150;
const byteToKBScale = 0.0009765625;

const colorPalette=['#d0d1e6','#a6bddb','#74a9cf','#3690c0'];
const baseColor='#023858';
const strokeColor = '#003300';

var backgroundColor='#ffffff';

const lineThickness = 5;
var noOfFrames=4;
var staticFrames='';

const canvas = document.createElement('canvas'); 
canvas.width=w;
canvas.height=h;
const ctx = canvas.getContext('2d');

const encoder = new GIFEncoder(w, h);
encoder.setRepeat(0);
encoder.setDelay(500);
encoder.start();

const GIFDemoTitle=document.getElementById('GIFDemoTitle');
const demoTitles=[
    '🎬 Sample Circle GIF: ◶ ◵ ◴ ◷',
    '🎬 Sample Square GIF: ◫ ◧ ◨ ◧'
];

var selectedGIFType=1;

if(selectedGIFType==0) { /* The following functions and variables are relevent for the CIRCLE GIF file only */
    GIFDemoTitle.innerHTML=demoTitles[selectedGIFType];

    const cx = w / 2;
    const cy = h / 2;

    const radius = (h / 4) + (4 * lineThickness);

    const circleBackground = () => {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, w, h);

        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = baseColor;
        ctx.fill();
    };
    
    const generateCircleFrame = (frameIndex) => { // frameIndex starts at 0
        circleBackground();
        startAngle = frameIndex * (Math.PI / 2);
        endAngle = startAngle + (Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, startAngle, endAngle);
        ctx.closePath();

        ctx.fillStyle=colorPalette[frameIndex];
        ctx.fill();

        let frameB64Str = canvas.toDataURL();
        staticFrames+=`<th><small>Frame #${frameIndex}</small><br><img src=${frameB64Str} /></th>`;
        encoder.addFrame(ctx);
    };
    for(let f=0;f<noOfFrames;f++) {
        generateCircleFrame(f);
    }
} /* END OF functions and variables are relevent for the CIRCLE GIF file only */
else if(selectedGIFType==1) { /* The following functions and variables are relevent for the SQUARE GIF file only */
    GIFDemoTitle.innerHTML=demoTitles[selectedGIFType];

    const slice = h / noOfFrames;
    const squareBackground = () => {
       ctx.fillStyle = baseColor;
       ctx.fillRect(0, 0, w, h);
    };

    const generateSquareFrame = (frameIndex) => { // frameIndex starts at 0
        squareBackground();
        ctx.fillStyle = colorPalette[frameIndex];
        ctx.fillRect(slice*frameIndex, 0, slice, h);

        let frameB64Str = canvas.toDataURL();
        staticFrames+=`<th><small>Frame #${frameIndex}</small><br><img src=${frameB64Str} /></th>`;
        encoder.addFrame(ctx);
    };

    for(let f=0;f<noOfFrames;f++) {
        generateSquareFrame(f);
    }
} /* END OF functions and variables are relevent for the SQUARE GIF file only */

encoder.finish();

const renderOutputDetailsWithDownloadLink = () => {
    const outputGifFileInfo = document.getElementById('outputGifFileInfo');
    const fileType='image/gif';
    var fileName = `gif-output-${(new Date().toGMTString().replace(/(\s|,|:)/g,''))}.gif`;
    var readableStream=encoder.stream();
    var binary_gif =readableStream.getData();
    var b64Str = `data:${fileType};base64,${encode64(binary_gif)}`;
    var fileSize = readableStream.bin.length*byteToKBScale;
    fileSize=fileSize.toFixed(2);

    let dwnlnk = document.createElement('a');
    dwnlnk.download = fileName;
    dwnlnk.innerHTML = `💾 <small>Save</small>`;
    dwnlnk.className = 'btn btn-outline-dark';
    dwnlnk.href = b64Str;

    let htmlStr='<table class="table table-bordered">';
    htmlStr+='<thead>';
    htmlStr+='<tr align="left">'; 
    htmlStr+=`<th colspan='2' class='imageBg'><img src='${b64Str}' alt='${fileName}' /><div class='table-responsive'><table><tr align='center'>${staticFrames}</tr></table></div></th>`;
    htmlStr+='</tr>';
    htmlStr+='</thead>';
    htmlStr+='<tbody>';
    htmlStr+='<tr>';
    htmlStr+='<td>ℹ '+[
                        `Type: <b>${fileType}</b>`, 
                        `Size: <b>${fileSize} ㎅</b>`, 
                        `# of Frame(s): <b>${noOfFrames}</b>`,
                        `Frame (ᴡ ⨯ ʜ): <b>${w} ᵖˣ ⨯ ${h} ᵖˣ</b>`,
                        `${dwnlnk.outerHTML}`
                    ].join(' │ ') +'</td>'; 
    htmlStr+='</tr>';
    htmlStr+='</tbody>';
    htmlStr+='</table>';

    outputGifFileInfo.innerHTML=htmlStr;
};

renderOutputDetailsWithDownloadLink();