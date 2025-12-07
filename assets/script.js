// Ensure code runs after DOM parsed (defer on the script is also applied in index.html)
(function(){
  // Wait for DOM content in case the script is loaded without defer
  function init(){
    if(typeof QRious === 'undefined'){
      console.error('QRious library is not loaded. Make sure the CDN script is reachable.');
      return;
    }

    const input = document.getElementById('text-input');
    const genBtn = document.getElementById('generate-btn');
    const downloadLink = document.getElementById('download-link');
    const canvas = document.getElementById('qr-canvas');

    if(!input || !genBtn || !downloadLink || !canvas){
      console.error('Required DOM elements not found. Check your HTML.');
      return;
    }

    // Initialize QRious with the canvas element
    const qr = new QRious({
      element: canvas,
      size: 256,
      value: ''
    });

    function setDownloadAvailable(available){
      if(available){
        downloadLink.classList.remove('disabled');
        downloadLink.setAttribute('aria-disabled','false');
      } else {
        downloadLink.classList.add('disabled');
        downloadLink.setAttribute('aria-disabled','true');
        downloadLink.removeAttribute('href');
        downloadLink.removeAttribute('download');
      }
    }

    function updateDownloadHref(){
      try{
        const dataUrl = canvas.toDataURL('image/png');
        downloadLink.href = dataUrl;
        downloadLink.download = 'qrcode.png';
      } catch(e){
        console.error('Failed to export QR canvas:', e);
        setDownloadAvailable(false);
      }
    }

    function generate(){
      const v = input.value.trim();
      if(!v){
        alert('Please enter text or a URL to generate a QR code.');
        return;
      }
      qr.value = v;
      // ensure the canvas has the latest data before enabling download
      // small timeout to let QRious render into the canvas
      setTimeout(()=>{
        updateDownloadHref();
        setDownloadAvailable(true);
      }, 50);
    }

    genBtn.addEventListener('click', generate);
    input.addEventListener('keydown', function(e){ if(e.key === 'Enter'){ generate(); e.preventDefault(); }});

    // on load make sure there's no download available
    setDownloadAvailable(false);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
